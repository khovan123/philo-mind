import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "../themed-text";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
};

export function Input({
  label,
  error,
  helperText,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  style,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const shouldSecureText = isPassword ? !passwordVisible : secureTextEntry;

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
          secureTextEntry={shouldSecureText}
          style={[
            styles.input,
            {
              color: theme.text,
            },
            style,
          ]}
          {...props}
        />

        {isPassword ? (
          <Pressable
            hitSlop={8}
            onPress={() => setPasswordVisible((prev) => !prev)}
            style={styles.iconButton}
          >
            {passwordVisible ? (
              <EyeOff size={18} color={theme.textSecondary} />
            ) : (
              <Eye size={18} color={theme.textSecondary} />
            )}
          </Pressable>
        ) : null}
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

  iconButton: {
    width: 44,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
