import { Redirect, useRouter } from "expo-router";
import { ChevronRight, Flame, Play, Target } from "lucide-react-native";
import { ActivityIndicator, RefreshControl } from "react-native";

import { NotificationBell } from "@/components/notification-bell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TreeColors } from "@/constants/chapterLesson";
import { Colors as ThemeColors } from "@/constants/theme";
import { useShouldShowOnboarding } from "@/lib/onboarding-state";
import {
  type ChapterMeta,
  useGetAllChapterProgressQuery,
  useGetChapterNodesQuery,
  useGetChaptersQuery,
} from "@/services/rtk-api/chapter.api";
import { useGetLearningDashboardQuery } from "@/services/rtk-api/learning.api";
import { type ProfileSummary, useGetProfileSummaryQuery } from "@/services/rtk-api/profile.api";
import { useAppSelector } from "@/stores/hooks";
import { Pressable, SafeAreaView, ScrollView, View } from "@/tw";

type ContinueTarget = {
  title: string;
  subtitle: string;
  progress: number;
  cta: string;
  eyebrow: string;
  onPress: () => void;
};

type MissionTarget = {
  title: string;
  subtitle: string;
  progressText: string;
  progress: number;
  onPress: () => void;
};

function clampPercent(value: number | undefined | null) {
  if (!Number.isFinite(value ?? NaN)) return 0;
  return Math.min(100, Math.max(0, Math.round(value ?? 0)));
}

function displayName(fullName?: string | null) {
  const clean = fullName?.trim();
  if (!clean) return "bạn";
  return clean;
}

function countCompleted(
  progress: Record<string, { status?: string }> | undefined,
  order: string[],
) {
  return order.filter((muc) => progress?.[muc]?.status === "done").length;
}

function findActiveChapter(
  chapters: ChapterMeta[] | undefined,
  chapterProgress: Record<string, Record<string, { status?: string; draft?: unknown }>>,
) {
  for (const chapter of chapters ?? []) {
    const progress = chapterProgress[chapter.id] ?? {};
    const doneCount = countCompleted(progress, chapter.order);
    const progressPercent = chapter.nodeCount ? (doneCount / chapter.nodeCount) * 100 : 0;

    if (progressPercent < 100) {
      const draftMuc = chapter.order.find(
        (muc) => progress[muc]?.status !== "done" && progress[muc]?.draft,
      );
      const availableMuc =
        draftMuc ?? chapter.order.find((muc) => progress[muc]?.status === "available");
      const firstMuc = chapter.order[0];
      const fallbackNextMuc =
        chapter.order.find((muc) => progress[muc]?.status !== "done") ?? firstMuc;

      return {
        chapter,
        muc: availableMuc ?? fallbackNextMuc,
        doneCount,
        progressPercent: clampPercent(progressPercent),
        hasDraft: Boolean(draftMuc),
      };
    }
  }

  return null;
}

