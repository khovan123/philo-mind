import {
  Award,
  BookOpen,
  Brain,
  Flame,
  Lock,
  type LucideIcon,
  MessageCircle,
  Puzzle,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react-native";
import React, { memo, useCallback, useMemo } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";
import type { BadgeDefinitionDTO, UserBadgeDTO } from "@/services/rtk-api/badge.api";
import { useGetBadgeGalleryQuery, useMarkBadgeSeenMutation } from "@/services/rtk-api/badge.api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { dismissBadgeToast, setActiveFilter } from "@/stores/slices/badge.slice";

const C = {
  bg: "#0C0C0E",
  surface: "#161618",
  chip: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  locked: "#52525B",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  glow: "rgba(217,119,6,0.14)",
  success: "#22C55E",
};

const ICONS: Record<string, LucideIcon> = {
  shield_check: ShieldCheck,
  scroll_text: ScrollText,
  trophy: Trophy,
  sparkles: Sparkles,
  flame: Flame,
  book_open: BookOpen,
  message_circle: MessageCircle,
  puzzle: Puzzle,
  brain: Brain,
  award: Award,
};

const FILTERS = [
  { key: "all" as const, label: "Tất cả" },
  { key: "earned" as const, label: "Đã đạt" },
  { key: "locked" as const, label: "Chưa mở" },
];

const FilterChip = memo(function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[s.chip, active && s.chipOn]} onPress={onPress}>
      <ThemedText style={[s.chipTxt, active && s.chipTxtOn]}>{label}</ThemedText>
    </Pressable>
  );
});

const EarnedCard = memo(function EarnedCard({
  badge,
  iconComponent,
  onPress,
}: {
  badge: UserBadgeDTO;
  iconComponent: LucideIcon;
  onPress: () => void;
}) {
  return (
    <Pressable style={s.card} onPress={onPress}>
      {badge.isNew && <View style={s.dot} />}
      <View style={s.iconCircle}>
        {React.createElement(iconComponent, { color: C.primaryLight, size: 24 })}
      </View>
      <ThemedText style={s.cardName}>{badge.badge.name}</ThemedText>
      <ThemedText style={s.cardDesc} numberOfLines={2}>
        {badge.badge.description}
      </ThemedText>
      <ThemedText style={s.cardDate}>
        {new Date(badge.earnedAt).toLocaleDateString("vi-VN")}
      </ThemedText>
    </Pressable>
  );
});

const LockedCard = memo(function LockedCard({ badge }: { badge: BadgeDefinitionDTO }) {
  return (
    <View style={[s.card, s.cardLocked]}>
      <View style={[s.iconCircle, s.iconLocked]}>
        <Lock color={C.locked} size={20} />
      </View>
      <ThemedText style={[s.cardName, s.lockTxt]}>{badge.name}</ThemedText>
      <ThemedText style={[s.cardDesc, s.lockTxt]} numberOfLines={2}>
        {badge.condition}
      </ThemedText>
    </View>
  );
});

