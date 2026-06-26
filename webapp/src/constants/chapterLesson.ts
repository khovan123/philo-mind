import { Colors as ThemeColors } from "@/constants/theme";

export const CHAPTER_LESSON_STEP_NAMES = ["Hook", "Thẻ lí thuyết", "Luyện tập"] as const;

export const LessonColors = {
  outerBackground: ThemeColors.dark.backgroundElement,
  innerBackground: ThemeColors.dark.background,
  surface: ThemeColors.dark.surface,
  surfaceElevated: ThemeColors.dark.surfaceElevated,
  surfaceSelected: ThemeColors.dark.backgroundSelected,
  border: ThemeColors.dark.border,
  borderStrong: ThemeColors.dark.backgroundSelected,
  text: ThemeColors.dark.text,
  muted: ThemeColors.dark.textSecondary,
  dimmed: ThemeColors.dark.textMuted,
  accent: ThemeColors.dark.primaryLight,
  accentSolid: ThemeColors.dark.primary,
  accentDark: ThemeColors.dark.primaryDark,
  success: ThemeColors.dark.success,
  danger: ThemeColors.dark.danger,
  buttonText: ThemeColors.dark.buttonText,
} as const;

export const TreeColors = {
  background: ThemeColors.dark.background,
  surface: ThemeColors.dark.surface,
  surfaceActive: ThemeColors.dark.surfaceElevated,
  chip: ThemeColors.dark.backgroundSelected,
  border: ThemeColors.dark.border,
  borderStrong: ThemeColors.dark.backgroundSelected,
  text: ThemeColors.dark.text,
  muted: ThemeColors.dark.textSecondary,
  locked: ThemeColors.dark.textMuted,
  primary: ThemeColors.dark.primary,
  primaryLight: ThemeColors.dark.primaryLight,
  primaryText: ThemeColors.dark.buttonText,
} as const;