function missionFromBadge(
  badge: ProfileSummary["badges"][number],
  router: ReturnType<typeof useRouter>,
): MissionTarget {
  const target = Math.max(1, badge.target || 1);
  const progress = clampPercent((badge.progress / target) * 100);
  const remaining = Math.max(1, target - (badge.progress || 0));
  const normalizedName = badge.name.replace(/^huy hiệu\s+/i, "").trim();
  const badgeName = normalizedName || badge.name;
  const remainingLabel = (unit: string) =>
    `Hoàn thành ${remaining} ${unit} nữa để đạt huy hiệu ${badgeName}`;

  if (badge.conditionType.includes("quiz")) {
    return {
      title: remainingLabel("quiz"),
      subtitle: badge.description ?? `Mục tiêu huy hiệu: ${badge.name}`,
      progressText: `${badge.progress}/${badge.target}`,
      progress,
      onPress: () => router.push("/(tabs)/learn" as never),
    };
  }

  if (badge.conditionType.includes("short_lesson")) {
    return {
      title: remainingLabel("short lesson"),
      subtitle: badge.description ?? `Mục tiêu huy hiệu: ${badge.name}`,
      progressText: `${badge.progress}/${badge.target}`,
      progress,
      onPress: () => router.push("/short-lesson" as never),
    };
  }

  if (badge.conditionType.includes("lesson")) {
    return {
      title: remainingLabel("bài học"),
      subtitle: badge.description ?? `Mục tiêu huy hiệu: ${badge.name}`,
      progressText: `${badge.progress}/${badge.target}`,
      progress,
      onPress: () => router.push("/(tabs)/learn" as never),
    };
  }

  return {
    title: remainingLabel("hoạt động"),
    subtitle: badge.description ?? `Mục tiêu huy hiệu: ${badge.name}`,
    progressText: `${badge.progress}/${badge.target}`,
    progress,
    onPress: () => router.push("/(tabs)/learn" as never),
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const shouldShowOnboarding = useShouldShowOnboarding();
  const authUser = useAppSelector((state) => state.auth.user);
  const {
    data: dashboard,
    isFetching: isFetchingDashboard,
    refetch: refetchDashboard,
  } = useGetLearningDashboardQuery();
  const {
    data: profileSummary,
    isFetching: isFetchingProfile,
    refetch: refetchProfile,
  } = useGetProfileSummaryQuery();
  const {
    data: chapters,
    isFetching: isFetchingChapters,
    refetch: refetchChapters,
  } = useGetChaptersQuery();
  const {
    data: chapterProgress,
    isFetching: isFetchingProgress,
    refetch: refetchProgress,
  } = useGetAllChapterProgressQuery();
  const activeChapter = findActiveChapter(chapters, chapterProgress ?? {});
  const {
    data: activeChapterNodes,
    isFetching: isFetchingActiveNodes,
    refetch: refetchActiveNodes,
  } = useGetChapterNodesQuery(activeChapter?.chapter.id ?? "", {
    skip: !activeChapter,
  });

  if (shouldShowOnboarding === null) {
    return null;
  }

  if (shouldShowOnboarding) {
    return <Redirect href="../onboarding" />;
  }

  const refreshing =
    isFetchingDashboard ||
    isFetchingProfile ||
    isFetchingChapters ||
    isFetchingProgress ||
    isFetchingActiveNodes;
  const user = profileSummary?.user ?? authUser;
  const currentStreak =
    profileSummary?.activity?.streak?.currentStreak ?? dashboard?.streak?.currentStreak ?? 0;
  const activeNode = activeChapterNodes?.nodes.find((node) => node.muc === activeChapter?.muc);
  const dashboardItem = dashboard?.continueLearning?.[0];
  const continueTarget: ContinueTarget = activeChapter
    ? {
        title: activeNode?.title ?? activeChapter.chapter.title,
        subtitle: activeNode
          ? `Chương ${activeChapter.chapter.id} - mục ${activeChapter.muc}`
          : activeChapter.hasDraft
            ? `Tiếp tục mục ${activeChapter.muc}`
            : `Bài tiếp theo: mục ${activeChapter.muc}`,
        progress: activeChapter.progressPercent,
        cta:
          activeChapter.progressPercent > 0
            ? "Tiếp tục"
            : `Bắt đầu lộ trình Chương ${activeChapter.chapter.id}`,
        eyebrow: activeChapter.progressPercent > 0 ? "Đang học" : "Đề xuất cho người mới",
        onPress: () =>
          router.push({
            pathname: "/chapter/[chapter]/[muc]" as never,
            params: {
              chapter: activeChapter.chapter.id,
              muc: activeChapter.muc,
              replay: "0",
            },
          }),
      }
    : dashboardItem
      ? {
          title: dashboardItem.title,
          subtitle: dashboardItem.subtitle,
          progress: clampPercent(dashboardItem.progress),
          cta: "Tiếp tục",
          eyebrow: "Đang học dở",
          onPress: () =>
            router.push({
              pathname: "/full-lesson" as never,
              params: { lessonId: dashboardItem.lessonId },
            }),
        }
      : {
          title: "Khởi động lộ trình Kinh tế chính trị",
          subtitle: "Bắt đầu với node đầu tiên để app ghi nhớ tiến độ học của bạn.",
          progress: 0,
          cta: "Bắt đầu lộ trình",
          eyebrow: "Đề xuất cho người mới",
          onPress: () => router.push("/(tabs)/learn" as never),
        };

  const nextBadge = profileSummary?.badges?.find((badge) => !badge.isEarned) ?? null;
  const mission = nextBadge
    ? missionFromBadge(nextBadge, router)
    : {
        title: "Giữ nhịp học hôm nay",
        subtitle: "Hoàn thành 1 node để duy trì chuỗi ngày học.",
        progressText: `${currentStreak} ngày`,
        progress: currentStreak > 0 ? 100 : 0,
        onPress: () => router.push("/(tabs)/learn" as never),
      };

  function handleRefresh() {
    void refetchDashboard();
    void refetchProfile();
    void refetchChapters();
    void refetchProgress();
    if (activeChapter) {
      void refetchActiveNodes();
    }
  }

  return (
    <ThemedView type="background" className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={TreeColors.primaryLight}
              onRefresh={handleRefresh}
            />
          }
        >
          <View
            className={styles.personalHeader}
            style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
          >
            <View className="min-w-0 flex-1">
              <ThemedText className={styles.greeting}>
                Xin chào {displayName(user?.fullName)}
              </ThemedText>
              <ThemedText className={styles.greetingSub} themeColor="textSecondary">
                App đã giữ chỗ học tiếp cho bạn hôm nay.
              </ThemedText>
            </View>

            <View className={styles.headerActions}>
              <View
                className={styles.streakPill}
                style={{
                  backgroundColor: TreeColors.surfaceActive,
                  borderColor: TreeColors.borderStrong,
                }}
              >
                <Flame color={TreeColors.primary} fill={TreeColors.primary} size={16} />
                <ThemedText className={styles.streakText} themeColor="primaryLight">
                  {currentStreak} ngày
                </ThemedText>
              </View>
              <NotificationBell />
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={continueTarget.onPress}
            className={styles.heroCard}
            style={({ pressed }) => [
              {
                backgroundColor: TreeColors.surfaceActive,
                borderColor: TreeColors.primary,
              },
              pressed ? pressedStyle : undefined,
            ]}
          >
            <View className={styles.heroTopRow}>
              <View
                className={styles.eyebrowPill}
                style={{ backgroundColor: `${TreeColors.primary}24` }}
              >
                <Play color={TreeColors.primaryLight} size={13} />
                <ThemedText className={styles.eyebrowText} themeColor="primaryLight">
                  {continueTarget.eyebrow}
                </ThemedText>
              </View>
              <ThemedText className={styles.heroPercent} themeColor="primaryLight">
                {continueTarget.progress}%
              </ThemedText>
            </View>

            <View className="gap-1">
              <ThemedText className={styles.heroTitle}>{continueTarget.title}</ThemedText>
              <ThemedText className={styles.heroSubtitle} themeColor="textSecondary">
                {continueTarget.subtitle}
              </ThemedText>
            </View>

            <View className={styles.progressBlock}>
              <View className={styles.progressTrack} style={{ backgroundColor: TreeColors.chip }}>
                <View
                  className={styles.progressFill}
                  style={{
                    backgroundColor: TreeColors.primary,
                    width: `${continueTarget.progress}%`,
                  }}
                />
              </View>
              <View
                className={styles.heroActionRow}
                style={{ backgroundColor: TreeColors.primary }}
              >
                <ThemedText className={styles.ctaText} themeColor="buttonText">
                  {continueTarget.cta}
                </ThemedText>
                <ChevronRight color={TreeColors.primaryText} size={18} />
              </View>
            </View>
          </Pressable>

          <View
            className={styles.missionCard}
            style={{ backgroundColor: TreeColors.surface, borderColor: TreeColors.border }}
          >
            <View className={styles.sectionHeader}>
              <View className="flex-row items-center gap-2">
                <Target color={TreeColors.primaryLight} size={18} />
                <ThemedText className={styles.sectionTitle}>Học hôm nay</ThemedText>
              </View>
              <ThemedText className={styles.missionTime} themeColor="textSecondary">
                2-5 phút
              </ThemedText>
            </View>

            <View className="gap-1">
              <ThemedText className={styles.missionTitle}>{mission.title}</ThemedText>
              <ThemedText className={styles.missionSubtitle} themeColor="textSecondary">
                {mission.subtitle}
              </ThemedText>
            </View>

            <View className={styles.missionBottom}>
              <View className="min-w-0 flex-1">
                <View className={styles.missionProgressMeta}>
                  <ThemedText className={styles.tinyLabel} themeColor="textSecondary">
                    Tiến độ huy hiệu
                  </ThemedText>
                  <ThemedText className={styles.tinyValue} themeColor="primaryLight">
                    {mission.progressText}
                  </ThemedText>
                </View>
                <View className={styles.smallTrack} style={{ backgroundColor: TreeColors.chip }}>
                  <View
                    className={styles.smallFill}
                    style={{
                      backgroundColor: ThemeColors.dark.success,
                      width: `${mission.progress}%`,
                    }}
                  />
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={mission.onPress}
                className={styles.smallButton}
                style={({ pressed }) => [
                  { backgroundColor: TreeColors.chip },
                  pressed ? pressedStyle : undefined,
                ]}
              >
                <ThemedText className={styles.smallButtonText}>Làm ngay</ThemedText>
              </Pressable>
            </View>
          </View>

          {refreshing ? (
            <View className="items-center py-1">
              <ActivityIndicator color={TreeColors.primaryLight} />
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const pressedStyle = { opacity: 0.8, transform: [{ scale: 0.985 }] };

const styles = {
  content: "w-full max-w-[820px] self-center gap-3 p-3 pb-[220px]",
  personalHeader: "min-h-[76px] flex-row items-center justify-between gap-3 rounded-md border p-3",
  greeting: "text-[22px] font-extrabold leading-[28px]",
  greetingSub: "mt-0.5 text-[13px] font-semibold leading-[18px]",
  headerActions: "flex-row items-center gap-2",
  streakPill: "min-h-[34px] flex-row items-center gap-1.5 rounded-sm border px-2",
  streakText: "text-[12px] font-extrabold leading-4",
  heroCard: "min-h-[244px] justify-between overflow-hidden rounded-md border p-4",
  heroTopRow: "flex-row items-center justify-between gap-3",
  eyebrowPill: "flex-row items-center gap-1.5 rounded-sm px-2 py-1",
  eyebrowText: "text-[11px] font-extrabold uppercase leading-[15px]",
  heroPercent: "font-mono text-[26px] font-black leading-[32px]",
  heroTitle: "font-sans text-[25px] font-extrabold leading-[31px]",
  heroSubtitle: "text-[14px] font-semibold leading-[20px]",
  progressBlock: "gap-3",
  progressTrack: "h-2 overflow-hidden rounded-full",
  progressFill: "h-full rounded-full",
  heroActionRow: "min-h-[44px] flex-row items-center justify-center gap-1 rounded-sm px-3",
  ctaText: "text-[14px] font-extrabold leading-[18px]",
  missionCard: "gap-3 rounded-md border p-3",
  sectionHeader: "flex-row items-center justify-between gap-3",
  sectionTitle: "text-[18px] font-extrabold leading-[24px]",
  missionTime: "text-[11px] font-extrabold uppercase leading-[15px]",
  missionTitle: "text-[18px] font-extrabold leading-[24px]",
  missionSubtitle: "text-[13px] font-semibold leading-[19px]",
  missionBottom: "flex-row items-end gap-3",
  missionProgressMeta: "mb-1 flex-row items-center justify-between",
  tinyLabel: "text-[11px] font-bold leading-[15px]",
  tinyValue: "font-mono text-[12px] font-extrabold leading-4",
  smallTrack: "h-1.5 overflow-hidden rounded-full",
  smallFill: "h-full rounded-full",
  smallButton: "min-h-[38px] justify-center rounded-sm px-3",
  smallButtonText: "text-[12px] font-extrabold leading-4",
};