const Toast = memo(function Toast() {
  const dispatch = useAppDispatch();
  const { isToastVisible, currentToast } = useAppSelector((st) => st.badge);
  if (!isToastVisible || !currentToast) return null;
  const ResolvedIcon = ICONS[currentToast.badgeIcon] ?? Award;
  return (
    <Animated.View style={s.toastWrap}>
      <Pressable style={s.toast} onPress={() => dispatch(dismissBadgeToast())}>
        <View style={s.toastIcon}>
          {React.createElement(ResolvedIcon, { color: C.primaryLight, size: 20 })}
        </View>
        <View style={s.toastBody}>
          <ThemedText style={s.toastTitle}>🏅 Huy hiệu mới!</ThemedText>
          <ThemedText style={s.toastName}>{currentToast.badgeName}</ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default function BadgesScreen() {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector((st) => st.badge.activeFilter);
  const { data, isLoading, isError, refetch } = useGetBadgeGalleryQuery();
  const [markSeen] = useMarkBadgeSeenMutation();

  const onFilter = useCallback(
    (k: "all" | "earned" | "locked") => dispatch(setActiveFilter(k)),
    [dispatch],
  );
  const onBadge = useCallback(
    (b: UserBadgeDTO) => {
      if (b.isNew) markSeen(b.badgeId);
    },
    [markSeen],
  );

  const filtered = useMemo(() => {
    if (!data) return { earned: [], locked: [] };
    if (activeFilter === "earned") return { earned: data.earned, locked: [] };
    if (activeFilter === "locked") return { earned: [], locked: data.locked };
    return { earned: data.earned, locked: data.locked };
  }, [data, activeFilter]);

  if (isLoading)
    return (
      <View style={s.screen}>
        <SafeAreaView edges={["top"]} style={s.safe}>
          <AppHeader title="Huy hiệu" showBackButton />
          <View style={s.center}>
            <ActivityIndicator size="large" color={C.primary} />
            <ThemedText style={s.mutedSm}>Đang tải...</ThemedText>
          </View>
        </SafeAreaView>
      </View>
    );

  if (isError || !data)
    return (
      <View style={s.screen}>
        <SafeAreaView edges={["top"]} style={s.safe}>
          <AppHeader title="Huy hiệu" showBackButton />
          <View style={s.center}>
            <Award color={C.locked} size={48} />
            <ThemedText style={s.secTitle}>Không thể tải</ThemedText>
            <Pressable style={s.retryBtn} onPress={refetch}>
              <ThemedText style={s.retryTxt}>Thử lại</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );

  return (
    <View style={s.screen}>
      <SafeAreaView edges={["top"]} style={s.safe}>
        <AppHeader title="Huy hiệu" showBackButton />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
          <View style={s.summary}>
            <View style={s.sumLeft}>
              <ThemedText style={s.sumCount}>
                {data.totalEarned}
                <ThemedText style={s.sumTotal}>/{data.totalAvailable}</ThemedText>
              </ThemedText>
              <ThemedText style={s.mutedSm}>Huy hiệu đã đạt</ThemedText>
            </View>
            <View style={s.sumRight}>
              <View style={s.progBg}>
                <View
                  style={[
                    s.progFill,
                    {
                      width: `${Math.round((data.totalEarned / Math.max(data.totalAvailable, 1)) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={s.filterRow}>
            {FILTERS.map((f) => (
              <FilterChip
                key={f.key}
                label={f.label}
                active={activeFilter === f.key}
                onPress={() => onFilter(f.key)}
              />
            ))}
          </View>
          {data.totalEarned === 0 && activeFilter !== "locked" && (
            <View style={s.empty}>
              <Award color={C.locked} size={42} />
              <ThemedText style={s.secTitle}>Chưa có huy hiệu nào</ThemedText>
              <ThemedText style={s.emptyDesc}>Hoàn thành bài học để mở khóa!</ThemedText>
            </View>
          )}
          {filtered.earned.length > 0 && (
            <View style={s.sec}>
              <ThemedText style={s.secTitle}>Đã đạt ({filtered.earned.length})</ThemedText>
              <View style={s.grid}>
                {filtered.earned.map((ub) => (
                  <EarnedCard
                    key={ub.id}
                    badge={ub}
                    iconComponent={ICONS[ub.badge.icon] ?? Award}
                    onPress={() => onBadge(ub)}
                  />
                ))}
              </View>
            </View>
          )}
          {filtered.locked.length > 0 && (
            <View style={s.sec}>
              <ThemedText style={s.secTitle}>Chưa mở ({filtered.locked.length})</ThemedText>
              <View style={s.grid}>
                {filtered.locked.map((b) => (
                  <LockedCard key={b.id} badge={b} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        <Toast />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  content: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + 120,
    gap: Spacing.three,
    maxWidth: 820,
    width: "100%",
    alignSelf: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.three },
  mutedSm: { color: C.muted, fontSize: 12, fontWeight: "700" },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.chip,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  sumLeft: { gap: Spacing.half },
  sumCount: {
    color: C.primaryLight,
    fontFamily: Fonts.mono,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  sumTotal: { color: C.muted, fontFamily: Fonts.mono, fontSize: 16, fontWeight: "700" },
  sumRight: { flex: 1, maxWidth: 140 },
  progBg: { height: 8, borderRadius: Radius.full, backgroundColor: C.chip, overflow: "hidden" },
  progFill: { height: "100%", borderRadius: Radius.full, backgroundColor: C.primary },
  filterRow: { flexDirection: "row", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    backgroundColor: C.chip,
  },
  chipOn: { backgroundColor: C.primary },
  chipTxt: { color: C.muted, fontSize: 13, fontWeight: "700" },
  chipTxtOn: { color: "#0C0C0E" },
  sec: { gap: Spacing.two },
  secTitle: { color: C.text, fontFamily: Fonts.sans, fontSize: 16, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  card: {
    width: "48%",
    minHeight: 136,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.chip,
    backgroundColor: C.surface,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardLocked: { opacity: 0.6 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.glow,
  },
  iconLocked: { backgroundColor: C.chip },
  dot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  cardName: { color: C.text, fontSize: 15, fontWeight: "800", lineHeight: 20 },
  cardDesc: { color: C.muted, fontSize: 12, fontWeight: "600", lineHeight: 16 },
  cardDate: {
    color: C.locked,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: "700",
    marginTop: Spacing.half,
  },
  lockTxt: { color: C.locked },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 48, gap: Spacing.two },
  emptyDesc: {
    color: C.muted,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 260,
  },
  retryBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    backgroundColor: C.primary,
  },
  retryTxt: { color: "#0C0C0E", fontSize: 14, fontWeight: "800" },
  toastWrap: { position: "absolute", bottom: 24, left: 16, right: 16, alignItems: "center" },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: "#201F21",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    maxWidth: 400,
    width: "100%",
  },
  toastIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: C.glow,
    alignItems: "center",
    justifyContent: "center",
  },
  toastBody: { flex: 1, gap: 2 },
  toastTitle: { color: C.primaryLight, fontSize: 13, fontWeight: "800" },
  toastName: { color: C.text, fontSize: 15, fontWeight: "700" },
});
