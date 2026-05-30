import { useEffect } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import {
  clampProgress,
  ProgressColors,
  type ProgressTone,
  toneFromProgress,
} from "./progress-theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
  tone?: ProgressTone;
  showLabel?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 9,
  duration = 520,
  tone,
  showLabel = true,
  label,
  style,
}: ProgressRingProps) {
  const progress = useSharedValue(clampProgress(value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const currentTone = tone ?? toneFromProgress(value);

  useEffect(() => {
    progress.value = withTiming(clampProgress(value), { duration });
  }, [duration, progress, value]);

  const animatedCircleProps = useAnimatedProps(() => {
    const nextColor = interpolateColor(
      progress.value,
      [0, 45, 75, 100],
      [ProgressColors.neutral, ProgressColors.warning, ProgressColors.info, ProgressColors.success],
    );

    return {
      strokeDashoffset: circumference * (1 - progress.value / 100),
      stroke: tone ? ProgressColors[currentTone] : nextColor,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ProgressColors.track}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedCircleProps}
          rotation="-90"
          originX={center}
          originY={center}
        />
      </Svg>

      {showLabel && (
        <View style={styles.labelLayer}>
          <ThemedText style={styles.percent}>{Math.round(clampProgress(value))}%</ThemedText>
          {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  labelLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  percent: {
    color: ProgressColors.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
  },

  label: {
    color: ProgressColors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
