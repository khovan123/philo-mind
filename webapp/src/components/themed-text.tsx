import { Platform, type TextProps, type TextStyle } from "react-native";

import { Fonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Text } from "@/tw";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type ThemedTextProps = TextProps & {
  className?: string;
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

const typeClassName: Record<NonNullable<ThemedTextProps["type"]>, string> = {
  default: "text-base leading-6 font-medium",
  title: "text-5xl leading-[52px] font-semibold",
  subtitle: "text-[32px] leading-[44px] font-semibold",
  small: "text-sm leading-5 font-medium",
  smallBold: "text-sm leading-5 font-bold",
  label: "text-xs leading-4 font-semibold",
  link: "text-sm leading-[30px] font-medium",
  linkPrimary: "text-sm leading-[30px] font-semibold",
  code: "text-xs",
};

const typeFontStyle: Record<NonNullable<ThemedTextProps["type"]>, TextStyle> = {
  default: {
    fontFamily: Fonts.body,
  },
  title: {
    fontFamily: Fonts.sans,
  },
  subtitle: {
    fontFamily: Fonts.sans,
  },
  small: {
    fontFamily: Fonts.body,
  },
  smallBold: {
    fontFamily: Fonts.body,
  },
  label: {
    fontFamily: Fonts.body,
  },
  link: {
    fontFamily: Fonts.body,
  },
  linkPrimary: {
    fontFamily: Fonts.body,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: "700" }) ?? "500",
  },
};

export function ThemedText({
  style,
  className,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  const color = type === "linkPrimary" ? theme.primary : theme[themeColor ?? "text"];

  return (
    <Text
      className={cn(typeClassName[type], className)}
      style={[
        {
          color,
        },
        typeFontStyle[type],
        style,
      ]}
      {...rest}
    />
  );
}
