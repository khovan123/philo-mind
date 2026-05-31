import { Image } from "expo-image";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Flame,
  Globe2,
  Info,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";

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
  { label: "Streak", value: "7 ngày", icon: Flame, tone: "primary" },
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
  { label: "Cài đặt", icon: Settings },
  { label: "Ngôn ngữ", icon: Globe2 },
  { label: "Thông báo", icon: Bell },
  { label: "Về ứng dụng", icon: Info },
  { label: "Màn hình Đăng ký (Test)", icon: ShieldCheck, path: "/(auth)/register" },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarFrame}>
              <Image source={avatarImage} contentFit="cover" style={styles.avatarImage} />
            </View>

            <View style={styles.profileCopy}>
              <ThemedText style={styles.name}>Minh Dev</ThemedText>
              <ThemedText style={styles.handle}>@minhdev</ThemedText>
            </View>
          </View>

          <View style={styles.statsCard}>
            {stats.map((item, index) => {
              const Icon = item.icon;
              const isPrimary = item.tone === "primary";

              return (
                <View
                  key={item.label}
                  style={[styles.statItem, index > 0 && styles.statItemDivider]}
                >
                  <View style={styles.statValueRow}>
                    <Icon
                      color={isPrimary ? Colors.primary : Colors.text}
                      fill={item.icon === Flame ? Colors.primary : "transparent"}
                      size={16}
                    />
                    <ThemedText
                      style={[
                        styles.statValue,
                        { color: isPrimary ? Colors.primary : Colors.text },
                      ]}
                    >
                      {item.value}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Lộ trình học</ThemedText>
            <View style={styles.pathCard}>
              <View style={styles.pathLineOne} />
              <View style={styles.pathLineTwo} />
              <View style={styles.pathLineThree} />

              <View style={[styles.pathNode, styles.pathNodeOne]} />
              <View style={[styles.pathNode, styles.pathNodeTwo]} />
              <View style={[styles.pathNodeActive, styles.pathNodeThree]} />
              <View style={[styles.pathNodeLocked, styles.pathNodeFour]} />
              <View style={[styles.pathNodeLocked, styles.pathNodeFive]} />

              <View style={styles.pathCopy}>
                <ThemedText style={styles.pathTitle}>Khắc kỷ học: Giai đoạn 2</ThemedText>
                <ThemedText style={styles.pathSubtitle}>65% hoàn thành</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Huy hiệu</ThemedText>
              <Pressable>
                <ThemedText style={styles.sectionAction}>Xem tất cả</ThemedText>
              </Pressable>
            </View>

            <View style={styles.badgeGrid}>
              {badges.map((badge) => {
                const Icon = badge.icon;

                return (
                  <Pressable
                    key={badge.title}
                    style={[styles.badgeCard, !badge.unlocked && styles.badgeLocked]}
                  >
                    <View style={[styles.badgeIcon, !badge.unlocked && styles.badgeIconLocked]}>
                      <Icon
                        color={badge.unlocked ? Colors.primaryLight : Colors.locked}
                        size={22}
                      />
                    </View>
                    <ThemedText style={[styles.badgeTitle, !badge.unlocked && styles.lockedText]}>
                      {badge.title}
                    </ThemedText>
                    <ThemedText style={styles.badgeCaption}>{badge.caption}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Hoạt động tuần này</ThemedText>
              <ThemedText style={styles.sectionAction}>+18%</ThemedText>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityBars}>
                {activity.map((height, index) => (
                  <View key={`${height}-${index}`} style={styles.activityColumn}>
                    <View style={[styles.activityBar, { height }]} />
                    <ThemedText style={styles.activityDay}>
                      {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index]}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Nhật ký triết học</ThemedText>
              <Pressable>
                <ThemedText style={styles.sectionAction}>Xem tất cả</ThemedText>
              </Pressable>
            </View>

            <View style={styles.journalList}>
              {journals.map((journal) => (
                <Pressable key={journal.date} style={styles.journalCard}>
                  <ThemedText style={styles.journalDate}>{journal.date}</ThemedText>
                  <ThemedText numberOfLines={2} style={styles.journalText}>
                    {journal.text}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.settingsCard}>
            {settingsItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    if ((item as any).path) {
                      router.push((item as any).path);
                    }
                  }}
                  style={[styles.settingsRow, index < settingsItems.length - 1 && styles.rowBorder]}
                >
                  <View style={styles.settingsLabel}>
                    <Icon color={Colors.muted} size={18} />
                    <ThemedText style={styles.settingsText}>{item.label}</ThemedText>
                  </View>
                  <ChevronRight color={Colors.locked} size={18} />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.deleteSection}>
            <Pressable onPress={() => router.push("/delete-account")} style={styles.deleteButton}>
              <ThemedText type="label" style={styles.deleteButtonText}>
                Xóa tài khoản
              </ThemedText>
            </Pressable>
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

  profileHeader: {
    alignItems: "center",
    gap: Spacing.two,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },

  avatarFrame: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: Radius.full,
  },

  profileCopy: {
    alignItems: "center",
    gap: Spacing.half,
  },

  name: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
  },

  handle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  statsCard: {
    minHeight: 82,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
    flexDirection: "row",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },

  statItemDivider: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.chip,
  },

  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  statValue: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
  },

  statLabel: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  section: {
    gap: Spacing.two,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },

  sectionAction: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },

  pathCard: {
    height: 190,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  pathLineOne: {
    position: "absolute",
    width: 90,
    height: 2,
    left: "18%",
    top: "48%",
    backgroundColor: Colors.primary,
    transform: [{ rotate: "-28deg" }],
    opacity: 0.7,
  },

  pathLineTwo: {
    position: "absolute",
    width: 96,
    height: 2,
    left: "38%",
    top: "42%",
    backgroundColor: Colors.primary,
    transform: [{ rotate: "16deg" }],
    opacity: 0.7,
  },

  pathLineThree: {
    position: "absolute",
    width: 96,
    height: 2,
    right: "16%",
    top: "50%",
    backgroundColor: Colors.locked,
    transform: [{ rotate: "-18deg" }],
    opacity: 0.8,
  },

  pathNode: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  pathNodeActive: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: "rgba(255, 183, 125, 0.35)",
  },

  pathNodeLocked: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.locked,
  },

  pathNodeOne: {
    left: "18%",
    top: "54%",
  },

  pathNodeTwo: {
    left: "36%",
    top: "30%",
  },

  pathNodeThree: {
    left: "53%",
    top: "42%",
  },

  pathNodeFour: {
    right: "26%",
    top: "67%",
  },

  pathNodeFive: {
    right: "17%",
    top: "30%",
  },

  pathCopy: {
    alignItems: "center",
    gap: Spacing.half,
  },

  pathTitle: {
    color: Colors.primaryLight,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },

  pathSubtitle: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },

  badgeCard: {
    width: "48%",
    minHeight: 116,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
    padding: Spacing.three,
    gap: Spacing.one,
  },

  badgeLocked: {
    opacity: 0.62,
  },

  badgeIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(217, 119, 6, 0.14)",
  },

  badgeIconLocked: {
    backgroundColor: Colors.chip,
  },

  badgeTitle: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },

  badgeCaption: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },

  lockedText: {
    color: Colors.muted,
  },

  activityCard: {
    minHeight: 160,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
    padding: Spacing.three,
    justifyContent: "flex-end",
  },

  activityBars: {
    height: 118,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  activityColumn: {
    alignItems: "center",
    gap: Spacing.two,
  },

  activityBar: {
    width: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  activityDay: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
  },

  journalList: {
    gap: Spacing.two,
  },

  journalCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
    padding: Spacing.three,
    gap: Spacing.one,
  },

  journalDate: {
    color: Colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  journalText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },

  settingsCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },

  settingsRow: {
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.chip,
  },

  settingsLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  settingsText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },

  deleteSection: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.one,
  },

  deleteButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },

  deleteButtonText: {
    color: Colors.primary,
    fontWeight: "800",
  },
});
