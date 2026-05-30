import React from "react";
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";

import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "../themed-text";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, error, helperText, containerStyle, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <ThemedText type="label">{label}</ThemedText> : null}

      <TextInput
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
        ]}
        {...props}
      />

      {error ? (
        <ThemedText type="label" style={{ color: theme.danger }}>
          {error}
        </ThemedText>
      ) : helperText ? (
        <ThemedText type="label" themeColor="textSecondary">
          {helperText}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: "500",
  },
});
