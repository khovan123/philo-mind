import { useState, useMemo, useEffect } from "react";
import { ActivityIndicator, Modal } from "react-native";
import { authService } from "@/services/auth.service";
import { useRouter } from "expo-router";
import {
  Award,
  Bell,
  BookOpen,
  Brain,
  ChevronRight,
  Flame,
  Globe2,
  Info,
  Lock,
  LogOut,
  MessageCircle,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { cn } from "@/lib/utils";
import { useGetProfileSummaryQuery } from "@/services/rtk-api/profile.api";
import { useGetChaptersQuery } from "@/services/rtk-api/chapter.api";
import { securePersistStorage } from "@/stores/persistStorage";
import { getChapterProgressStorageKey } from "@/features/chapter/progress";
import type { ChapterProgress } from "@/types/chapterLesson";
import { Pressable, ScrollView, View } from "@/tw";
import { Image } from "@/tw/image";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  surfaceHigh: "#201F21",
  chip: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  locked: "#52525B",
  primary: "#D97706",
  primaryLight: "#FFB77D",
};

const avatarImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB47zYBVc4mzCb6eGEp98KgZT-1GawU6wYikMQdhbQMzBX9uzUV60BiUsOSyaAHRaYia4MB-FhyRI8zScldy4LZgDWy5WeMEm-JHMad7yqODMymhvbJDXegFnpHkotGK6bUjGf1qmmvcaBFO9dMnaQ3nxQ59xS7gJ6gEzKH3clLaNRhBlRPbks65lXVZIL12u9DGjMl-dCSM6cbFat_-fLjdHoO9GtipP7Wo3GOhJ-BQM1HLl0NdeNsYT47SsatC2eX90nDrs97jrqj";

const BADGE_ICONS: Record<string, any> = {
  shield_check: ShieldCheck,
  scroll_text: ScrollText,
  trophy: Trophy,
  sparkles: Sparkles,
  flame: Flame,
  book_open: BookOpen,
  message_circle: MessageCircle,
  brain: Brain,
  award: Award,
};

const mapConditionToIconKey = (cond: string): string => {
  switch (cond) {
    case "activity_count_1":
      return "sparkles";
    case "reflection_count_5":
      return "brain";
    case "lesson_count_5":
      return "book_open";
    case "quiz_count_3":
      return "trophy";
    case "story_count_3":
      return "scroll_text";
    case "streak_count_3":
      return "flame";
    case "short_lesson_count_10":
      return "sparkles";
    case "activity_count_20":
      return "shield_check";
    case "streak_count_7":
      return "shield_check";
    default:
      return "award";
  }
};

const getBadgeIcon = (conditionType?: string | null) => {
  if (!conditionType) return Sparkles;
  const key = mapConditionToIconKey(conditionType);
  return BADGE_ICONS[key] ?? Award;
};

const formatLastActive = (dateStr?: string | null): string => {
  if (!dateStr) return "Chưa có";
  const activeDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isActiveToday =
    activeDate.getDate() === today.getDate() &&
    activeDate.getMonth() === today.getMonth() &&
    activeDate.getFullYear() === today.getFullYear();

  const isActiveYesterday =
    activeDate.getDate() === yesterday.getDate() &&
    activeDate.getMonth() === yesterday.getMonth() &&
    activeDate.getFullYear() === yesterday.getFullYear();

  if (isActiveToday) return "Hôm nay";
  if (isActiveYesterday) return "Hôm qua";
  return activeDate.toLocaleDateString("vi-VN", { month: "numeric", day: "numeric" });
};

const settingsItems = [
  { label: "Cài đặt", icon: Settings, path: "/settings" },
  { label: "Về ứng dụng", icon: Info },
];

