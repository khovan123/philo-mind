import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useGetUnreadCountQuery } from "@/services/rtk-api/notification.api";

const C = {
  primaryLight: "#FFB77D",
  danger: "#EF4444",
};

/**
 * Notification bell icon with unread badge.
 * Drop into AppHeader or any toolbar.
 * Uses RTK Query polling for near-real-time count.
 */
export const NotificationBell = memo(function NotificationBell() {
  const router = useRouter();
  const { data } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30_000, // poll every 30s
  });

  const count = data?.count ?? 0;

  return (
    <Pressable
      style={styles.button}
      onPress={() => router.push("/notifications" as never)}
      accessibilityLabel={`Thông báo${count > 0 ? `, ${count} chưa đọc` : ""}`}
    >
      <Bell color={C.primaryLight} size={20} />
      {count > 0 && (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{count > 99 ? "99+" : String(count)}</ThemedText>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: C.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.half,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 12,
  },
});
