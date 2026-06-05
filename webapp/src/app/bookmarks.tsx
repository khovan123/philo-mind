import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  BookText,
  Brain,
  Compass,
  Heart,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useListBookmarksQuery, useRemoveBookmarkMutation } from "@/services/rtk-api/bookmark.api";
import { bookmarkTargetTypes, type BookmarkItem, type BookmarkTargetType } from "@/types/bookmark";

type FilterType = BookmarkTargetType | "ALL";

const targetCopy: Record<BookmarkTargetType, { label: string; routeLabel: string; color: string }> =
  {
    LESSON: { label: "Bài học", routeLabel: "Mở bài học", color: "#38BDF8" },
    SHORT_LESSON: { label: "Bài ngắn", routeLabel: "Mở bài ngắn", color: "#34D399" },
    STORY: { label: "Câu chuyện", routeLabel: "Mở suy ngẫm", color: "#A78BFA" },
    DEBATE: { label: "Tranh luận", routeLabel: "Mở tranh luận", color: "#FB7185" },
    TOPIC: { label: "Chủ đề", routeLabel: "Mở bản đồ tư duy", color: "#F59E0B" },
  };

export default function BookmarksScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [filter, setFilter] = useState<FilterType>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const {
    data: items = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch: retry,
  } = useListBookmarksQuery({ targetType: filter });

  const [removeBookmark] = useRemoveBookmarkMutation();

  const loading = isLoading || isFetching;

  const error = useMemo(() => {
    if (localError) return localError;
    if (!queryError) return null;
    if ("data" in queryError) {
      const errorData = queryError.data as { message?: string } | null;
      return errorData?.message || "Không thể tải bookmarks";
    }
    return "message" in queryError ? queryError.message : "Không thể tải bookmarks";
  }, [queryError, localError]);

  const successMessage = useMemo(() => {
    if (localSuccess) return localSuccess;
    if (isLoading || isFetching || error) return null;
    return items.length ? `Đã tải ${items.length} bookmark` : "Chưa có bookmark trong nhóm này";
  }, [items, isLoading, isFetching, error, localSuccess]);

  async function remove(bookmark: BookmarkItem) {
    setDeletingId(bookmark.id);
    setLocalError(null);
    setLocalSuccess(null);
    try {
      await removeBookmark(bookmark.id).unwrap();
      setLocalSuccess("Đã bỏ bookmark");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err.data as { message?: string })?.message
          : err instanceof Error
            ? err.message
            : "Không thể bỏ bookmark";
      setLocalError(errorMessage || "Không thể bỏ bookmark");
    } finally {
      setDeletingId(null);
    }
  }

  const grouped = useMemo(() => groupBookmarks(items), [items]);
  const isEmpty = !loading && !error && items.length === 0;

  function openBookmark(bookmark: BookmarkItem) {
    switch (bookmark.targetType) {
      case "LESSON":
        router.push(`/quiz/${bookmark.targetId}` as never);
        return;
      case "SHORT_LESSON":
        router.push("/short-lesson" as never);
        return;
      case "STORY":
        router.push(`/story/${bookmark.targetId}/reflect` as never);
        return;
      case "DEBATE":
        router.push("/(tabs)/debate" as never);
        return;
      case "TOPIC":
        router.push("/mindmap" as never);
        return;
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={theme.text} size={20} />
          </Pressable>
          <View style={styles.topTitle}>
            <ThemedText type="smallBold">Đã lưu</ThemedText>
            <ThemedText type="label" themeColor="textMuted">
              theo danh mục
            </ThemedText>
          </View>
          <Pressable
            disabled={loading}
            onPress={retry}
            style={[styles.iconButton, loading && styles.disabled]}
          >
            <RefreshCw color={theme.text} size={18} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
              <Heart color={theme.buttonText} fill={theme.buttonText} size={22} />
            </View>
            <View style={styles.heroCopy}>
              <ThemedText style={styles.title}>Danh sách bookmark</ThemedText>
              <ThemedText style={styles.subtitle}>
                Lưu lại bài học, topic, story hoặc debate và mở tiếp đúng flow khi cần.
              </ThemedText>
            </View>
          </View>

          <View style={[styles.statusStrip, { borderColor: theme.border }]}>
            <ThemedText type="smallBold">{filterLabel(filter)}</ThemedText>
            <ThemedText type="label" themeColor={error ? "danger" : "textMuted"}>
              {error ?? successMessage ?? "Sẵn sàng tải bookmark"}
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRail}
          >
            <FilterChip label="Tất cả" active={filter === "ALL"} onPress={() => setFilter("ALL")} />
            {bookmarkTargetTypes.map((targetType) => (
              <FilterChip
                key={targetType}
                label={targetCopy[targetType].label}
                active={filter === targetType}
                onPress={() => setFilter(targetType)}
              />
            ))}
          </ScrollView>

          {loading ? (
            <StatePanel>
              <ActivityIndicator color={theme.primaryLight} size="large" />
              <ThemedText type="smallBold">Đang tải bookmarks...</ThemedText>
              <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
                Các CTA đang tạm disable để tránh thao tác lặp.
              </ThemedText>
            </StatePanel>
          ) : null}

          {!loading && error ? (
            <StatePanel>
              <RefreshCw color={theme.danger} size={32} />
              <ThemedText type="smallBold">Không tải được bookmarks</ThemedText>
              <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
                {error}
              </ThemedText>
              <Button title="Thử lại" onPress={retry} />
            </StatePanel>
          ) : null}

          {isEmpty ? (
            <StatePanel>
              <Sparkles color={theme.primaryLight} size={34} />
              <ThemedText type="smallBold">Chưa có bookmark</ThemedText>
              <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
                Bookmark một topic từ mindmap hoặc quay lại học tập để tiếp tục.
              </ThemedText>
              <Button title="Mở học tập" onPress={() => router.push("/(tabs)/learn" as never)} />
            </StatePanel>
          ) : null}

          {!loading && !error
            ? grouped.map(([targetType, bookmarks]) => (
                <View key={targetType} style={styles.group}>
                  <View style={styles.groupHeader}>
                    <View style={styles.groupTitle}>
                      <TargetIcon targetType={targetType} />
                      <ThemedText type="smallBold">{targetCopy[targetType].label}</ThemedText>
                    </View>
                    <ThemedText type="label" themeColor="textMuted">
                      {bookmarks.length}
                    </ThemedText>
                  </View>

                  {bookmarks.map((bookmark) => (
                    <BookmarkRow
                      key={bookmark.id}
                      bookmark={bookmark}
                      deleting={deletingId === bookmark.id}
                      onOpen={() => openBookmark(bookmark)}
                      onRemove={() => remove(bookmark)}
                    />
                  ))}
                </View>
              ))
            : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText type="label" style={{ color: active ? theme.buttonText : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function BookmarkRow({
  bookmark,
  deleting,
  onOpen,
  onRemove,
}: {
  bookmark: BookmarkItem;
  deleting: boolean;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const theme = useTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const copy = targetCopy[bookmark.targetType];

  function removeWithAnimation() {
    scale.setValue(0.86);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, friction: 4, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(onRemove);
  }

  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable disabled={deleting} onPress={onOpen} style={styles.rowMain}>
        <View style={[styles.typeDot, { backgroundColor: copy.color }]} />
        <View style={styles.rowCopy}>
          <ThemedText type="smallBold">{copy.label}</ThemedText>
          <ThemedText type="label" themeColor="textMuted">
            {shortId(bookmark.targetId)} • {formatDate(bookmark.createdAt)}
          </ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            {copy.routeLabel}
          </ThemedText>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={deleting}
        onPress={removeWithAnimation}
        style={[styles.heartButton, deleting && styles.disabled]}
      >
        {deleting ? (
          <ActivityIndicator color="#FB7185" size="small" />
        ) : (
          <Animated.View style={{ transform: [{ scale }] }}>
            <Heart color="#FB7185" fill="#FB7185" size={20} />
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

function StatePanel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return <View style={[styles.statePanel, { borderColor: theme.border }]}>{children}</View>;
}

function TargetIcon({ targetType }: { targetType: BookmarkTargetType }) {
  const color = targetCopy[targetType].color;

  switch (targetType) {
    case "LESSON":
      return <BookOpen color={color} size={18} />;
    case "SHORT_LESSON":
      return <BookText color={color} size={18} />;
    case "STORY":
      return <Compass color={color} size={18} />;
    case "DEBATE":
      return <MessageSquare color={color} size={18} />;
    case "TOPIC":
      return <Brain color={color} size={18} />;
  }
}

function groupBookmarks(items: BookmarkItem[]): [BookmarkTargetType, BookmarkItem[]][] {
  return bookmarkTargetTypes
    .map(
      (targetType) => [targetType, items.filter((item) => item.targetType === targetType)] as const,
    )
    .filter(([, group]) => group.length > 0)
    .map(([targetType, group]) => [targetType, group]);
}

function filterLabel(filter: FilterType) {
  return filter === "ALL" ? "Tất cả bookmark" : targetCopy[filter].label;
}

function shortId(id: string) {
  return id.length > 12 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Không rõ ngày";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  topBar: {
    minHeight: 64,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topTitle: {
    alignItems: "center",
    gap: 2,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: "#A1A1AA",
  },
  statusStrip: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  filterRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  filterChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  statePanel: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  centerText: {
    textAlign: "center",
  },
  group: {
    gap: Spacing.two,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  row: {
    minHeight: 82,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  typeDot: {
    width: 12,
    height: 48,
    borderRadius: Radius.full,
  },
  rowCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.55,
  },
});
