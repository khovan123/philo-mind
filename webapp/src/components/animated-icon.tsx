import { BrainCircuit } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const SPLASH_DURATION = 1800;
const FADE_DURATION = 420;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(10);
  const pulse = useSharedValue(0.96);

  useEffect(() => {
    contentOpacity.value = withDelay(220, withTiming(1, { duration: 520 }));
    contentY.value = withDelay(
      220,
      withTiming(0, { duration: 520, easing: Easing.out(Easing.cubic) }),
    );
    pulse.value = withDelay(
      220,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }),
    );

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: FADE_DURATION });
      setTimeout(() => setVisible(false), FADE_DURATION);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [contentOpacity, contentY, opacity, pulse]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }, { scale: pulse.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="auto" style={[styles.overlay, overlayStyle]}>
      <Animated.View style={[styles.brand, contentStyle]}>
        <View style={styles.logoMark}>
          <BrainCircuit color="#D97706" size={28} strokeWidth={1.8} />
        </View>
        <Text style={styles.brandName}>PhiloMind</Text>
        <Text style={styles.tagline}>Tư duy phản biện qua trải nghiệm</Text>
      </Animated.View>
    </Animated.View>
  );
}

export function AnimatedIcon() {
  return (
    <View style={styles.logoMark}>
      <BrainCircuit color="#D97706" size={28} strokeWidth={1.8} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C0C0E",
  },
  brand: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoMark: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(217,119,6,0.55)",
    backgroundColor: "rgba(217,119,6,0.05)",
  },
  brandName: {
    marginTop: 22,
    color: "#E4E4E7",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  tagline: {
    marginTop: 6,
    color: "#A1A1AA",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
});
