import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "../themed-text";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme();

  const buttonStyle = getButtonStyle(variant, theme);
  const textColor = getTextColor(variant, theme);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        buttonStyle,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText type="smallBold" style={{ color: textColor }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

function getButtonStyle(variant: ButtonVariant, theme: ReturnType<typeof useTheme>) {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: theme.primary,
        borderColor: theme.primary,
      };

    case "secondary":
      return {
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundElement,
      };

    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: theme.border,
      };

    case "ghost":
      return {
        backgroundColor: "transparent",
        borderColor: "transparent",
      };

    case "danger":
      return {
        backgroundColor: theme.danger,
        borderColor: theme.danger,
      };
  }
}

function getTextColor(variant: ButtonVariant, theme: ReturnType<typeof useTheme>) {
  switch (variant) {
    case "primary":
      return theme.buttonText;

    case "danger":
      return "#FFFFFF";

    case "secondary":
    case "outline":
    case "ghost":
      return theme.text;
  }
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  sm: {
    minHeight: 40,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  md: {
    minHeight: 48,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  lg: {
    minHeight: 56,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },

  fullWidth: {
    width: "100%",
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.85,
  },
});
