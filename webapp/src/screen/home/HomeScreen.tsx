import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { BookOpen, Flame, Gavel, Sparkles } from "lucide-react-native";
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";
import { shouldShowOnboarding } from "@/lib/onboarding-state";
import { useGetLearningDashboardQuery } from "@/services/rtk-api/learning.api";

const Colors = {
  background: "#0C0C0E",
  surface: "#18181B",
  chip: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  primaryText: "#2F1500",
};

const dailyHookImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJPt3eiSoYTeoZDPKie1AboPtqTWxp8szN2DLl8AtY1kenHDYAeD6xRTdRgGQ8lHSsil5UAT9f7nKmfpfyD_QQNzEAAGFo9JdxXaSkSiE1pHTZ2TSLCXr6gTs8rHiu_D-QtVV6wQTnxQ9l3DPJutyKVP4zupk8g9N5vV57t_iobJWWEg2iSFv8SCvsynPex4DaSGOzXAH4MquMqlcBcmsAglZ4n8kckk-oQ5U1sU3IxwsVF8GrD4OTK2g9BE_aq7MHbCCYex_AV8BH";

const storyImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPW4ODe4_QUeKZd9n42xhLw9sYnejBsAuagcIld_jq2mtm_RveitFBRLaL07LQXoK-Xl28v7qHCFtdnDOAMyC909PQTlIrZhLvoLmnrK0XySJ4vMgPvib8fe4u93sgseq8ZneAKqV4E9ehJ5kELZojHSx5CbiMq_YRMMjAc3zA5cw-FiHD1xSRZKkJ-_aTp29cThfdTpLIL8UT_R1EUSqp6JGENJw7VWDm_HQCqsvmpL3iLCr04A2BuMCMBjDMs0ait2XsnADraRIk";

