import { Menu, Settings, ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { NotificationBell } from "@/components/notification-bell";
import { Fonts, Spacing } from "@/constants/theme";

const Colors = {
  background: "#0C0C0E",
  chip: "#27272A",
  primaryLight: "#FFB77D",
};

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function AppHeader({ title, showBackButton }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerBrand}>
        {showBackButton ? (
          <Pressable style={styles.headerIconButton} onPress={() => router.back()}>
            <ChevronLeft color={Colors.primaryLight} size={24} />
          </Pressable>
        ) : (
          <Pressable style={styles.headerIconButton} onPress={() => router.push("/(tabs)" as never)}>
            <Menu color={Colors.primaryLight} size={20} />
          </Pressable>
        )}
        <ThemedText style={styles.logo}>{title || "Philomind"}</ThemedText>
      </View>

      {!showBackButton && (
        <View style={styles.headerActions}>
          <NotificationBell />
          <Pressable style={styles.headerIconButton} onPress={() => router.push("/settings" as never)}>
            <Settings color={Colors.primaryLight} size={18} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.chip,
    backgroundColor: Colors.background,
  },

  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  headerIconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  logo: {
    color: Colors.primaryLight,
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
  },
});
