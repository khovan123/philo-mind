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
  rightElement?: React.ReactNode;
};

export function Input({
  label,
  error,
  helperText,
  containerStyle,
  rightElement,
  style,
  ...props
}: InputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <ThemedText type="label">{label}</ThemedText> : null}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: error ? theme.danger : theme.border,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              color: theme.text,
            },
            style,
          ]}
          {...props}
        />

        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>

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

  inputWrapper: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radius.md,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: "500",
  },

  rightElement: {
    paddingRight: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
});
