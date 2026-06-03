import { useEffect } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Fonts, Radius, Spacing } from "@/constants/theme";
import {
  colorForTone,
  labelFromStatus,
  type ProgressStatus,
  type ProgressTone,
  toneFromStatus,
} from "./progress-theme";

const toneOrder: ProgressTone[] = ["neutral", "info", "warning", "success", "danger", "locked"];
const toneInputRange = toneOrder.map((_, index) => index);
const toneColors = toneOrder.map((item) => colorForTone(item));
const toneBackgroundColors = toneOrder.map((item) => `${colorForTone(item)}24`);

type StatusBadgeProps = {
  status: ProgressStatus;
  label?: string;
  tone?: ProgressTone;
  duration?: number;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
};

export function StatusBadge({
  status,
  label,
  tone,
  duration = 360,
  size = "md",
  style,
}: StatusBadgeProps) {
  const resolvedTone = tone ?? toneFromStatus(status);
  const toneValue = useSharedValue(toneOrder.indexOf(resolvedTone));

  useEffect(() => {
    toneValue.value = withTiming(toneOrder.indexOf(resolvedTone), { duration });
  }, [duration, resolvedTone, toneValue]);

  const badgeStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      toneValue.value,
      toneInputRange,
      toneColors,
    );

    const backgroundColor = interpolateColor(
      toneValue.value,
      toneInputRange,
      toneBackgroundColors,
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const dotStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      toneValue.value,
      toneInputRange,
      toneColors,
    );

    return {
      backgroundColor,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      toneValue.value,
      toneInputRange,
      toneColors,
    );

    return {
      color,
    };
  });

  return (
    <Animated.View style={[styles.badge, styles[size], badgeStyle, style]}>
      <Animated.View style={[styles.dot, dotStyle]} />
      <Animated.Text style={[styles.text, size === "sm" && styles.smallText, textStyle]}>
        {label ?? labelFromStatus(status)}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.full,
    gap: Spacing.two,
  },

  sm: {
    minHeight: 28,
    paddingHorizontal: Spacing.two,
  },

  md: {
    minHeight: 34,
    paddingHorizontal: Spacing.three,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
  },

  text: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },

  smallText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
