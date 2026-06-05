import { useRouter } from "expo-router";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/* ─── Types & Mock Data ─── */

type DayOfWeek = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";
type Intensity = "light" | "moderate" | "intensive";

interface WeeklyPlan {
  day: DayOfWeek;
  active: boolean;
  topics: string[];
  minutesTarget: number;
}

interface StudyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: typeof BookOpen;
  color: string;
}

const intensityConfig: Record<
  Intensity,
  { label: string; emoji: string; description: string; minutesPerDay: number }
> = {
  light: {
    label: "Nhẹ nhàng",
    emoji: "🌱",
    description: "10-15 phút/ngày, 3 ngày/tuần",
    minutesPerDay: 15,
  },
  moderate: {
    label: "Cân bằng",
    emoji: "⚡",
    description: "20-30 phút/ngày, 5 ngày/tuần",
    minutesPerDay: 25,
  },
  intensive: {
    label: "Chuyên sâu",
    emoji: "🔥",
    description: "45-60 phút/ngày, 6 ngày/tuần",
    minutesPerDay: 50,
  },
};

const mockGoals: StudyGoal[] = [
  {
    id: "1",
    title: "Bài học hoàn thành",
    target: 20,
    current: 8,
    unit: "bài",
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    id: "2",
    title: "Chuỗi ngày học liên tục",
    target: 14,
    current: 5,
    unit: "ngày",
    icon: Flame,
    color: "#EF4444",
  },
  {
    id: "3",
    title: "Quiz đạt ≥ 80%",
    target: 10,
    current: 3,
    unit: "quiz",
    icon: Target,
    color: "#22C55E",
  },
  {
    id: "4",
    title: "Thẻ ghi nhớ đã thuộc",
    target: 30,
    current: 12,
    unit: "thẻ",
    icon: Zap,
    color: "#D97706",
  },
];

const weeklySchedule: WeeklyPlan[] = [
  { day: "T2", active: true, topics: ["Chương 1: Nhập môn"], minutesTarget: 25 },
  { day: "T3", active: true, topics: ["Flashcard ôn tập"], minutesTarget: 15 },
  { day: "T4", active: true, topics: ["Chương 2: Vật chất"], minutesTarget: 25 },
  { day: "T5", active: false, topics: [], minutesTarget: 0 },
  { day: "T6", active: true, topics: ["Quiz tổng hợp"], minutesTarget: 20 },
  { day: "T7", active: true, topics: ["Story Mode"], minutesTarget: 30 },
  { day: "CN", active: false, topics: [], minutesTarget: 0 },
];

const todayTasks = [
  {
    id: "1",
    title: "Đọc bài: Vấn đề cơ bản của triết học",
    type: "lesson",
    done: true,
    minutes: 10,
  },
  { id: "2", title: "Ôn flashcard: Duy vật vs Duy tâm", type: "flashcard", done: true, minutes: 5 },
  { id: "3", title: "Quiz nhanh: Chương 1", type: "quiz", done: false, minutes: 8 },
  { id: "4", title: "Short Lesson: Khả tri luận", type: "short", done: false, minutes: 5 },
];

/* ─── Component ─── */

