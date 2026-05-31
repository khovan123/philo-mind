import { Image } from "expo-image";
import { AlertCircle, BookOpen, RotateCcw, Search, TrendingUp, Users } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";
import { storyService } from "@/services/story.service";
import type { ListStoriesFilters, StorySummary, StoryDifficulty } from "@/types/story";

// ── Design tokens (dark-mode palette matching the rest of the app) ───────────

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  surfaceSoft: "#18181B",
  input: "#1E1E22",
  chip: "#27272A",
  chipActive: "#3D2800",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  locked: "#52525B",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  primaryText: "#0C0C0E",
  easy: "#22C55E",
  easyBg: "#052E16",
  medium: "#F59E0B",
  mediumBg: "#2C1600",
  hard: "#EF4444",
  hardBg: "#2D0A0A",
  replay: "#7C3AED",
  replayBg: "#1E0A3C",
};

// ── Filter chip config ───────────────────────────────────────────────────────

type FilterKey = "ALL" | StoryDifficulty;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "EASY", label: "Dễ" },
  { key: "MEDIUM", label: "Trung bình" },
  { key: "HARD", label: "Khó" },
];

// ── Difficulty helpers ───────────────────────────────────────────────────────

function difficultyLabel(d: StoryDifficulty): string {
  switch (d) {
    case "EASY":
      return "Dễ";
    case "MEDIUM":
      return "Trung bình";
    case "HARD":
      return "Khó";
  }
}

function difficultyColors(d: StoryDifficulty): { color: string; bg: string } {
  switch (d) {
    case "EASY":
      return { color: Colors.easy, bg: Colors.easyBg };
    case "MEDIUM":
      return { color: Colors.medium, bg: Colors.mediumBg };
    case "HARD":
      return { color: Colors.hard, bg: Colors.hardBg };
  }
}

// ── Skeleton placeholder ─────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonBody}>
        <View style={[styles.skeletonLine, { width: "40%" }]} />
        <View style={[styles.skeletonLine, { width: "90%", height: 18 }]} />
        <View style={[styles.skeletonLine, { width: "70%" }]} />
        <View style={[styles.skeletonLine, { width: "55%" }]} />
      </View>
    </View>
  );
}

// ── Story card ───────────────────────────────────────────────────────────────

type StoryCardProps = { story: StorySummary };

