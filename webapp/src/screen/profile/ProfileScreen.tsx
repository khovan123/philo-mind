import { authService } from "@/services/auth.service";
import { useRouter } from "expo-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Flame,
  Globe2,
  Info,
  Lock,
  LogOut,
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

const stats = [
  { label: "Chuỗi ngày", value: "7 ngày", icon: Flame, tone: "primary" },
  { label: "Điểm tư duy", value: "342", icon: Sparkles, tone: "primary" },
  { label: "Câu chuyện", value: "12", icon: BookOpen, tone: "text" },
];

const badges = [
  { title: "Khắc kỷ", caption: "7 ngày liên tiếp", icon: ShieldCheck, unlocked: true },
  { title: "Socrates", caption: "5 phản tư", icon: ScrollText, unlocked: true },
  { title: "Tư duy sắc", caption: "86% quiz đúng", icon: Trophy, unlocked: true },
  { title: "Ẩn sĩ", caption: "Sắp mở khóa", icon: Sparkles, unlocked: false },
];

const activity = [35, 58, 42, 78, 64, 86, 52];

const journals = [
  {
    date: "24.10.2023",
    text: "Về sự vô thường của vạn vật: Marcus Aurelius đã đúng khi nói rằng chúng ta chỉ là những vị khách tạm bợ trong dòng thời gian.",
  },
  {
    date: "21.10.2023",
    text: "Phân tích về Huyền thoại Sisyphus của Albert Camus. Ý nghĩa cuộc đời nằm ở chính nỗ lực đẩy tảng đá, không phải kết quả.",
  },
];

const settingsItems = [
  { label: "Cài đặt", icon: Settings, path: "/settings" },
  { label: "Ngôn ngữ", icon: Globe2 },
  { label: "Thông báo", icon: Bell, path: "/settings" },
  { label: "Về ứng dụng", icon: Info },
  { label: "Màn hình Đăng ký (Test)", icon: ShieldCheck, path: "/(auth)/register" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profileSummary } = useGetProfileSummaryQuery();

  const profileName = profileSummary?.user?.fullName ?? "Minh Dev";
  const profileHandle = profileSummary?.user?.email
    ? `@${profileSummary.user.email.split("@")[0]}`
    : "@minhdev";
  const profileAvatar = profileSummary?.user?.avatarUrl ?? avatarImage;
  const visibleStats = profileSummary
    ? [
        {
          label: "Chuỗi ngày",
          value: `${profileSummary.stats?.streakDays ?? 0} ngày`,
          icon: Flame,
          tone: "primary",
        },
        {
          label: "Điểm tư duy",
          value: String(profileSummary.stats?.points ?? 0),
          icon: Sparkles,
          tone: "primary",
        },
        {
          label: "Câu chuyện",
          value: String(profileSummary.stats?.stories ?? 0),
          icon: BookOpen,
          tone: "text",
        },
      ]
    : stats;
  const visibleBadges =
    profileSummary?.badges && profileSummary.badges.length > 0
      ? profileSummary.badges.slice(0, 4).map((badge) => ({
          title: badge.name,
          caption: badge.isEarned
            ? (badge.description ?? "Đã mở khóa")
            : `${badge.progress}/${badge.target}`,
          icon: badge.isEarned ? ShieldCheck : Sparkles,
          unlocked: badge.isEarned,
        }))
      : badges;
  const visibleActivity =
    profileSummary?.activity.heatmap && profileSummary.activity.heatmap.length > 0
      ? profileSummary.activity.heatmap.slice(-7).map((day) => Math.min(100, 22 + day.count * 16))
      : activity;
  const visibleJournals =
    profileSummary?.reflections && profileSummary.reflections.length > 0
      ? profileSummary.reflections.slice(0, 2).map((reflection) => ({
          date: new Date(reflection.createdAt).toLocaleDateString("vi-VN"),
          text: reflection.content ?? reflection.text ?? "",
        }))
      : journals;

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
            <View className="h-[190px] items-center justify-center overflow-hidden rounded-md border border-[#27272A] bg-[#161618]">
              <View className="absolute left-[18%] top-[48%] h-0.5 w-[90px] -rotate-[28deg] bg-[#D97706] opacity-70" />
              <View className="absolute left-[38%] top-[42%] h-0.5 w-[96px] rotate-[16deg] bg-[#D97706] opacity-70" />
              <View className="absolute right-[16%] top-[50%] h-0.5 w-[96px] -rotate-[18deg] bg-[#52525B] opacity-80" />

              <View className="absolute left-[18%] top-[54%] h-3 w-3 rounded-full bg-[#D97706]" />
              <View className="absolute left-[36%] top-[30%] h-3 w-3 rounded-full bg-[#D97706]" />
              <View className="absolute left-[53%] top-[42%] h-4 w-4 rounded-full border-[3px] border-[#FFB77D59] bg-[#D97706]" />
              <View className="absolute right-[26%] top-[67%] h-3 w-3 rounded-full bg-[#52525B]" />
              <View className="absolute right-[17%] top-[30%] h-3 w-3 rounded-full bg-[#52525B]" />

              <View className="items-center gap-0.5">
                <ThemedText className="text-[15px] font-extrabold leading-[20px] text-[#FFB77D]">
                  Khắc kỷ học: Giai đoạn 2
                </ThemedText>
                <ThemedText className="text-[12px] font-bold leading-[16px] text-[#A1A1AA]">
                  65% hoàn thành
                </ThemedText>
              </View>
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
                Huy hiệu
              </ThemedText>
              <Pressable>
                <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                  Xem tất cả
                </ThemedText>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {visibleBadges.map((badge) => {
                const Icon = badge.icon;

                return (
                  <Pressable
                    key={badge.title}
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
              })}
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
                Hoạt động tuần này
              </ThemedText>
              <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                +18%
              </ThemedText>
            </View>

            <View className="min-h-[160px] justify-end rounded-md border border-[#27272A] bg-[#161618] p-3">
              <View className="h-[118px] flex-row items-end justify-between">
                {visibleActivity.map((height, index) => (
                  <View key={`${height}-${index}`} className="items-center gap-2">
                    <View className="w-[18px] rounded-full bg-[#D97706]" style={{ height }} />
                    <ThemedText className="text-[10px] font-extrabold leading-[14px] text-[#A1A1AA]">
                      {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index]}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
                Nhật ký triết học
              </ThemedText>
              <Pressable>
                <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                  Xem tất cả
                </ThemedText>
              </Pressable>
            </View>

            <View className="gap-2">
              {visibleJournals.map((journal) => (
                <Pressable
                  key={journal.date}
                  className="gap-1 rounded-md border border-[#27272A] bg-[#161618] p-3"
                >
                  <ThemedText className="font-mono text-[12px] font-bold leading-[16px] text-[#A1A1AA]">
                    {journal.date}
                  </ThemedText>
                  <ThemedText
                    numberOfLines={2}
                    className="text-[14px] font-bold leading-[20px] text-[#E5E1E4]"
                  >
                    {journal.text}
                  </ThemedText>
                </Pressable>
              ))}
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
      </SafeAreaView>
    </View>
  );
}
