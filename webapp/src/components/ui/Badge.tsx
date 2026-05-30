import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "../themed-text";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, variant = "default", style }: BadgeProps) {
  const theme = useTheme();

  const colors = getBadgeColors(variant, theme);

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }, style]}>
      <ThemedText type="label" style={{ color: colors.text }}>
        {label}
      </ThemedText>
    </View>
  );
}

function getBadgeColors(variant: BadgeVariant, theme: ReturnType<typeof useTheme>) {
  switch (variant) {
    case "success":
      return {
        background: theme.success,
        text: theme.neutral,
      };

    case "warning":
      return {
        background: theme.warning,
        text: theme.neutral,
      };

    case "danger":
      return {
        background: theme.danger,
        text: "#FFFFFF",
      };

    case "info":
      return {
        background: theme.info,
        text: "#FFFFFF",
      };

    case "default":
      return {
        background: theme.backgroundSelected,
        text: theme.text,
      };
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
});