export default function StudyPlanScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [completedToday, setCompletedToday] = useState<Set<string>>(
    new Set(todayTasks.filter((t) => t.done).map((t) => t.id)),
  );

  const todayProgress = completedToday.size / todayTasks.length;
  const totalMinutesDone = todayTasks
    .filter((t) => completedToday.has(t.id))
    .reduce((sum, t) => sum + t.minutes, 0);
  const totalMinutesAll = todayTasks.reduce((sum, t) => sum + t.minutes, 0);

  function toggleTask(id: string) {
    setCompletedToday((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.background }}>
      <AppHeader title="Kế hoạch học tập" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Today's Overview */}
        <View style={[s.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={s.heroTop}>
            <View>
              <ThemedText type="label" themeColor="textMuted">
                HÔM NAY
              </ThemedText>
              <ThemedText style={s.heroTitle}>
                {completedToday.size === todayTasks.length
                  ? "🎉 Hoàn thành xuất sắc!"
                  : `${todayTasks.length - completedToday.size} nhiệm vụ còn lại`}
              </ThemedText>
            </View>
            <View style={s.heroStats}>
              <View style={s.heroStat}>
                <Clock color={theme.primary} size={14} />
                <ThemedText type="small" themeColor="primary">
                  {totalMinutesDone}/{totalMinutesAll} phút
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Progress circle */}
          <View style={s.progressSection}>
            <View style={[s.progressRing, { borderColor: theme.backgroundElement }]}>
              <View style={[s.progressInner, { backgroundColor: `${theme.primary}15` }]}>
                <ThemedText style={[s.progressPercent, { color: theme.primary }]}>
                  {Math.round(todayProgress * 100)}%
                </ThemedText>
              </View>
            </View>
            <View style={s.progressDetails}>
              <View style={[s.progressBar, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[
                    s.progressFill,
                    {
                      width: `${todayProgress * 100}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {completedToday.size}/{todayTasks.length} nhiệm vụ hoàn thành
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={s.section}>
          <ThemedText style={s.sectionTitle} type="smallBold" themeColor="textSecondary">
            NHIỆM VỤ HÔM NAY
          </ThemedText>
          {todayTasks.map((task) => {
            const done = completedToday.has(task.id);
            return (
              <Pressable
                key={task.id}
                style={[
                  s.taskCard,
                  {
                    backgroundColor: done ? `${theme.success}10` : theme.surface,
                    borderColor: done ? theme.success : theme.border,
                  },
                ]}
                onPress={() => toggleTask(task.id)}
              >
                <View
                  style={[
                    s.taskCheck,
                    {
                      backgroundColor: done ? theme.success : "transparent",
                      borderColor: done ? theme.success : theme.textMuted,
                    },
                  ]}
                >
                  {done && <CheckCircle2 color="#fff" size={14} />}
                </View>
                <View style={s.taskInfo}>
                  <ThemedText
                    style={[
                      s.taskTitle,
                      done && { textDecorationLine: "line-through", opacity: 0.6 },
                    ]}
                  >
                    {task.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textMuted">
                    {task.minutes} phút •{" "}
                    {task.type === "lesson"
                      ? "Bài học"
                      : task.type === "flashcard"
                        ? "Thẻ ghi nhớ"
                        : task.type === "quiz"
                          ? "Trắc nghiệm"
                          : "Bài ngắn"}
                  </ThemedText>
                </View>
                {!done && <ChevronRight color={theme.textMuted} size={16} />}
              </Pressable>
            );
          })}
        </View>

        {/* Intensity Selector */}
        <View style={s.section}>
          <ThemedText style={s.sectionTitle} type="smallBold" themeColor="textSecondary">
            CƯỜNG ĐỘ HỌC TẬP
          </ThemedText>
          <View style={s.intensityRow}>
            {(Object.keys(intensityConfig) as Intensity[]).map((key) => {
              const config = intensityConfig[key];
              const active = intensity === key;
              return (
                <Pressable
                  key={key}
                  style={[
                    s.intensityCard,
                    {
                      backgroundColor: active ? `${theme.primary}15` : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setIntensity(key)}
                >
                  <ThemedText style={s.intensityEmoji}>{config.emoji}</ThemedText>
                  <ThemedText
                    type="smallBold"
                    style={{ color: active ? theme.primary : theme.text }}
                  >
                    {config.label}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textMuted" style={s.intensityDesc}>
                    {config.description}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={s.section}>
          <ThemedText style={s.sectionTitle} type="smallBold" themeColor="textSecondary">
            LỊCH HỌC HÀNG TUẦN
          </ThemedText>
          <View style={s.weekRow}>
            {weeklySchedule.map((day) => (
              <View
                key={day.day}
                style={[
                  s.dayCell,
                  {
                    backgroundColor: day.active ? `${theme.primary}15` : theme.surface,
                    borderColor: day.active ? theme.primary : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: day.active ? theme.primary : theme.textMuted, fontSize: 11 }}
                >
                  {day.day}
                </ThemedText>
                {day.active ? (
                  <ThemedText type="small" style={{ color: theme.primary, fontSize: 10 }}>
                    {day.minutesTarget}p
                  </ThemedText>
                ) : (
                  <ThemedText type="small" themeColor="textMuted" style={{ fontSize: 10 }}>
                    Nghỉ
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Learning Goals */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <ThemedText style={s.sectionTitle} type="smallBold" themeColor="textSecondary">
              MỤC TIÊU HỌC TẬP
            </ThemedText>
            <TrendingUp color={theme.primary} size={16} />
          </View>
          {mockGoals.map((goal) => {
            const GoalIcon = goal.icon;
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <View
                key={goal.id}
                style={[s.goalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={[s.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                  <GoalIcon color={goal.color} size={18} />
                </View>
                <View style={s.goalInfo}>
                  <View style={s.goalRow}>
                    <ThemedText type="smallBold">{goal.title}</ThemedText>
                    <ThemedText type="small" themeColor="textMuted">
                      {goal.current}/{goal.target} {goal.unit}
                    </ThemedText>
                  </View>
                  <View style={[s.goalTrack, { backgroundColor: theme.backgroundElement }]}>
                    <View
                      style={[
                        s.goalFill,
                        {
                          width: `${Math.min(pct, 100)}%`,
                          backgroundColor: goal.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Calendar Hint */}
        <View
          style={[s.calendarCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Calendar color={theme.primary} size={24} />
          <View style={s.calendarInfo}>
            <ThemedText type="smallBold">Nhắc nhở học tập</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Bật thông báo để nhận nhắc học đúng giờ mỗi ngày
            </ThemedText>
          </View>
          <Button
            title="Bật"
            variant="outline"
            size="sm"
            onPress={() => router.push("/settings")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */

const s = StyleSheet.create({
  content: {
    padding: Spacing.three,
    paddingBottom: 120,
    gap: Spacing.three,
  },

  heroCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  heroStats: {
    alignItems: "flex-end",
  },
  heroStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  progressRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  progressInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "800",
  },
  progressDetails: {
    flex: 1,
    gap: Spacing.two,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    letterSpacing: 1,
    fontSize: 11,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  taskCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  taskInfo: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  intensityRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  intensityCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    alignItems: "center",
    gap: Spacing.one,
  },
  intensityEmoji: {
    fontSize: 24,
  },
  intensityDesc: {
    textAlign: "center",
    fontSize: 10,
    lineHeight: 14,
  },

  weekRow: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  dayCell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.two,
    alignItems: "center",
    gap: 2,
  },

  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  goalInfo: {
    flex: 1,
    gap: Spacing.two,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  goalFill: {
    height: "100%",
    borderRadius: 2,
  },

  calendarCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  calendarInfo: {
    flex: 1,
    gap: 2,
  },
});
