import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Filter,
  Flame,
  Search,
  Sparkles,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useStoryStore } from "@/stores/story.store";
import type { StorySummary, StoryDifficulty } from "@/types/story";

const difficulties: { label: string; value: StoryDifficulty | "ALL" }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Dễ", value: "EASY" },
  { label: "Vừa", value: "MEDIUM" },
  { label: "Khó", value: "HARD" },
];

export default function StoryListScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { stories, loadingStories, error, activeSession, fetchStories, startOrResumeSession } =
    useStoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<StoryDifficulty | "ALL">("ALL");

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Handle local filtering if needed (or refetch if API filters are desired)
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesSearch =
        !searchQuery ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.topic.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "ALL" || story.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [stories, searchQuery, selectedDifficulty]);

  async function handleStartStory(storyId: string) {
    try {
      await startOrResumeSession(storyId);
      router.push(`/story/${storyId}` as never);
    } catch {
      // Handled in store
    }
  }

  function handleResumeActiveSession() {
    if (activeSession) {
      router.push(`/story/${activeSession.storyId}` as never);
    }
  }

  function getDifficultyColor(diff: StoryDifficulty) {
    switch (diff) {
      case "EASY":
        return theme.success ?? "#10B981";
      case "MEDIUM":
        return theme.primary ?? "#D97706";
      case "HARD":
        return theme.danger ?? "#EF4444";
      default:
        return theme.textMuted ?? "#71717A";
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/" as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Kịch bản nhập vai</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Học triết học qua các quyết định lịch sử
          </ThemedText>
        </View>
      </View>

      <View style={styles.container}>
        {/* Active Session Resume Banner */}
        {activeSession && (
          <Card style={[styles.activeBanner, { borderColor: theme.primary }]}>
            <View style={styles.bannerRow}>
              <View style={[styles.bannerIcon, { backgroundColor: "rgba(217, 119, 6, 0.15)" }]}>
                <Flame color={theme.primary} size={20} />
              </View>
              <View style={styles.bannerInfo}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Tiếp tục kịch bản đang học
                </ThemedText>
                <ThemedText type="label" themeColor="textSecondary" numberOfLines={1}>
                  Bạn có tiến trình chưa hoàn thành.
                </ThemedText>
              </View>
              <Button
                title="Học tiếp"
                size="sm"
                onPress={handleResumeActiveSession}
                style={{ backgroundColor: theme.primary }}
              />
            </View>
          </Card>
        )}

        {/* Search and Filters */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
            <Search color={theme.textMuted} size={18} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm kiếm kịch bản, chủ đề..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterIconGroup}>
            <Filter color={theme.textMuted} size={14} />
            <ThemedText type="label" themeColor="textSecondary">
              Độ khó:
            </ThemedText>
          </View>
          <View style={styles.chipsContainer}>
            {difficulties.map((diff) => {
              const isActive = selectedDifficulty === diff.value;
              return (
                <Pressable
                  key={diff.value}
                  onPress={() => setSelectedDifficulty(diff.value)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? theme.primary : theme.backgroundElement,
                      borderColor: isActive ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <ThemedText
                    type="label"
                    style={{
                      color: isActive ? "#0C0C0E" : theme.text,
                      fontWeight: "700",
                    }}
                  >
                    {diff.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Main List */}
        {loadingStories ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
              Đang tải danh sách kịch bản...
            </ThemedText>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <AlertCircle color={theme.danger} size={28} />
            <ThemedText type="smallBold">Không thể tải kịch bản</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              {error}
            </ThemedText>
            <Button title="Thử lại" onPress={() => fetchStories()} variant="outline" />
          </Card>
        ) : filteredStories.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen color={theme.textMuted} size={36} />
            <ThemedText
              type="smallBold"
              themeColor="textSecondary"
              style={{ marginTop: Spacing.two }}
            >
              Không tìm thấy kịch bản nào
            </ThemedText>
            <ThemedText type="label" themeColor="textSecondary" style={styles.centerText}>
              Thử đổi bộ lọc độ khó hoặc tìm kiếm từ khóa khác.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredStories}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: StorySummary }) => {
              const diffColor = getDifficultyColor(item.difficulty);
              const isCurrentSessionStory = activeSession?.storyId === item.id;

              return (
                <Card style={[styles.storyCard, { borderColor: theme.border }]}>
                  {item.coverImageUrl ? (
                    <Image source={{ uri: item.coverImageUrl }} style={styles.coverImage} />
                  ) : (
                    <View
                      style={[styles.imageFallback, { backgroundColor: theme.backgroundElement }]}
                    >
                      <Sparkles color={theme.primaryLight} size={28} />
                    </View>
                  )}

                  <View style={styles.cardBody}>
                    <View style={styles.tagRow}>
                      <View style={[styles.diffBadge, { borderColor: diffColor }]}>
                        <View style={[styles.diffDot, { backgroundColor: diffColor }]} />
                        <ThemedText
                          type="label"
                          style={{ color: diffColor, fontSize: 10, fontWeight: "800" }}
                        >
                          {item.difficulty}
                        </ThemedText>
                      </View>
                      <ThemedText type="label" themeColor="textSecondary">
                        • {item.topic.category}
                      </ThemedText>
                      {item.estimatedMinutes && (
                        <ThemedText type="label" themeColor="textSecondary">
                          • {item.estimatedMinutes} phút
                        </ThemedText>
                      )}
                    </View>

                    <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                      {item.description}
                    </ThemedText>

                    {item.stats && item.stats.completedPlayCount > 0 && (
                      <View style={styles.statsRow}>
                        <ThemedText type="label" themeColor="textSecondary">
                          Đã hoàn thành {item.stats.completedPlayCount} lần • Tỉ lệ lựa chọn đa dạng
                        </ThemedText>
                      </View>
                    )}

                    <View style={styles.ctaRow}>
                      <Button
                        title={isCurrentSessionStory ? "Học tiếp" : "Bắt đầu"}
                        onPress={() => handleStartStory(item.id)}
                        style={isCurrentSessionStory ? { backgroundColor: theme.primary } : {}}
                      />
                    </View>
                  </View>
                </Card>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#353437",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  activeBanner: {
    marginBottom: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerInfo: {
    flex: 1,
  },
  searchRow: {
    marginBottom: Spacing.three,
  },
  searchBox: {
    minHeight: 46,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    fontSize: 14,
    fontWeight: "600",
    padding: 0,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  filterIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorCard: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.three,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: "center",
  },
  listContent: {
    gap: Spacing.three,
    paddingBottom: 40,
  },
  storyCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  coverImage: {
    width: "100%",
    height: 140,
  },
  imageFallback: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    gap: Spacing.one,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  statsRow: {
    marginTop: Spacing.half,
  },
  ctaRow: {
    marginTop: Spacing.two,
    alignItems: "flex-end",
  },
});
