// ── T-D13: Step 6 KNOWLEDGE screen (community stats + concepts) ──
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BarChart3, BookOpen, Clock, Globe, Tag, Users } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepProgress } from "@/components/story/StepProgress";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery, useGetStoryStatsQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import type { PhilosophyTag } from "@/types/story";

type KnowledgeTab = "stats" | "concepts" | "history";

export default function KnowledgeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { lastDecisionChoiceId, setStep } = useStoryStore();
  const { data: story } = useGetStoryDetailQuery(storyId || "");
  const { data: stats, isLoading: statsLoading } = useGetStoryStatsQuery(storyId || "");

  const [activeTab, setActiveTab] = useState<KnowledgeTab>("stats");

  // Entrance animation via useMemo
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Community choice distribution for visualization
  const choiceDistribution = useMemo(() => {
    if (!stats?.decisionDistribution || !story?.choices) return [];

    const totalDecisions = Object.values(stats.decisionDistribution).reduce(
      (sum, count) => sum + (count as number),
      0,
    );

    return story.choices.map((choice, index) => {
      const count = (stats.decisionDistribution?.[choice.id] as number) ?? 0;
      const percentage = totalDecisions > 0 ? Math.round((count / totalDecisions) * 100) : 0;
      const isUserChoice = choice.id === lastDecisionChoiceId;
      const letter = String.fromCharCode(65 + index);

      return {
        id: choice.id,
        label: choice.choiceText,
        letter,
        count,
        percentage,
        isUserChoice,
      };
    });
  }, [stats, story, lastDecisionChoiceId]);

  // Collect all philosophy tags from the story
  const allTags = useMemo(() => {
    if (!story) return [];
    const tagMap = new Map<string, PhilosophyTag>();

    // From learn cards
    story.learnCards?.forEach((card) => {
      card.tags?.forEach(({ tag }: { tag: PhilosophyTag }) => {
        if (tag && !tagMap.has(tag.id)) {
          tagMap.set(tag.id, tag);
        }
      });
    });

    return Array.from(tagMap.values());
  }, [story]);

  function handleContinue() {
    setStep("minigame");
    router.push(`/story/${storyId}/minigame` as never);
  }

  if (!story) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StepProgress
        currentStep="knowledge"
        completedSteps={["intro", "learn", "dilemma", "choose", "result"]}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <View style={styles.headerLabelRow}>
            <Globe color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              BƯỚC 6: TRI THỨC
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1}>
            {story.title}
          </ThemedText>
        </View>
      </View>

      {/* Tab navigation */}
      <View style={styles.tabRow}>
        {(
          [
            { key: "stats" as KnowledgeTab, label: "Cộng đồng", icon: BarChart3 },
            { key: "concepts" as KnowledgeTab, label: "Khái niệm", icon: Tag },
            { key: "history" as KnowledgeTab, label: "Lịch sử", icon: Clock },
          ] as const
        ).map(({ key, label, icon: Icon }) => {
          const isActive = key === activeTab;
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => setActiveTab(key)}
              style={[
                styles.tabBtn,
                {
                  borderBottomColor: isActive ? theme.primary : "transparent",
                  borderBottomWidth: isActive ? 2 : 0,
                },
              ]}
            >
              <Icon color={isActive ? theme.primary : theme.textMuted} size={16} />
              <ThemedText
                type="smallBold"
                style={{
                  color: isActive ? theme.primary : theme.textMuted,
                  fontSize: 13,
                }}
              >
                {label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* COMMUNITY STATS TAB */}
          {activeTab === "stats" && (
            <View style={styles.tabContent}>
              {statsLoading ? (
                <View style={styles.center}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <ThemedText
                    type="small"
                    themeColor="textSecondary"
                    style={{ marginTop: Spacing.two }}
                  >
                    Đang tải thống kê cộng đồng...
                  </ThemedText>
                </View>
              ) : (
                <>
                  {/* Summary Stats */}
                  <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: theme.surfaceElevated }]}>
                      <Users color={theme.primaryLight} size={20} />
                      <ThemedText style={styles.statNumber}>{stats?.totalSessions ?? 0}</ThemedText>
                      <ThemedText type="label" themeColor="textSecondary">
                        Người tham gia
                      </ThemedText>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: theme.surfaceElevated }]}>
                      <Clock color={theme.primaryLight} size={20} />
                      <ThemedText style={styles.statNumber}>
                        {stats?.averageTimeMinutes
                          ? `${Math.round(stats.averageTimeMinutes)}'`
                          : "—"}
                      </ThemedText>
                      <ThemedText type="label" themeColor="textSecondary">
                        Thời gian TB
                      </ThemedText>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: theme.surfaceElevated }]}>
                      <BarChart3 color={theme.primaryLight} size={20} />
                      <ThemedText style={styles.statNumber}>
                        {stats?.completionRate != null
                          ? `${Math.round(stats.completionRate)}%`
                          : "—"}
                      </ThemedText>
                      <ThemedText type="label" themeColor="textSecondary">
                        Hoàn thành
                      </ThemedText>
                    </View>
                  </View>

                  {/* Choice Distribution Bars */}
                  <View
                    style={[
                      styles.distributionCard,
                      { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.distributionHeader}>
                      <BarChart3 color={theme.primary} size={16} />
                      <ThemedText type="smallBold" style={{ marginLeft: Spacing.two }}>
                        Phân bố lựa chọn cộng đồng
                      </ThemedText>
                    </View>

                    {choiceDistribution.length === 0 && (
                      <ThemedText
                        type="small"
                        themeColor="textMuted"
                        style={{ textAlign: "center" }}
                      >
                        Chưa có dữ liệu lựa chọn.
                      </ThemedText>
                    )}

                    {choiceDistribution.map((choice) => (
                      <View key={choice.id} style={styles.barRow}>
                        <View style={styles.barLabel}>
                          <View
                            style={[
                              styles.barLetter,
                              {
                                backgroundColor: choice.isUserChoice
                                  ? theme.primary
                                  : theme.backgroundElement,
                              },
                            ]}
                          >
                            <ThemedText
                              type="label"
                              style={{
                                color: choice.isUserChoice ? "#FFFFFF" : theme.textMuted,
                                fontWeight: "800",
                                fontSize: 10,
                              }}
                            >
                              {choice.letter}
                            </ThemedText>
                          </View>
                          <ThemedText
                            type="small"
                            numberOfLines={1}
                            style={{
                              flex: 1,
                              fontWeight: choice.isUserChoice ? "700" : "400",
                              color: choice.isUserChoice ? theme.primary : theme.text,
                            }}
                          >
                            {choice.label}
                          </ThemedText>
                        </View>

                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                backgroundColor: choice.isUserChoice
                                  ? theme.primary
                                  : theme.primaryDark,
                                width: `${Math.max(choice.percentage, 2)}%`,
                              },
                            ]}
                          />
                        </View>

                        <View style={styles.barStats}>
                          <ThemedText
                            type="smallBold"
                            style={{
                              color: choice.isUserChoice ? theme.primary : theme.text,
                              fontSize: 14,
                            }}
                          >
                            {choice.percentage}%
                          </ThemedText>
                          <ThemedText type="label" themeColor="textMuted">
                            ({choice.count} người)
                          </ThemedText>
                        </View>

                        {/* "Your choice" badge */}
                        {choice.isUserChoice && (
                          <View
                            style={[styles.yourBadge, { backgroundColor: "rgba(217,119,6,0.15)" }]}
                          >
                            <ThemedText
                              type="label"
                              style={{ color: theme.primary, fontSize: 9, fontWeight: "800" }}
                            >
                              BẠN
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {/* CONCEPTS TAB */}
          {activeTab === "concepts" && (
            <View style={styles.tabContent}>
              {allTags.length === 0 ? (
                <View style={styles.center}>
                  <Tag color={theme.textMuted} size={32} />
                  <ThemedText
                    type="small"
                    themeColor="textMuted"
                    style={{ marginTop: Spacing.two }}
                  >
                    Chưa có khái niệm nào được gắn thẻ.
                  </ThemedText>
                </View>
              ) : (
                allTags.map((tag) => (
                  <View
                    key={tag.id}
                    style={[
                      styles.conceptCard,
                      { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.conceptHeader}>
                      <BookOpen color={theme.primaryLight} size={16} />
                      <ThemedText style={styles.conceptName}>{tag.name}</ThemedText>
                    </View>
                    {tag.description && (
                      <ThemedText
                        type="small"
                        themeColor="textSecondary"
                        style={{ lineHeight: 22 }}
                      >
                        {tag.description}
                      </ThemedText>
                    )}
                  </View>
                ))
              )}
            </View>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <View style={[styles.tabContent, styles.center]}>
              <Clock color={theme.textMuted} size={40} />
              <ThemedText
                type="smallBold"
                themeColor="textSecondary"
                style={{ marginTop: Spacing.two }}
              >
                Lịch sử phiên
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textMuted"
                style={{ textAlign: "center", marginTop: Spacing.one }}
              >
                Tính năng này sẽ hiển thị các lần bạn đã tham gia kịch bản này trước đó.
              </ThemedText>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title="Tiếp tục: Mini Game"
          onPress={handleContinue}
          style={{ flex: 1, backgroundColor: theme.primary }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center", padding: Spacing.four },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: { flex: 1 },
  headerLabelRow: { flexDirection: "row", alignItems: "center" },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  tabContent: { gap: Spacing.three },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: Radius.md,
    gap: Spacing.one,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
  },
  distributionCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  distributionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  barRow: {
    gap: Spacing.one,
  },
  barLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  barLetter: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  barTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  barStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  yourBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  conceptCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  conceptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  conceptName: {
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});
