import { Redirect, useRouter } from "expo-router";
import { BookOpen, Flame, Gavel, Sparkles } from "lucide-react-native";
import { RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { useShouldShowOnboarding } from "@/lib/onboarding-state";
import { useGetLearningDashboardQuery } from "@/services/rtk-api/learning.api";
import { Pressable, ScrollView, View } from "@/tw";
import { Image } from "@/tw/image";

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

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: dashboard, isFetching, refetch } = useGetLearningDashboardQuery();
  const shouldShowOnboarding = useShouldShowOnboarding();

  if (shouldShowOnboarding === null) {
    return null;
  }

  if (shouldShowOnboarding) {
    return <Redirect href="../onboarding" />;
  }

  const getDifficultyTranslation = (difficulty: string | undefined) => {
    if (!difficulty) return "";
    const lower = difficulty.toLowerCase();
    if (lower === "dễ" || lower === "easy") return t("home.difficulty_easy");
    if (lower === "trung bình" || lower === "medium") return t("home.difficulty_medium");
    if (lower === "nâng cao" || lower === "khó" || lower === "advanced" || lower === "hard")
      return t("home.difficulty_hard");
    return difficulty;
  };

  const getDurationTranslation = (duration: string | undefined) => {
    if (!duration) return "";
    const match = duration.match(/^(\d+)\s*(phút|mins?|minutes?)$/i);
    if (match) {
      return t("home.new_story_duration", { count: parseInt(match[1], 10) });
    }
    return duration;
  };

  const visibleLearningItems =
    dashboard?.continueLearning && dashboard.continueLearning.length > 0
      ? dashboard.continueLearning.map((item) => ({
          id: item.lessonId,
          title: item.title,
          subtitle: item.subtitle,
          difficulty: getDifficultyTranslation(item.difficulty),
          progress: item.progress,
          icon: Gavel,
        }))
      : [
          {
            id: undefined,
            title: t("home.learning_socrates_title"),
            subtitle: t("home.learning_socrates_subtitle"),
            difficulty: t("home.difficulty_medium"),
            progress: 60,
            icon: Gavel,
          },
          {
            id: undefined,
            title: t("home.learning_kant_title"),
            subtitle: t("home.learning_kant_subtitle"),
            difficulty: t("home.difficulty_hard"),
            progress: 35,
            icon: BookOpen,
          },
        ];

  const dailyHook = dashboard?.dailyHook;
  const newStory = dashboard?.newStory;
  const quote = dashboard?.quote;

  return (
    <View className={styles.screen}>
      <SafeAreaView edges={["top"]} className={styles.safeArea}>
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              tintColor={Colors.primaryLight}
              onRefresh={refetch}
            />
          }
        >
          <View className={styles.streakCard}>
            <View className={styles.rowCenter}>
              <Flame color={Colors.primary} fill={Colors.primary} size={18} />
              <ThemedText className={styles.streakText}>
                {t("home.streak_days", { count: dashboard?.streak?.currentStreak ?? 0 })}
              </ThemedText>
            </View>

            <View className={styles.pointsGroup}>
              <ThemedText className={styles.points}>{dashboard?.points ?? 0}</ThemedText>
              <ThemedText className={styles.pointsLabel}>{t("home.points_label")}</ThemedText>
            </View>
          </View>

          <View className={styles.hookCard}>
            <Image source={dailyHookImage} contentFit="cover" className="absolute inset-0" />
            <View className={styles.imageScrim} />
            <View className={styles.hookContent}>
              <View className={styles.topicPill}>
                <ThemedText className={styles.topicPillText}>
                  {dailyHook?.topic ?? t("home.daily_hook_fallback")}
                </ThemedText>
              </View>

              <ThemedText className={styles.hookTitle}>
                {dailyHook?.title ?? t("home.daily_hook_no_data")}
              </ThemedText>

              <View className={styles.answerRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(tabs)/story" as never)}
                  className={styles.primaryAnswer}
                  style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                >
                  <ThemedText className={styles.primaryAnswerText}>
                    {dailyHook?.primaryChoice ?? t("home.daily_hook_start")}
                  </ThemedText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(tabs)/explore" as never)}
                  className={styles.secondaryAnswer}
                  style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                >
                  <ThemedText className={styles.secondaryAnswerText}>
                    {dailyHook?.secondaryChoice ?? t("home.daily_hook_more")}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <ThemedText className={styles.sectionTitle}>{t("home.continue_learning")}</ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName={styles.learningList}
            >
              {visibleLearningItems.map((item, index) => {
                const Icon = item.icon;
                const lessonId = (item as { id?: string }).id;

                return (
                  <Pressable
                    key={(item as { id?: string }).id ?? `${item.title}-${index}`}
                    accessibilityRole="button"
                    onPress={() =>
                      lessonId
                        ? router.push({
                            pathname: "/full-lesson" as never,
                            params: { lessonId },
                          })
                        : router.push("/(tabs)/explore" as never)
                    }
                    className={styles.learningCard}
                    style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                  >
                    <View className={styles.learningHeader}>
                      <View className={styles.learningIcon}>
                        <Icon color={Colors.primaryLight} size={16} />
                      </View>

                      <View className={styles.difficultyPill}>
                        <ThemedText className={styles.difficultyText}>{item.difficulty}</ThemedText>
                      </View>
                    </View>

                    <View className={styles.learningBody}>
                      <ThemedText className={styles.learningTitle}>{item.title}</ThemedText>
                      <ThemedText className={styles.learningSubtitle}>{item.subtitle}</ThemedText>
                    </View>

                    <View className={styles.progressMeta}>
                      <ThemedText className={styles.progressLabel}>
                        {t("home.progress_label")}
                      </ThemedText>
                      <ThemedText className={styles.progressLabel}>{item.progress}%</ThemedText>
                    </View>

                    <View className={styles.progressTrack}>
                      <View
                        className={styles.progressFill}
                        style={{ width: `${item.progress}%` }}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className={styles.statsGrid}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(tabs)/learn" as never)}
              className={styles.statCard}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ThemedText className={styles.statValue}>
                {dashboard?.stats?.learnedLessons ?? 12}
              </ThemedText>
              <ThemedText className={styles.statLabel}>{t("home.stats_lessons")}</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/badges" as never)}
              className={styles.statCard}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ThemedText className={styles.statValue}>{dashboard?.stats?.badges ?? 4}</ThemedText>
              <ThemedText className={styles.statLabel}>{t("home.stats_badges")}</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(tabs)/learn" as never)}
              className={styles.statCard}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ThemedText className={styles.statValue}>
                {dashboard?.stats?.quizAccuracy ?? 86}%
              </ThemedText>
              <ThemedText className={styles.statLabel}>{t("home.stats_accuracy")}</ThemedText>
            </Pressable>
          </View>

          <View className={styles.section}>
            <ThemedText className={styles.sectionTitle}>{t("home.new_story")}</ThemedText>

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
              className={styles.storyCard}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <Image source={storyImage} contentFit="cover" className={styles.storyImage} />

              <View className={styles.storyContent}>
                <View className={styles.storyMeta}>
                  <ThemedText className={styles.storyBadge}>
                    {newStory?.topic ?? t("navigation.story")}
                  </ThemedText>
                  <ThemedText className={styles.storyTime}>
                    {getDurationTranslation(newStory?.duration) ||
                      t("home.new_story_duration", { count: 8 })}
                  </ThemedText>
                </View>

                <ThemedText className={styles.storyTitle}>
                  {newStory?.title ?? t("home.no_new_story")}
                </ThemedText>
                <ThemedText className={styles.storySubtitle} numberOfLines={1}>
                  {newStory?.subtitle ?? t("home.no_new_story_desc")}
                </ThemedText>
              </View>
            </Pressable>
          </View>

          <View className={styles.quoteCard}>
            <Sparkles color={Colors.primaryLight} size={16} />
            <View className={styles.quoteCopy}>
              <ThemedText className={styles.quoteText}>
                {quote?.text ?? t("home.quote_fallback")}
              </ThemedText>
              <ThemedText className={styles.quoteAuthor}>
                - {quote?.author ?? "PhiloMind"}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const pressedStyle = { opacity: 0.78, transform: [{ scale: 0.98 }] };

const styles = {
  screen: "flex-1 bg-[#0C0C0E]",
  safeArea: "flex-1",
  content: "w-full max-w-[820px] self-center gap-3 p-3 pb-[220px]",
  streakCard:
    "min-h-[58px] flex-row items-center justify-between rounded-md border border-[#353437] bg-[#18181B] px-3",
  rowCenter: "flex-row items-center gap-2",
  streakText: "text-[14px] font-bold leading-[18px] text-[#E5E1E4]",
  pointsGroup: "flex-row items-baseline gap-1",
  points: "font-mono text-[16px] font-bold leading-[20px] text-[#D97706]",
  pointsLabel: "text-[10px] font-bold leading-[14px] text-[#A1A1AA]",
  hookCard:
    "min-h-[320px] justify-end overflow-hidden rounded-md border border-[#353437] bg-[#18181B]",
  imageScrim: "absolute inset-0 bg-[#0C0C0E]/60",
  hookContent: "gap-3 p-3",
  topicPill: "self-start rounded-sm bg-[#27272A] px-2 py-1",
  topicPillText: "text-[10px] font-extrabold leading-[14px] text-[#A1A1AA]",
  hookTitle: "max-w-[560px] font-sans text-[24px] font-extrabold leading-[30px] text-[#E5E1E4]",
  answerRow: "flex-row flex-wrap gap-2",
  primaryAnswer: "min-h-[42px] items-center justify-center rounded-sm bg-[#D97706] px-3",
  primaryAnswerText: "text-[13px] font-extrabold leading-[18px] text-[#2F1500]",
  secondaryAnswer:
    "min-h-[42px] items-center justify-center rounded-sm border border-[#27272A] bg-[#0C0C0E]/55 px-3",
  secondaryAnswerText: "text-[13px] font-extrabold leading-[18px] text-[#E5E1E4]",
  section: "gap-2",
  sectionTitle: "font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]",
  learningList: "gap-2 pr-3",
  learningCard:
    "min-h-[176px] w-[260px] justify-between rounded-md border border-[#353437] bg-[#18181B] p-3",
  learningHeader: "flex-row items-center justify-between",
  learningIcon: "h-[34px] w-[34px] items-center justify-center rounded-sm bg-[#27272A]",
  difficultyPill: "rounded-sm border border-[#27272A] px-2 py-1",
  difficultyText: "text-[10px] font-extrabold uppercase leading-[14px] text-[#A1A1AA]",
  learningBody: "gap-0.5",
  learningTitle: "text-[17px] font-extrabold leading-[22px] text-[#E5E1E4]",
  learningSubtitle: "text-[13px] font-medium leading-[18px] text-[#A1A1AA]",
  progressMeta: "flex-row justify-between",
  progressLabel: "text-[11px] font-bold leading-[14px] text-[#A1A1AA]",
  progressTrack: "h-1 overflow-hidden rounded-full bg-[#27272A]",
  progressFill: "h-full rounded-full bg-[#D97706]",
  statsGrid: "flex-row gap-2",
  statCard:
    "min-h-[82px] flex-1 justify-center gap-0.5 rounded-md border border-[#353437] bg-[#18181B] p-2",
  statValue: "text-center font-mono text-[21px] font-extrabold leading-[26px] text-[#FFB77D]",
  statLabel: "text-center text-[11px] font-bold leading-[15px] text-[#A1A1AA]",
  storyCard:
    "min-h-[112px] flex-row overflow-hidden rounded-md border border-[#353437] bg-[#18181B]",
  storyImage: "w-[112px]",
  storyContent: "flex-1 justify-center gap-1 p-3",
  storyMeta: "flex-row flex-wrap items-center gap-2",
  storyBadge:
    "rounded-full bg-[#27272A] px-2 py-0.5 text-[10px] font-extrabold leading-[14px] text-[#A1A1AA]",
  storyTime: "text-[10px] font-bold leading-[14px] text-[#A1A1AA]",
  storyTitle: "text-[16px] font-extrabold leading-[21px] text-[#E5E1E4]",
  storySubtitle: "text-[13px] font-normal italic leading-[18px] text-[#A1A1AA]",
  quoteCard: "flex-row gap-2 border-t border-[#27272A] pt-3",
  quoteCopy: "flex-1 gap-1 border-l-2 border-[#D97706] pl-2",
  quoteText: "text-[15px] font-semibold italic leading-[22px] text-[#E5E1E4]",
  quoteAuthor: "text-[12px] font-extrabold uppercase leading-[16px] text-[#FFB77D]",
};
