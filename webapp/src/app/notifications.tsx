import { useRouter } from "expo-router";
import {
  Award,
  Bell,
  BellOff,
  CheckCheck,
  ChevronRight,
  Flame,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react-native";
import { memo, useCallback } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";
import type { NotificationDTO, NotificationType } from "@/services/rtk-api/notification.api";
import {
  useListNotificationsQuery,
  useMarkAllReadMutation,
  useMarkNotificationReadMutation,
} from "@/services/rtk-api/notification.api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  setActiveTypeFilter,
  setExpandedNotificationId,
  toggleUnreadOnly,
} from "@/stores/slices/notification.slice";

const C = {
  bg: "#0C0C0E",
  surface: "#161618",
  chip: "#27272A",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  locked: "#52525B",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  glow: "rgba(217,119,6,0.14)",
  info: "#3B82F6",
  success: "#22C55E",
};

const TYPE_META: Record<NotificationType, { icon: typeof Bell; color: string; label: string }> = {
  badge_earned: { icon: Award, color: C.primaryLight, label: "Huy hiệu" },
  streak_milestone: { icon: Flame, color: "#F59E0B", label: "Streak" },
  debate_reply: { icon: MessageCircle, color: C.info, label: "Tranh luận" },
  quiz_result: { icon: Trophy, color: C.success, label: "Quiz" },
  story_complete: { icon: Sparkles, color: C.primaryLight, label: "Câu chuyện" },
  system: { icon: Bell, color: C.muted, label: "Hệ thống" },
};

const TYPE_FILTERS: { key: NotificationType | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "badge_earned", label: "Huy hiệu" },
  { key: "debate_reply", label: "Tranh luận" },
  { key: "streak_milestone", label: "Streak" },
  { key: "system", label: "Hệ thống" },
];