const learningItems = [
  {
    title: "Phiên tòa Socrates",
    subtitle: "Đạo đức & Chính trị",
    difficulty: "Trung bình",
    progress: 60,
    icon: Gavel,
  },
  {
    title: "Siêu hình học Kant",
    subtitle: "Triết học cổ điển",
    difficulty: "Nâng cao",
    progress: 35,
    icon: BookOpen,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { data: dashboard, isFetching, refetch } = useGetLearningDashboardQuery();

  if (shouldShowOnboarding()) {
    return <Redirect href="../onboarding" />;
  }

  const visibleLearningItems =
    dashboard?.continueLearning && dashboard.continueLearning.length > 0
      ? dashboard.continueLearning.map((item) => ({
          id: item.lessonId,
          title: item.title,
          subtitle: item.subtitle,
          difficulty: item.difficulty,
          progress: item.progress,
          icon: Gavel,
        }))
      : learningItems;
  const dailyHook = dashboard?.dailyHook;
  const newStory = dashboard?.newStory;
  const quote = dashboard?.quote;

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              tintColor={Colors.primaryLight}
              onRefresh={refetch}
            />
          }
        >
          <View style={styles.streakCard}>
            <View style={styles.rowCenter}>
              <Flame color={Colors.primary} fill={Colors.primary} size={18} />
              <ThemedText style={styles.streakText}>
                {dashboard?.streak.currentStreak ?? 0} ngày liên tiếp
              </ThemedText>
            </View>

            <View style={styles.pointsGroup}>
              <ThemedText style={styles.points}>{dashboard?.points ?? 0}</ThemedText>
              <ThemedText style={styles.pointsLabel}>PTS</ThemedText>
            </View>
          </View>

          <View style={styles.hookCard}>
            <Image source={dailyHookImage} contentFit="cover" style={StyleSheet.absoluteFill} />
            <View style={styles.imageScrim} />
            <View style={styles.hookContent}>
              <View style={styles.topicPill}>
                <ThemedText style={styles.topicPillText}>
                  {dailyHook?.topic ?? "Daily Hook"}
                </ThemedText>
              </View>

              <ThemedText style={styles.hookTitle}>
                {dailyHook?.title ?? "Chưa có daily hook từ database."}
              </ThemedText>

              <View style={styles.answerRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(tabs)/story" as never)}
                  style={({ pressed }) => [styles.primaryAnswer, pressed && styles.pressed]}
                >
                  <ThemedText style={styles.primaryAnswerText}>
                    {dailyHook?.primaryChoice ?? "Bắt đầu"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(tabs)/explore" as never)}
                  style={({ pressed }) => [styles.secondaryAnswer, pressed && styles.pressed]}
                >
                  <ThemedText style={styles.secondaryAnswerText}>
                    {dailyHook?.secondaryChoice ?? "Xem thêm"}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Tiếp tục học</ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.learningList}
            >
              {visibleLearningItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Pressable
                    key={(item as { id?: string }).id ?? `${item.title}-${index}`}
                    accessibilityRole="button"
                    onPress={() =>
                      "id" in item && item.id
                        ? router.push({
                            pathname: "/full-lesson" as never,
                            params: { lessonId: item.id },
                          })
                        : router.push("/(tabs)/explore" as never)
                    }
                    style={({ pressed }) => [styles.learningCard, pressed && styles.pressed]}
                  >
                    <View style={styles.learningHeader}>
                      <View style={styles.learningIcon}>
                        <Icon color={Colors.primaryLight} size={16} />
                      </View>

                      <View style={styles.difficultyPill}>
                        <ThemedText style={styles.difficultyText}>{item.difficulty}</ThemedText>
                      </View>
                    </View>

                    <View style={styles.learningBody}>
                      <ThemedText style={styles.learningTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.learningSubtitle}>{item.subtitle}</ThemedText>
                    </View>

                    <View style={styles.progressMeta}>
                      <ThemedText style={styles.progressLabel}>Tiến độ</ThemedText>
                      <ThemedText style={styles.progressLabel}>{item.progress}%</ThemedText>
                    </View>

                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.statsGrid}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(tabs)/learn" as never)}
              style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}
            >
              <ThemedText style={styles.statValue}>
                {dashboard?.stats.learnedLessons ?? 12}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Bài đã học</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/badges" as never)}
              style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}
            >
              <ThemedText style={styles.statValue}>{dashboard?.stats.badges ?? 4}</ThemedText>
              <ThemedText style={styles.statLabel}>Huy hiệu</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(tabs)/learn" as never)}
              style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}
            >
              <ThemedText style={styles.statValue}>
                {dashboard?.stats.quizAccuracy ?? 86}%
              </ThemedText>
              <ThemedText style={styles.statLabel}>Quiz đúng</ThemedText>
            </Pressable>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Câu chuyện mới</ThemedText>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                newStory?.id
                  ? router.push({
                      pathname: "/story/[id]" as never,
                      params: { id: newStory.id },
                    })
                  : router.push("/(tabs)/story" as never)
              }
              style={({ pressed }) => [styles.storyCard, pressed && styles.pressed]}
            >
              <Image source={storyImage} contentFit="cover" style={styles.storyImage} />

              <View style={styles.storyContent}>
                <View style={styles.storyMeta}>
                  <ThemedText style={styles.storyBadge}>{newStory?.topic ?? "Story"}</ThemedText>
                  <ThemedText style={styles.storyTime}>{newStory?.duration ?? "8 phút"}</ThemedText>
                </View>

                <ThemedText style={styles.storyTitle}>
                  {newStory?.title ?? "Chưa có câu chuyện mới"}
                </ThemedText>
                <ThemedText style={styles.storySubtitle} numberOfLines={1}>
                  {newStory?.subtitle ?? "Database chưa có story phù hợp."}
                </ThemedText>
              </View>
            </Pressable>
          </View>

          <View style={styles.quoteCard}>
            <Sparkles color={Colors.primaryLight} size={16} />
            <View style={styles.quoteCopy}>
              <ThemedText style={styles.quoteText}>{quote?.text ?? "Chưa có quote."}</ThemedText>
              <ThemedText style={styles.quoteAuthor}>- {quote?.author ?? "PhiloMind"}</ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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

  streakCard: {
    minHeight: 58,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  streakText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },

  pointsGroup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.one,
  },

  points: {
    color: Colors.primary,
    fontFamily: Fonts.mono,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
  },

  pointsLabel: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
  },

  hookCard: {
    minHeight: 320,
    borderRadius: Radius.md,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  imageScrim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(12, 12, 14, 0.58)",
  },

  hookContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },

  topicPill: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    backgroundColor: Colors.chip,
  },

  topicPillText: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
  },

  hookTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    maxWidth: 560,
  },

  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },

  primaryAnswer: {
    minHeight: 42,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },

  primaryAnswerText: {
    color: Colors.primaryText,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },

  secondaryAnswer: {
    minHeight: 42,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: "rgba(12, 12, 14, 0.55)",
  },

  secondaryAnswerText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },

  section: {
    gap: Spacing.two,
  },

  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },

  learningList: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },

  learningCard: {
    width: Platform.select({ web: 280, default: 260 }),
    minHeight: 176,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: "space-between",
  },

  learningHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  learningIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.chip,
  },

  difficultyPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.chip,
  },

  difficultyText: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  learningBody: {
    gap: Spacing.half,
  },

  learningTitle: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
  },

  learningSubtitle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },

  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabel: {
    color: Colors.muted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },

  progressTrack: {
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.chip,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  statsGrid: {
    flexDirection: "row",
    gap: Spacing.two,
  },

  statCard: {
    flex: 1,
    minHeight: 82,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    gap: Spacing.half,
  },

  statValue: {
    color: Colors.primaryLight,
    fontFamily: Fonts.mono,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  statLabel: {
    color: Colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  storyCard: {
    minHeight: 112,
    flexDirection: "row",
    borderRadius: Radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  storyImage: {
    width: 112,
  },

  storyContent: {
    flex: 1,
    padding: Spacing.three,
    justifyContent: "center",
    gap: Spacing.one,
  },

  storyMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },

  storyBadge: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
    backgroundColor: Colors.chip,
  },

  storyTime: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
  },

  storyTitle: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },

  storySubtitle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },

  quoteCard: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Colors.chip,
  },

  quoteCopy: {
    flex: 1,
    paddingLeft: Spacing.two,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    gap: Spacing.one,
  },

  quoteText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
    fontWeight: "600",
  },

  quoteAuthor: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
