import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "subtitle"
    | "small"
    | "smallBold"
    | "label"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = "default", themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  const color = type === "linkPrimary" ? theme.primary : theme[themeColor ?? "text"];

  return (
    <Text
      style={[
        { color },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "subtitle" && styles.subtitle,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "label" && styles.label,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "600",
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 32,
    lineHeight: 44,
    fontWeight: "600",
  },
  small: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  smallBold: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  link: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 30,
    fontWeight: "500",
  },
  linkPrimary: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 30,
    fontWeight: "600",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: "700" }) ?? "500",
    fontSize: 12,
  },
});