function StoryCard({ story }: StoryCardProps) {
  const diff = difficultyColors(story.difficulty);
  // Replay indicator: shown when at least one session was completed globally.
  // TODO: Replace with user-specific "hasPlayed" when a /sessions/me endpoint is available.
  const hasReplayed = story.stats.completedPlayCount > 0;

  return (
    <Pressable style={({ pressed }) => [styles.storyCard, pressed && styles.storyCardPressed]}>
      {/* Cover image / fallback */}
      {story.coverImageUrl ? (
        <Image source={story.coverImageUrl} contentFit="cover" style={styles.storyCardImage} />
      ) : (
        <View style={styles.storyCardFallback}>
          <BookOpen color={Colors.locked} size={36} />
        </View>
      )}

      <View style={styles.storyCardBody}>
        {/* Badges row */}
        <View style={styles.badgeRow}>
          {/* Topic category */}
          <View style={styles.topicBadge}>
            <ThemedText style={styles.topicBadgeText}>
              {story.topic.category.toUpperCase()}
            </ThemedText>
          </View>

          {/* Difficulty */}
          <View style={[styles.difficultyBadge, { backgroundColor: diff.bg }]}>
            <ThemedText style={[styles.difficultyBadgeText, { color: diff.color }]}>
              {difficultyLabel(story.difficulty)}
            </ThemedText>
          </View>

          {/* Replay indicator */}
          {hasReplayed && (
            <View style={styles.replayBadge}>
              <RotateCcw color={Colors.replay} size={10} />
              <ThemedText style={styles.replayBadgeText}>Chơi lại</ThemedText>
            </View>
          )}
        </View>

        {/* Title */}
        <ThemedText style={styles.storyTitle} numberOfLines={2}>
          {story.title}
        </ThemedText>

        {/* Description */}
        <ThemedText style={styles.storyDescription} numberOfLines={2}>
          {story.description}
        </ThemedText>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Users color={Colors.muted} size={12} />
            <ThemedText style={styles.statText}>
              {story.stats.totalPlayCount.toLocaleString()} lượt chơi
            </ThemedText>
          </View>

          {story.stats.totalPlayCount > 0 && (
            <View style={styles.statItem}>
              <TrendingUp color={Colors.muted} size={12} />
              <ThemedText style={styles.statText}>
                {story.stats.completionRate}% hoàn thành
              </ThemedText>
            </View>
          )}

          {story.estimatedMinutes !== null && (
            <View style={styles.statItem}>
              <ThemedText style={styles.statText}>~{story.estimatedMinutes} phút</ThemedText>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <View style={styles.emptyState}>
      <BookOpen color={Colors.locked} size={48} />
      <ThemedText style={styles.emptyTitle}>
        {isFiltered ? "Không tìm thấy câu chuyện" : "Chưa có câu chuyện nào"}
      </ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        {isFiltered
          ? "Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm."
          : "Câu chuyện triết học sẽ xuất hiện ở đây."}
      </ThemedText>
    </View>
  );
}

// ── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.emptyState}>
      <AlertCircle color={Colors.hard} size={48} />
      <ThemedText style={styles.emptyTitle}>Đã có lỗi xảy ra</ThemedText>
      <ThemedText style={styles.emptySubtitle}>{message}</ThemedText>
      <Pressable style={styles.retryButton} onPress={onRetry}>
        <ThemedText style={styles.retryButtonText}>Thử lại</ThemedText>
      </Pressable>
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function LearnScreen() {
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Retry: increment counter to re-trigger the fetch effect
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Filter change: set loading immediately, then let the effect fire
  const handleFilterChange = useCallback((key: FilterKey) => {
    setActiveFilter(key);
    setLoading(true);
    setError(null);
  }, []);

  // Debounce search input by 300 ms
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setLoading(true);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(text.trim());
    }, 300);
  }, []);

  // Fetch stories: setState only in .then()/.catch() callbacks, not synchronously
  useEffect(() => {
    let cancelled = false;

    const filters: ListStoriesFilters = { limit: 50 };
    if (activeFilter !== "ALL") filters.difficulty = activeFilter;
    if (debouncedSearch) filters.search = debouncedSearch;

    storyService
      .listStories(filters)
      .then((result) => {
        if (!cancelled) {
          setStories(result.stories ?? []);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Không thể tải danh sách câu chuyện.";
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeFilter, debouncedSearch, retryCount]);

  const isFiltered = activeFilter !== "ALL" || debouncedSearch.length > 0;

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title block */}
          <View style={styles.titleBlock}>
            <ThemedText style={styles.title}>Câu chuyện</ThemedText>
            <ThemedText style={styles.subtitle}>
              Đưa ra lựa chọn và khám phá hệ quả triết học của chúng.
            </ThemedText>
          </View>

          {/* Search bar */}
          <View style={styles.searchBox}>
            <Search color={Colors.locked} size={18} />
            <TextInput
              id="story-search-input"
              placeholder="Tìm câu chuyện..."
              placeholderTextColor={Colors.locked}
              selectionColor={Colors.primaryLight}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
            />
          </View>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {FILTERS.map((f) => {
              const active = f.key === activeFilter;
              return (
                <Pressable
                  key={f.key}
                  id={`filter-chip-${f.key.toLowerCase()}`}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => handleFilterChange(f.key)}
                >
                  <ThemedText
                    style={[styles.filterChipText, active && styles.filterChipTextActive]}
                  >
                    {f.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Content area */}
          {loading ? (
            <View style={styles.listContainer}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : error ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : stories.length === 0 ? (
            <EmptyState isFiltered={isFiltered} />
          ) : (
            <View style={styles.listContainer}>
              {/* Story count */}
              <ThemedText style={styles.countLabel}>{stories.length} câu chuyện</ThemedText>

              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}

              {/* Bottom spacer handled by contentContainerStyle paddingBottom */}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + 120,
    gap: Spacing.three,
    maxWidth: 820,
    width: "100%",
    alignSelf: "center",
  },

  // ── Title block
  titleBlock: {
    gap: Spacing.one,
  },

  title: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  // ── Search
  searchBox: {
    minHeight: 46,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.input,
    borderWidth: 1,
    borderColor: "transparent",
  },

  searchInput: {
    flex: 1,
    minHeight: 44,
    color: Colors.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: "600",
    padding: 0,
  },

  // ── Filters
  filterList: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },

  filterChip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: Colors.input,
  },

  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.chipActive,
  },

  filterChipText: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },

  filterChipTextActive: {
    color: Colors.primaryLight,
  },

  // ── List
  listContainer: {
    gap: Spacing.two,
  },

  countLabel: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  // ── Story card
  storyCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSoft,
    overflow: "hidden",
  },

  storyCardPressed: {
    opacity: 0.85,
    borderColor: Colors.primary,
  },

  storyCardImage: {
    width: "100%",
    height: 180,
  },

  storyCardFallback: {
    width: "100%",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.input,
  },

  storyCardBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },

  // ── Badges
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    alignItems: "center",
  },

  topicBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    backgroundColor: Colors.chip,
  },

  topicBadgeText: {
    color: Colors.muted,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  difficultyBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },

  difficultyBadgeText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
  },

  replayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    backgroundColor: Colors.replayBg,
  },

  replayBadgeText: {
    color: Colors.replay,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "900",
  },

  // ── Text
  storyTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },

  storyDescription: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },

  // ── Stats row
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
    alignItems: "center",
    paddingTop: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  statText: {
    color: Colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },

  // ── Skeleton
  skeletonCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSoft,
    overflow: "hidden",
  },

  skeletonImage: {
    width: "100%",
    height: 140,
    backgroundColor: Colors.chip,
  },

  skeletonBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },

  skeletonLine: {
    height: 14,
    borderRadius: Radius.sm,
    backgroundColor: Colors.chip,
  },

  // ── Empty / Error state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },

  emptyTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  emptySubtitle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: Platform.select({ web: 360, default: 280 }),
  },

  retryButton: {
    marginTop: Spacing.two,
    minHeight: 42,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },

  retryButtonText: {
    color: Colors.primaryText,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
});
