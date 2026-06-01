import { ArrowRight } from "lucide-react-native";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { FeedbackState } from "./types";
import { QuizColors, quizStyles as styles } from "./ui";

type SubmitActionProps = {
  answered: boolean;
  disabled: boolean;
  feedback: FeedbackState;
  isLast: boolean;
  onPress: () => void;
};

export function SubmitAction({ answered, disabled, feedback, isLast, onPress }: SubmitActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <ThemedText style={styles.primaryButtonText}>
        {answered
          ? isLast
            ? "View Result"
            : "Next Question"
          : feedback === "submitting"
            ? "Submitting..."
            : "Submit Answer"}
      </ThemedText>
      <ArrowRight color={QuizColors.buttonText} size={16} />
    </Pressable>
  );
}