const TypeChip = memo(function TypeChip({
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

const NotifItem = memo(function NotifItem({
  n,
  expanded,
  onPress,
  onDeepLink,
}: {
  n: NotificationDTO;
  expanded: boolean;
  onPress: () => void;
  onDeepLink: () => void;
}) {
  const meta = TYPE_META[n.type] || TYPE_META.system;
  const Icon = meta.icon;
  return (
    <Pressable style={[s.notifCard, !n.isRead && s.notifUnread]} onPress={onPress}>
      <View style={s.notifRow}>
        <View style={[s.notifIcon, { backgroundColor: `${meta.color}20` }]}>
          <Icon color={meta.color} size={18} />
        </View>
        <View style={s.notifBody}>
          <View style={s.notifHead}>
            <ThemedText style={s.notifTitle} numberOfLines={expanded ? undefined : 1}>
              {n.title}
            </ThemedText>
            {!n.isRead && <View style={s.unreadDot} />}
          </View>
          <ThemedText style={s.notifText} numberOfLines={expanded ? undefined : 2}>
            {n.body}
          </ThemedText>
          <View style={s.notifMeta}>
            <ThemedText style={s.notifTag}>{meta.label}</ThemedText>
            <ThemedText style={s.notifTime}>{timeAgo(n.createdAt)}</ThemedText>
          </View>
        </View>
        {n.deepLink && (
          <Pressable onPress={onDeepLink} hitSlop={8}>
            <ChevronRight color={C.locked} size={16} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Vừa xong";
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const d = Math.floor(hr / 24);
  return `${d} ngày trước`;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activeTypeFilter, showUnreadOnly, expandedNotificationId } = useAppSelector(
    (st) => st.notification,
  );

  const filters = {
    type: activeTypeFilter !== "all" ? activeTypeFilter : undefined,
    unreadOnly: showUnreadOnly || undefined,
    limit: 50,
  };
  const { data, isLoading, isError, refetch } = useListNotificationsQuery(filters);
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllReadMutation();

  const onItemPress = useCallback(
    (id: string, isRead: boolean) => {
      dispatch(setExpandedNotificationId(expandedNotificationId === id ? null : id));
      if (!isRead) markRead(id);
    },
    [dispatch, expandedNotificationId, markRead],
  );

  const onDeepLink = useCallback(
    (link: string) => {
      router.push(link as never);
    },
    [router],
  );

  if (isLoading)
    return (
      <View style={s.screen}>
        <SafeAreaView edges={["top"]} style={s.safe}>
          <AppHeader title="Thông báo" showBackButton />
          <View style={s.center}>
            <ActivityIndicator size="large" color={C.primary} />
          </View>
        </SafeAreaView>
      </View>
    );

  if (isError)
    return (
      <View style={s.screen}>
        <SafeAreaView edges={["top"]} style={s.safe}>
          <AppHeader title="Thông báo" showBackButton />
          <View style={s.center}>
            <BellOff color={C.locked} size={48} />
            <ThemedText style={s.secTitle}>Không thể tải</ThemedText>
            <Pressable style={s.retryBtn} onPress={refetch}>
              <ThemedText style={s.retryTxt}>Thử lại</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );

  const notifications = data?.notifications ?? [];
  const unread = data?.unreadCount ?? 0;

  return (
    <View style={s.screen}>
      <SafeAreaView edges={["top"]} style={s.safe}>
        <AppHeader title="Thông báo" showBackButton />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
          {/* Header bar */}
          <View style={s.topBar}>
            <View style={s.topLeft}>
              <Bell color={C.primaryLight} size={18} />
              <ThemedText style={s.unreadLabel}>{unread} chưa đọc</ThemedText>
            </View>
            <View style={s.topActions}>
              <Pressable
                onPress={() => dispatch(toggleUnreadOnly())}
                style={[s.toggleBtn, showUnreadOnly && s.toggleOn]}
              >
                <ThemedText style={[s.toggleTxt, showUnreadOnly && s.toggleTxtOn]}>
                  Chưa đọc
                </ThemedText>
              </Pressable>
              {unread > 0 && (
                <Pressable style={s.markAllBtn} onPress={() => markAll()}>
                  <CheckCheck color={C.primaryLight} size={14} />
                  <ThemedText style={s.markAllTxt}>Đọc tất cả</ThemedText>
                </Pressable>
              )}
            </View>
          </View>

          {/* Type filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filterRow}
          >
            {TYPE_FILTERS.map((f) => (
              <TypeChip
                key={f.key}
                label={f.label}
                active={activeTypeFilter === f.key}
                onPress={() => dispatch(setActiveTypeFilter(f.key))}
              />
            ))}
          </ScrollView>

          {/* Empty */}
          {notifications.length === 0 && (
            <View style={s.empty}>
              <BellOff color={C.locked} size={42} />
              <ThemedText style={s.secTitle}>Không có thông báo</ThemedText>
              <ThemedText style={s.emptyDesc}>Các thông báo mới sẽ xuất hiện ở đây</ThemedText>
            </View>
          )}

          {/* List */}
          <View style={s.list}>
            {notifications.map((n) => (
              <NotifItem
                key={n.id}
                n={n}
                expanded={expandedNotificationId === n.id}
                onPress={() => onItemPress(n.id, n.isRead)}
                onDeepLink={() => n.deepLink && onDeepLink(n.deepLink)}
              />
            ))}
          </View>
        </ScrollView>
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
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  unreadLabel: { color: C.primaryLight, fontSize: 14, fontWeight: "800" },
  topActions: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  toggleBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    backgroundColor: C.chip,
  },
  toggleOn: { backgroundColor: C.primary },
  toggleTxt: { color: C.muted, fontSize: 11, fontWeight: "700" },
  toggleTxtOn: { color: "#0C0C0E" },
  markAllBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  markAllTxt: { color: C.primaryLight, fontSize: 12, fontWeight: "700" },
  filterRow: { flexDirection: "row", gap: Spacing.two, paddingVertical: 2 },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    backgroundColor: C.chip,
  },
  chipOn: { backgroundColor: C.primary },
  chipTxt: { color: C.muted, fontSize: 12, fontWeight: "700" },
  chipTxtOn: { color: "#0C0C0E" },
  list: { gap: Spacing.two },
  notifCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.chip,
    backgroundColor: C.surface,
    padding: Spacing.three,
  },
  notifUnread: { borderColor: `${C.primary}44`, backgroundColor: "#1a1510" },
  notifRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  notifIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBody: { flex: 1, gap: Spacing.one },
  notifHead: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  notifTitle: { color: C.text, fontSize: 14, fontWeight: "800", flex: 1 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary },
  notifText: { color: C.muted, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  notifMeta: { flexDirection: "row", alignItems: "center", gap: Spacing.two, marginTop: 2 },
  notifTag: { color: C.locked, fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  notifTime: { color: C.locked, fontFamily: Fonts.mono, fontSize: 10, fontWeight: "600" },
  secTitle: { color: C.text, fontFamily: Fonts.sans, fontSize: 16, fontWeight: "800" },
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
});