const ROADMAP_LAYOUT = [
  { left: "18%", top: "54%" },
  { left: "36%", top: "30%" },
  { left: "53%", top: "42%" },
  { left: "70%", top: "67%" },
  { left: "84%", top: "30%" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profileSummary, isLoading, isError, refetch } = useGetProfileSummaryQuery();
  const {
    data: chapters,
    isLoading: isLoadingChapters,
    isError: isChaptersError,
  } = useGetChaptersQuery();

  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [chapterProgress, setChapterProgress] = useState<Record<string, ChapterProgress>>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadChapterProgress() {
      if (!chapters?.length) {
        setChapterProgress({});
        setIsLoadingProgress(false);
        return;
      }

      setIsLoadingProgress(true);

      const entries = await Promise.all(
        chapters.map(async (chapter) => {
          const raw = await securePersistStorage.getItem(getChapterProgressStorageKey(chapter.id));

          try {
            return [chapter.id, raw ? (JSON.parse(raw) as ChapterProgress) : {}] as const;
          } catch {
            return [chapter.id, {}] as const;
          }
        }),
      );

      if (!cancelled) {
        setChapterProgress(Object.fromEntries(entries));
        setIsLoadingProgress(false);
      }
    }

    void loadChapterProgress();

    return () => {
      cancelled = true;
    };
  }, [chapters]);

  const activeChapterData = (() => {
    if (!chapters || chapters.length === 0) return null;

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const progress = chapterProgress[chapter.id];

      const order = chapter.order ?? [];
      const completedCount = order.filter((muc) => progress?.[muc]?.status === "done").length;
      const progressPercent = order.length ? Math.round((completedCount / order.length) * 100) : 0;

      if (progressPercent < 100) {
        return {
          chapter,
          completedCount,
          nodeCount: order.length,
          progressPercent,
          progress,
          order,
        };
      }
    }

    const lastChapter = chapters[chapters.length - 1];
    const progress = chapterProgress[lastChapter.id];
    const order = lastChapter.order ?? [];
    const completedCount = order.filter((muc) => progress?.[muc]?.status === "done").length;
    const progressPercent = order.length ? Math.round((completedCount / order.length) * 100) : 0;

    return {
      chapter: lastChapter,
      completedCount,
      nodeCount: order.length,
      progressPercent,
      progress,
      order,
    };
  })();

  const visibleStats = useMemo(() => {
    return [
      {
        label: "Chuỗi ngày",
        value: `${profileSummary?.stats?.streakDays ?? 0} ngày`,
        icon: Flame,
        tone: "primary",
      },
      {
        label: "Điểm tư duy",
        value: String(profileSummary?.stats?.points ?? 0),
        icon: Sparkles,
        tone: "primary",
      },
      {
        label: "Câu chuyện",
        value: String(profileSummary?.stats?.stories ?? 0),
        icon: BookOpen,
        tone: "text",
      },
    ];
  }, [profileSummary]);

  const visibleBadges = useMemo(() => {
    return profileSummary?.badges && profileSummary.badges.length > 0
      ? profileSummary.badges.slice(0, 4).map((badge) => ({
          id: badge.id,
          title: badge.name,
          description: badge.description,
          progress: badge.progress,
          target: badge.target,
          caption: badge.isEarned
            ? (badge.description ?? "Đã mở khóa")
            : `${badge.progress}/${badge.target}`,
          icon: getBadgeIcon(badge.conditionType),
          unlocked: badge.isEarned,
          earnedAt: badge.earnedAt,
        }))
      : [];
  }, [profileSummary]);

  const rawHeatmap = profileSummary?.activity?.heatmap;
  const heatmapData = useMemo(() => {
    if (rawHeatmap && rawHeatmap.length === 28) {
      return rawHeatmap;
    }
    return Array.from({ length: 28 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (27 - index));
      const day = date.toISOString().slice(0, 10);
      return { date: day, count: 0 };
    });
  }, [rawHeatmap]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0C0C0E]">
        <SafeAreaView edges={["top"]} className="flex-1">
          <AppHeader />
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color={Colors.primary} />
            <ThemedText className="text-[12px] font-bold text-[#A1A1AA]">
              Đang tải thông tin cá nhân...
            </ThemedText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (isError || !profileSummary) {
    return (
      <View className="flex-1 bg-[#0C0C0E]">
        <SafeAreaView edges={["top"]} className="flex-1">
          <AppHeader />
          <View className="flex-1 items-center justify-center gap-4 px-4">
            <Trophy color={Colors.locked} size={48} />
            <ThemedText className="font-sans text-[18px] font-extrabold text-[#E5E1E4]">
              Không thể tải thông tin cá nhân
            </ThemedText>
            <Pressable
              onPress={refetch}
              className="bg-[#D97706] active:bg-[#FFB77D] px-6 py-2.5 rounded-full"
            >
              <ThemedText className="text-[14px] font-extrabold text-[#0C0C0E]">Thử lại</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const profileName = profileSummary.user?.fullName ?? "Minh Dev";
  const profileHandle = profileSummary.user?.email
    ? `@${profileSummary.user.email.split("@")[0]}`
    : "@minhdev";
  const profileAvatar = profileSummary.user?.avatarUrl ?? avatarImage;

  const currentStreak = profileSummary.activity?.streak?.currentStreak ?? 0;
  const longestStreak = profileSummary.activity?.streak?.longestStreak ?? 0;
  const lastActive = profileSummary.activity?.streak?.lastActive;

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {
    } finally {
      router.replace("/(auth)/login" as never);
    }
  }

  return (
    <View className="flex-1 bg-[#0C0C0E]">
      <SafeAreaView edges={["top"]} className="flex-1">
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="w-full max-w-[820px] self-center gap-3 p-3 pb-[220px]"
        >
          <View className="items-center gap-2 pb-1 pt-2">
            <View className="h-[76px] w-[76px] rounded-full border-2 border-[#D97706] bg-[#0C0C0E] p-[3px]">
              <Image
                source={profileAvatar}
                contentFit="cover"
                className="h-full w-full rounded-full"
              />
            </View>

            <View className="items-center gap-0.5">
              <ThemedText className="font-sans text-[22px] font-extrabold leading-[28px] text-[#E5E1E4]">
                {profileName}
              </ThemedText>
              <ThemedText className="text-[13px] font-semibold leading-[18px] text-[#A1A1AA]">
                {profileHandle}
              </ThemedText>
            </View>
          </View>

          <View className="min-h-[82px] flex-row rounded-md border border-[#27272A] bg-[#161618]">
            {visibleStats.map((item, index) => {
              const Icon = item.icon;
              const isPrimary = item.tone === "primary";

              return (
                <View
                  key={item.label}
                  className={cn(
                    "flex-1 items-center justify-center gap-1",
                    index > 0 && "border-l border-[#27272A]",
                  )}
                >
                  <View className="flex-row items-center gap-1">
                    <Icon
                      color={isPrimary ? Colors.primary : Colors.text}
                      fill={item.icon === Flame ? Colors.primary : "transparent"}
                      size={16}
                    />
                    <ThemedText
                      className="font-mono text-[16px] font-extrabold leading-[20px]"
                      style={{ color: isPrimary ? Colors.primary : Colors.text }}
                    >
                      {item.value}
                    </ThemedText>
                  </View>
                  <ThemedText className="text-[10px] font-extrabold uppercase leading-[14px] text-[#A1A1AA]">
                    {item.label}
                  </ThemedText>
                </View>
              );
            })}
          </View>

          <View className="gap-2">
            <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
              Lộ trình học
            </ThemedText>
            <Pressable
              onPress={() => router.push("/(tabs)/learn" as never)}
              className="h-[190px] justify-center overflow-hidden rounded-md border border-[#27272A] bg-[#161618] active:border-[#D97706]/40"
            >
              {isLoadingChapters || isLoadingProgress ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator color={Colors.primaryLight} />
                </View>
              ) : isChaptersError || !activeChapterData ? (
                <View className="flex-1 items-center justify-center px-4">
                  <ThemedText className="text-[14px] font-semibold text-[#A1A1AA] text-center">
                    Chưa bắt đầu lộ trình học nào
                  </ThemedText>
                </View>
              ) : (
                <View className="flex-1 relative justify-center items-center">
                  {/* Lines connecting dots */}
                  {activeChapterData.order.slice(0, 4).map((_, index) => {
                    const nextMuc = activeChapterData.order[index + 1];
                    const nextItem = activeChapterData.progress?.[nextMuc];
                    const isActive =
                      nextItem?.status === "available" || nextItem?.status === "done";
                    const lineColor = isActive ? "bg-[#D97706]" : "bg-[#52525B]";
                    const lineOpacity = isActive ? "opacity-70" : "opacity-80";

                    if (index === 0) {
                      return (
                        <View
                          key={index}
                          className={cn(
                            "absolute left-[18%] top-[48%] h-0.5 w-[90px] -rotate-[28deg]",
                            lineColor,
                            lineOpacity,
                          )}
                        />
                      );
                    }
                    if (index === 1) {
                      return (
                        <View
                          key={index}
                          className={cn(
                            "absolute left-[38%] top-[42%] h-0.5 w-[96px] rotate-[16deg]",
                            lineColor,
                            lineOpacity,
                          )}
                        />
                      );
                    }
                    if (index === 2) {
                      return (
                        <View
                          key={index}
                          className={cn(
                            "absolute right-[16%] top-[50%] h-0.5 w-[96px] -rotate-[18deg]",
                            lineColor,
                            lineOpacity,
                          )}
                        />
                      );
                    }
                    if (index === 3) {
                      return (
                        <View
                          key={index}
                          className={cn(
                            "absolute right-[5%] top-[45%] h-0.5 w-[90px] rotate-[22deg]",
                            lineColor,
                            lineOpacity,
                          )}
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Dots representing node states */}
                  {activeChapterData.order.slice(0, 5).map((muc, index) => {
                    const absoluteIndex = activeChapterData.chapter.order.indexOf(muc);
                    const item = activeChapterData.progress?.[muc] ?? {
                      status: absoluteIndex === 0 ? "available" : "locked",
                    };
                    const done = item.status === "done";
                    const available = item.status === "available";
                    const dotColor = done || available ? "bg-[#D97706]" : "bg-[#52525B]";
                    const dotLayout = ROADMAP_LAYOUT[index] ?? ROADMAP_LAYOUT[0];

                    if (available) {
                      return (
                        <View
                          key={muc}
                          style={
                            {
                              position: "absolute",
                              left: dotLayout.left,
                              top: dotLayout.top,
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              borderWidth: 3,
                              borderColor: "#FFB77D59",
                              backgroundColor: "#D97706",
                              transform: [{ translateX: -2 }, { translateY: -2 }],
                            } as any
                          }
                        />
                      );
                    }

                    return (
                      <View
                        key={muc}
                        style={
                          {
                            position: "absolute",
                            left: dotLayout.left,
                            top: dotLayout.top,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                          } as any
                        }
                        className={dotColor}
                      />
                    );
                  })}

                  {/* Text Information Container */}
                  <View className="items-center gap-0.5 bg-[#161618]/90 px-3 py-1 rounded">
                    <ThemedText className="text-[15px] font-extrabold leading-[20px] text-[#FFB77D] text-center">
                      {activeChapterData.chapter.title}
                    </ThemedText>
                    <ThemedText className="text-[12px] font-bold leading-[16px] text-[#A1A1AA]">
                      {activeChapterData.progressPercent}% hoàn thành (
                      {activeChapterData.completedCount}/{activeChapterData.nodeCount})
                    </ThemedText>
                  </View>
                </View>
              )}
            </Pressable>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
                Huy hiệu
              </ThemedText>
              <Pressable onPress={() => router.push("/badges" as never)}>
                <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                  Xem tất cả
                </ThemedText>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {visibleBadges.length === 0 ? (
                <View className="w-full py-6 items-center justify-center rounded-md border border-[#27272A] bg-[#161618]">
                  <ThemedText className="text-[14px] font-semibold text-[#A1A1AA]">
                    Chưa có huy hiệu nào
                  </ThemedText>
                </View>
              ) : (
                visibleBadges.map((badge) => {
                  const Icon = badge.icon;

                  return (
                    <Pressable
                      key={badge.id}
                      onPress={() => {
                        setSelectedBadge(badge);
                        setIsBadgeModalVisible(true);
                      }}
                      className={cn(
                        "min-h-[116px] w-[48%] gap-1 rounded-md border border-[#27272A] bg-[#161618] p-3",
                        !badge.unlocked && "opacity-60",
                      )}
                    >
                      <View
                        className={cn(
                          "h-[38px] w-[38px] items-center justify-center rounded-full bg-[#D9770624]",
                          !badge.unlocked && "bg-[#27272A]",
                        )}
                      >
                        <Icon
                          color={badge.unlocked ? Colors.primaryLight : Colors.locked}
                          size={22}
                        />
                      </View>
                      <ThemedText
                        className={cn(
                          "text-[15px] font-extrabold leading-[20px] text-[#E5E1E4]",
                          !badge.unlocked && "text-[#A1A1AA]",
                        )}
                      >
                        {badge.title}
                      </ThemedText>
                      <ThemedText className="text-[12px] font-semibold leading-[16px] text-[#A1A1AA]">
                        {badge.caption}
                      </ThemedText>
                    </Pressable>
                  );
                })
              )}
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
                Chuỗi ngày & Hoạt động
              </ThemedText>
            </View>

            {/* Streak metrics */}
            <View className="flex-row justify-between gap-2">
              <View className="flex-1 bg-[#161618] border border-[#27272A] rounded-md p-3 items-center justify-center gap-1">
                <Flame color={Colors.primary} fill={Colors.primary} size={20} />
                <ThemedText className="font-mono text-[16px] font-extrabold text-[#E5E1E4] mt-0.5">
                  {currentStreak} ngày
                </ThemedText>
                <ThemedText className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Chuỗi hiện tại
                </ThemedText>
              </View>

              <View className="flex-1 bg-[#161618] border border-[#27272A] rounded-md p-3 items-center justify-center gap-1">
                <Trophy color="#FFD700" size={20} />
                <ThemedText className="font-mono text-[16px] font-extrabold text-[#E5E1E4] mt-0.5">
                  {longestStreak} ngày
                </ThemedText>
                <ThemedText className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Chuỗi dài nhất
                </ThemedText>
              </View>

              <View className="flex-1 bg-[#161618] border border-[#27272A] rounded-md p-3 items-center justify-center gap-1">
                <Sparkles color={Colors.primaryLight} size={20} />
                <ThemedText
                  className="text-[14px] font-extrabold text-[#E5E1E4] mt-0.5 text-center"
                  numberOfLines={1}
                >
                  {formatLastActive(lastActive)}
                </ThemedText>
                <ThemedText className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Hoạt động cuối
                </ThemedText>
              </View>
            </View>

            {/* GitHub style heatmap */}
            <View className="bg-[#161618] border border-[#27272A] rounded-md p-4 items-center gap-3">
              <View className="w-full flex-row justify-between items-center px-1 mb-1">
                <ThemedText className="text-[14px] font-extrabold text-[#E5E1E4]">
                  Bản đồ hoạt động (28 ngày)
                </ThemedText>
                <View className="flex-row items-center gap-1">
                  <ThemedText className="text-[10px] font-bold text-[#A1A1AA]">Ít</ThemedText>
                  <View className="h-3 w-3 rounded-[2px] bg-[#27272A]" />
                  <View className="h-3 w-3 rounded-[2px] bg-[#D9770633]" />
                  <View className="h-3 w-3 rounded-[2px] bg-[#D9770666]" />
                  <View className="h-3 w-3 rounded-[2px] bg-[#D97706AA]" />
                  <View className="h-3 w-3 rounded-[2px] bg-[#D97706]" />
                  <ThemedText className="text-[10px] font-bold text-[#A1A1AA]">Nhiều</ThemedText>
                </View>
              </View>

              {/* Grid of Weeks (4 rows of 7 columns) */}
              <View className="w-full gap-1.5 items-center">
                {Array.from({ length: 4 }).map((_, weekIndex) => {
                  const weekDays = heatmapData.slice(weekIndex * 7, (weekIndex + 1) * 7);
                  return (
                    <View key={weekIndex} className="flex-row gap-1.5 justify-center">
                      {weekDays.map((day: any) => {
                        const count = day.count ?? 0;
                        let bgColor = "bg-[#27272A]";
                        if (count === 1) bgColor = "bg-[#D9770633]";
                        else if (count === 2) bgColor = "bg-[#D9770666]";
                        else if (count === 3) bgColor = "bg-[#D97706AA]";
                        else if (count >= 4) bgColor = "bg-[#D97706]";

                        const isSelected = selectedDay?.date === day.date;

                        return (
                          <Pressable
                            key={day.date}
                            onPress={() => setSelectedDay(day)}
                            className={cn(
                              "h-[26px] w-[26px] rounded-[4px] items-center justify-center",
                              bgColor,
                              isSelected && { transform: [{ scale: 1.05 }] },
                            )}
                          />
                        );
                      })}
                    </View>
                  );
                })}
              </View>

              {/* Tapped Day Information */}
              <View className="w-full bg-[#0C0C0E] rounded-md py-2 px-3 items-center border border-[#27272A]/50">
                <ThemedText className="text-[12px] font-bold text-[#A1A1AA]">
                  {selectedDay
                    ? `${new Date(selectedDay.date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}: ${selectedDay.count} hoạt động`
                    : "Chạm vào một ô để xem chi tiết hoạt động"}
                </ThemedText>
              </View>
            </View>
          </View>

          <View className="overflow-hidden rounded-md border border-[#27272A] bg-[#161618]">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    if (item.path) {
                      router.push(item.path as never);
                    }
                  }}
                  className={cn(
                    "min-h-[56px] flex-row items-center justify-between px-3",
                    index < settingsItems.length - 1 && "border-b border-[#27272A]",
                  )}
                >
                  <View className="flex-row items-center gap-2">
                    <Icon color={Colors.muted} size={18} />
                    <ThemedText className="text-[14px] font-extrabold leading-[20px] text-[#E5E1E4]">
                      {item.label}
                    </ThemedText>
                  </View>
                  <ChevronRight color={Colors.locked} size={18} />
                </Pressable>
              );
            })}
          </View>

          <View className="mt-4 gap-3 px-1">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center gap-2 rounded-md border border-[#353437] bg-[#161618] py-3"
            >
              <LogOut color={Colors.text} size={16} />
              <ThemedText type="label" className="font-extrabold text-[#E5E1E4]">
                Đăng xuất
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push("/delete-account" as never)}
              className="items-center rounded-md border border-[#D97706] py-3"
            >
              <ThemedText type="label" className="font-extrabold text-[#D97706]">
                Xóa tài khoản
              </ThemedText>
            </Pressable>

            <View className="gap-2">
              <Pressable
                onPress={() => router.push("/legal/terms" as never)}
                className="flex-row items-center gap-2 rounded-md border border-[#353437] px-2 py-2"
              >
                <ScrollText color={Colors.muted} size={16} />
                <ThemedText className="text-[14px] font-bold leading-[20px] text-[#A1A1AA]">
                  Điều Khoản Dịch Vụ
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => router.push("/legal/privacy" as never)}
                className="flex-row items-center gap-2 rounded-md border border-[#353437] px-2 py-2"
              >
                <Lock color={Colors.muted} size={16} />
                <ThemedText className="text-[14px] font-bold leading-[20px] text-[#A1A1AA]">
                  Chính Sách Bảo Mật
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Badge Detail Modal */}
        <Modal
          visible={isBadgeModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsBadgeModalVisible(false)}
        >
          <Pressable
            className="flex-1 justify-center items-center bg-black/60 p-4"
            onPress={() => setIsBadgeModalVisible(false)}
          >
            <Pressable
              className="w-full max-w-[340px] bg-[#161618] border border-[#27272A] rounded-xl p-6 items-center gap-4"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Badge Icon Container */}
              <View
                className={cn(
                  "h-[72px] w-[72px] items-center justify-center rounded-full bg-[#D9770624] mb-2",
                  !selectedBadge?.unlocked && "bg-[#27272A]",
                )}
              >
                {selectedBadge &&
                  (() => {
                    const BadgeIcon = selectedBadge.icon;
                    return (
                      <BadgeIcon
                        color={selectedBadge.unlocked ? Colors.primaryLight : Colors.locked}
                        size={36}
                      />
                    );
                  })()}
              </View>

              {/* Badge Name */}
              <ThemedText className="font-sans text-[20px] font-extrabold text-[#E5E1E4] text-center">
                {selectedBadge?.title}
              </ThemedText>

              {/* Badge Description */}
              <ThemedText className="text-[14px] font-semibold text-[#A1A1AA] text-center leading-[20px]">
                {selectedBadge?.description}
              </ThemedText>

              {/* Progress Section */}
              <View className="w-full gap-2 mt-2">
                <View className="flex-row justify-between items-center">
                  <ThemedText className="text-[12px] font-bold text-[#A1A1AA]">Tiến độ</ThemedText>
                  <ThemedText className="font-mono text-[12px] font-extrabold text-[#FFB77D]">
                    {selectedBadge?.progress ?? 0}/{selectedBadge?.target ?? 1}
                  </ThemedText>
                </View>
                {/* Progress Bar */}
                <View className="h-2 w-full rounded-full bg-[#27272A] overflow-hidden">
                  <View
                    className="h-full rounded-full bg-[#D97706]"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((selectedBadge?.progress ?? 0) / (selectedBadge?.target ?? 1)) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </View>
              </View>

              {/* Earned Status */}
              <View className="w-full items-center border-t border-[#27272A] pt-4 mt-2">
                <ThemedText
                  className={cn(
                    "text-[13px] font-extrabold",
                    selectedBadge?.unlocked ? "text-[#22C55E]" : "text-[#52525B]",
                  )}
                >
                  {selectedBadge?.unlocked
                    ? `✓ Đã mở khóa${
                        selectedBadge.earnedAt
                          ? ` ngày ${new Date(selectedBadge.earnedAt).toLocaleDateString("vi-VN")}`
                          : ""
                      }`
                    : "🔒 Chưa mở khóa"}
                </ThemedText>
              </View>

              {/* Close Button */}
              <Pressable
                onPress={() => setIsBadgeModalVisible(false)}
                className="mt-2 w-full bg-[#27272A] active:bg-[#353437] py-2.5 rounded-md items-center"
              >
                <ThemedText className="text-[14px] font-extrabold text-[#E5E1E4]">Đóng</ThemedText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
