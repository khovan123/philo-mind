import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#0C0C0E",
    textSecondary: "#60646C",
    textMuted: "#787777",

    background: "#F4F1F0",
    backgroundElement: "#E4E4E7",
    backgroundSelected: "#D6D3D1",

    surface: "#FFFFFF",
    surfaceElevated: "#F7F4F3",
    border: "#D6D3D1",

    primary: "#D97706",
    primaryLight: "#FDBA74",
    primaryDark: "#92400E",

    secondary: "#E4E4E7",
    tertiary: "#A1A1AA",
    neutral: "#0C0C0E",

    icon: "#0C0C0E",
    buttonText: "#0C0C0E",

    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },

  dark: {
    text: "#E4E4E7",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",

    background: "#0C0C0E",
    backgroundElement: "#1A1A1A",
    backgroundSelected: "#262626",

    surface: "#1A1A1A",
    surfaceElevated: "#202024",
    border: "#2F2A24",

    primary: "#D97706",
    primaryLight: "#FDBA74",
    primaryDark: "#92400E",

    secondary: "#E4E4E7",
    tertiary: "#A1A1AA",
    neutral: "#0C0C0E",

    icon: "#E4E4E7",
    buttonText: "#0C0C0E",

    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    body: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "normal",
    body: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    body: "var(--font-body)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
  default: {
    sans: "normal",
    body: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
