import { useEffect } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import {
  clampProgress,
  ProgressColors,
  type ProgressTone,
  toneFromProgress,
} from "./progress-theme";

type ProgressBadgeProps = {
  value: number;
  label: string;
  detail?: string;
  tone?: ProgressTone;
  duration?: number;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBadge({
  value,
  label,
  detail,
  tone,
  duration = 520,
  compact = false,
  style,
}: ProgressBadgeProps) {
  const progress = useSharedValue(clampProgress(value));
  const currentTone = tone ?? toneFromProgress(value);

  useEffect(() => {
    progress.value = withTiming(clampProgress(value), { duration });
  }, [duration, progress, value]);

  const fillStyle = useAnimatedStyle(() => {
    const nextColor = interpolateColor(
      progress.value,
      [0, 45, 75, 100],
      [ProgressColors.neutral, ProgressColors.warning, ProgressColors.info, ProgressColors.success],
    );

    return {
      width: `${progress.value}%`,
      backgroundColor: tone ? ProgressColors[currentTone] : nextColor,
    };
  });

  const accentStyle = useAnimatedStyle(() => {
    const nextColor = interpolateColor(
      progress.value,
      [0, 45, 75, 100],
      [ProgressColors.neutral, ProgressColors.warning, ProgressColors.info, ProgressColors.success],
    );

    return {
      color: tone ? ProgressColors[currentTone] : nextColor,
    };
  });

  return (
    <View style={[styles.card, compact && styles.compactCard, style]}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {detail ? <ThemedText style={styles.detail}>{detail}</ThemedText> : null}
        </View>

        <Animated.Text style={[styles.value, accentStyle]}>
          {Math.round(clampProgress(value))}%
        </Animated.Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: ProgressColors.border,
    backgroundColor: ProgressColors.surface,
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  compactCard: {
    minHeight: 62,
    padding: Spacing.two,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  copy: {
    flex: 1,
    gap: Spacing.half,
  },

  label: {
    color: ProgressColors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },

  detail: {
    color: ProgressColors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },

  value: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },

  track: {
    height: 5,
    borderRadius: Radius.full,
    overflow: "hidden",
    backgroundColor: ProgressColors.track,
  },

  fill: {
    height: "100%",
    borderRadius: Radius.full,
  },
});
