// ── T-D15: StepProgress component (shared across all 7 steps) ──
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { StoryStep } from "@/stores/story.store";

const STEPS: { key: StoryStep; label: string; shortLabel: string }[] = [
  { key: "intro", label: "Giới thiệu", shortLabel: "1" },
  { key: "learn", label: "Tìm hiểu", shortLabel: "2" },
  { key: "dilemma", label: "Tình huống", shortLabel: "3" },
  { key: "choose", label: "Lựa chọn", shortLabel: "4" },
  { key: "result", label: "Hệ quả", shortLabel: "5" },
  { key: "knowledge", label: "Tri thức", shortLabel: "6" },
  { key: "reflect", label: "Suy ngẫm", shortLabel: "7" },
];

type StepProgressProps = {
  currentStep: StoryStep;
  onStepPress?: (step: StoryStep) => void;
  /** Steps that have been completed (allow navigation back) */
  completedSteps?: StoryStep[];
};

export function StepProgress({ currentStep, onStepPress, completedSteps = [] }: StepProgressProps) {
  const theme = useTheme();
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      {/* Progress bar background */}
      <View style={[styles.trackBg, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: theme.primary,
              width: `${Math.max(((currentIndex + 1) / STEPS.length) * 100, 5)}%`,
            },
          ]}
        />
      </View>

      {/* Step indicators */}
      <View style={styles.stepsRow}>
        {STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = completedSteps.includes(step.key) || index < currentIndex;
          const isFuture = index > currentIndex;
          const canNavigate = isCompleted && onStepPress && !isActive;

          return (
            <Pressable
              key={step.key}
              accessibilityRole="button"
              disabled={!canNavigate}
              onPress={() => canNavigate && onStepPress?.(step.key)}
              style={styles.stepItem}
            >
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: isActive
                      ? theme.primary
                      : isCompleted
                        ? theme.primaryDark
                        : theme.backgroundElement,
                    borderColor: isActive
                      ? theme.primaryLight
                      : isCompleted
                        ? theme.primaryDark
                        : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="label"
                  style={{
                    color: isActive || isCompleted ? "#FFFFFF" : theme.textMuted,
                    fontSize: 10,
                    fontWeight: "800",
                  }}
                >
                  {isCompleted && !isActive ? "✓" : step.shortLabel}
                </ThemedText>
              </View>
              <ThemedText
                type="label"
                numberOfLines={1}
                style={{
                  color: isActive
                    ? theme.primary
                    : isCompleted
                      ? theme.textSecondary
                      : isFuture
                        ? theme.textMuted
                        : theme.text,
                  fontWeight: isActive ? "800" : "600",
                  fontSize: 9,
                  marginTop: 2,
                }}
              >
                {step.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  trackBg: {
    height: 3,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
