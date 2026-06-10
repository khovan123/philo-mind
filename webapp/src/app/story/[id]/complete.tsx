import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryStatsQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import { useMindmapStore } from "@/stores/mindmap.store";

// ── Main Component ───────────────────────────────────────────
export default function StoryCompleteScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const {
    currentStory,
    activeSession,
    quizScore,
    lastDecisionChoiceId,
    completeActiveSession,
    setReflectionJournal,
    resetStore,
  } = useStoryStore();

  // ── RTK Query: Community Stats ──────────────────────────────
  const { data: stats, isLoading: statsLoading } = useGetStoryStatsQuery(storyId ?? "", {
    skip: !storyId,
  });

  // ── State ───────────────────────────────────────────────────
  const [journalText, setJournalText] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // ── Animations ──────────────────────────────────────────────
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // ── Derived data ────────────────────────────────────────────
  const choiceMade = useMemo(() => {
    if (!lastDecisionChoiceId || !currentStory?.choices) return null;
    return currentStory.choices.find((c) => c.id === lastDecisionChoiceId) ?? null;
  }, [lastDecisionChoiceId, currentStory]);

  const communityPercent = useMemo(() => {
    if (!stats?.decisionDistribution || !lastDecisionChoiceId) return null;
    const total = Object.values(stats.decisionDistribution).reduce((a, b) => a + b, 0);
    if (total === 0) return null;
    const myCount = stats.decisionDistribution[lastDecisionChoiceId] ?? 0;
    return Math.round((myCount / total) * 100);
  }, [stats, lastDecisionChoiceId]);

  // ── Handlers ────────────────────────────────────────────────
  const handleComplete = useCallback(async () => {
    if (completing) return;
    setCompleting(true);
    try {
      if (journalText.trim()) setReflectionJournal(journalText.trim());
      if (activeSession && activeSession.status !== "COMPLETED") {
        await completeActiveSession();
      }
      setCompleted(true);
    } catch {
      // Session may already be completed
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  }, [completing, journalText, activeSession, completeActiveSession, setReflectionJournal]);

  const handleGoHome = useCallback(() => {
    resetStore();
    router.replace("/(tabs)/story" as never);
  }, [resetStore, router]);

  const { selectTopic } = useMindmapStore();

  const handleGoToMindmap = useCallback(async () => {
    if (currentStory?.topic?.id) {
      try {
        await selectTopic(currentStory.topic.id);
      } catch {
        // Safe to ignore or log
      }
    }
    resetStore();
    router.replace("/mindmap" as never);
  }, [currentStory, resetStore, router, selectTopic]);

  // ── Render ──────────────────────────────────────────────────
  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Hoàn thành kịch bản</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            {currentStory?.title ?? "Episode Complete"}
          </ThemedText>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Completion Banner ── */}
        <View style={styles.bannerSection}>
          <View
            style={[
              styles.awardCircle,
              { backgroundColor: "rgba(217,119,6,0.15)", borderColor: theme.primary },
            ]}
          >
            <Award color={theme.primary} size={44} />
          </View>
          <ThemedText type="title" style={styles.bannerTitle}>
            {completed ? "Kịch bản hoàn thành! 🎉" : "Tổng kết kịch bản"}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.bannerSub}>
            {completed
              ? "Bạn đã hoàn thành hành trình triết học này."
              : "Xem lại kết quả và ghi nhận suy nghĩ của bạn."}
          </ThemedText>
        </View>

        {/* ── Stats Summary ── */}
        <View style={styles.statsGrid}>
          {/* Quiz Score */}
          <Card style={styles.statCard}>
            <Sparkles color={theme.primary} size={20} />
            <ThemedText type="title" style={[styles.statValue, { color: theme.primary }]}>
              {quizScore != null ? `${quizScore * 10}` : "—"}
            </ThemedText>
            <ThemedText type="label" themeColor="textSecondary">
              Điểm Quiz
            </ThemedText>
          </Card>

          {/* Choice Made */}
          <Card style={styles.statCard}>
            <CheckCircle2 color={theme.success} size={20} />
            <ThemedText type="smallBold" numberOfLines={1} style={styles.statValue}>
              {choiceMade ? choiceMade.choiceText.slice(0, 20) : "—"}
            </ThemedText>
            <ThemedText type="label" themeColor="textSecondary">
              Lựa chọn
            </ThemedText>
          </Card>
        </View>

        {/* ── Community Stats ── */}
        <Card style={[styles.section, { borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <Users color={theme.primary} size={18} />
            <ThemedText type="smallBold">Cộng đồng đã chọn</ThemedText>
          </View>

          {statsLoading ? (
            <ActivityIndicator color={theme.primary} style={{ marginVertical: Spacing.three }} />
          ) : stats ? (
            <View style={styles.communityContent}>
              {communityPercent != null && (
                <View style={styles.percentRow}>
                  <ThemedText type="title" style={[styles.percentValue, { color: theme.primary }]}>
                    {communityPercent}%
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    người chơi cũng chọn giống bạn
                  </ThemedText>
                </View>
              )}

              <View style={styles.statRow}>
                <BarChart3 color={theme.textMuted} size={14} />
                <ThemedText type="label" themeColor="textSecondary">
                  {stats.totalSessions} lượt chơi · {stats.completionRate}% hoàn thành
                </ThemedText>
              </View>

              {/* Choice distribution bars */}
              {stats.choiceStats && stats.choiceStats.length > 0 && (
                <View style={styles.distList}>
                  {stats.choiceStats.map((cs) => (
                    <View key={cs.choiceId} style={styles.distItem}>
                      <View style={styles.distLabel}>
                        <ThemedText type="label" numberOfLines={1} style={{ flex: 1 }}>
                          {cs.content}
                        </ThemedText>
                        <ThemedText type="label" themeColor="textMuted">
                          {cs.percentage}%
                        </ThemedText>
                      </View>
                      <View
                        style={[styles.distTrack, { backgroundColor: theme.backgroundElement }]}
                      >
                        <View
                          style={[
                            styles.distFill,
                            {
                              backgroundColor:
                                cs.choiceId === lastDecisionChoiceId
                                  ? theme.primary
                                  : theme.tertiary,
                              width: `${cs.percentage}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              Chưa có dữ liệu cộng đồng.
            </ThemedText>
          )}
        </Card>

        {/* ── Reflection Journal ── */}
        {!completed && (
          <Card style={[styles.section, { borderColor: theme.border }]}>
            <View style={styles.sectionHeader}>
              <BookOpen color={theme.primary} size={18} />
              <ThemedText type="smallBold">Nhật ký suy ngẫm</ThemedText>
            </View>
            <ThemedText
              type="label"
              themeColor="textSecondary"
              style={{ marginBottom: Spacing.two }}
            >
              Ghi lại suy nghĩ sau hành trình (tuỳ chọn)
            </ThemedText>
            <TextInput
              value={journalText}
              onChangeText={setJournalText}
              placeholder="Hành trình này giúp tôi nhận ra..."
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[
                styles.journalInput,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            />
          </Card>
        )}

        {/* ── Completed Badge ── */}
        {completed && (
          <Card style={[styles.completedBadge, { borderColor: theme.success }]}>
            <CheckCircle2 color={theme.success} size={24} />
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold" style={{ color: theme.success }}>
                Đã lưu thành công!
              </ThemedText>
              <ThemedText type="label" themeColor="textSecondary">
                Tiến trình và nhật ký đã được ghi nhận.
              </ThemedText>
            </View>
          </Card>
        )}
      </Animated.ScrollView>

      {/* ── Footer ── */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {!completed ? (
          <Button
            title={completing ? "Đang lưu..." : "Hoàn thành kịch bản ✓"}
            onPress={handleComplete}
            disabled={completing}
            fullWidth
          />
        ) : (
          <View style={styles.footerRow}>
            <Button
              title="Khám phá Mindmap 🧠"
              onPress={handleGoToMindmap}
              variant="primary"
              fullWidth
              style={{ flex: 1 }}
            />
            <Button
              title="Về trang chủ"
              onPress={handleGoHome}
              variant="outline"
              fullWidth
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Banner
  bannerSection: {
    alignItems: "center",
    paddingTop: Spacing.four * 2,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  awardCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  bannerTitle: { fontWeight: "800", textAlign: "center", marginBottom: Spacing.one },
  bannerSub: { textAlign: "center", lineHeight: 20 },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
  },
  statValue: { fontWeight: "800" },

  // Sections
  section: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },

  // Community
  communityContent: { gap: Spacing.two },
  percentRow: { alignItems: "center", paddingVertical: Spacing.two },
  percentValue: { fontSize: 36, fontWeight: "900", lineHeight: 42 },
  statRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  distList: { gap: Spacing.two, marginTop: Spacing.two },
  distItem: { gap: Spacing.one },
  distLabel: { flexDirection: "row", justifyContent: "space-between" },
  distTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  distFill: { height: "100%", borderRadius: 3 },

  // Journal
  journalInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    fontSize: 14,
    lineHeight: 20,
  },

  // Completed badge
  completedBadge: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  // Footer
  footer: { borderTopWidth: 1, padding: Spacing.three },
  footerRow: { flexDirection: "row", gap: Spacing.two },
});
