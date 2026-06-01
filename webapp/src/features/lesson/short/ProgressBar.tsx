import { useEffect, useState } from "react";
import { Animated, View } from "react-native";

import { styles } from "./ui";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const [animated] = useState(() => new Animated.Value(value));

  useEffect(() => {
    Animated.timing(animated, {
      toValue: value,
      duration: 360,
      useNativeDriver: false,
    }).start();
  }, [animated, value]);

  const width = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width }]} />
    </View>
  );
}
