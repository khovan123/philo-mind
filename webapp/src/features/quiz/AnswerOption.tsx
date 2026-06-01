import { CheckCircle2, XCircle } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { QuizQuestion } from "./mock";
import type { FeedbackState } from "./types";
import { QuizColors, quizStyles as styles } from "./ui";

type AnswerOptionProps = {
  correctOptionId: string;
  disabled: boolean;
  feedback: FeedbackState;
  onSelect: (id: string) => void;
  option: QuizQuestion["options"][number];
  selectedOptionId: string | null;
};

export function AnswerOption({
  correctOptionId,
  disabled,
  feedback,
  onSelect,
  option,
  selectedOptionId,
}: AnswerOptionProps) {
  const selected = selectedOptionId === option.id;
  const correct = option.id === correctOptionId;
  const reveal = feedback === "correct" || feedback === "wrong" || feedback === "timeout";
  const wrongSelection = reveal && selected && !correct;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onSelect(option.id)}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        reveal && correct && styles.optionCorrect,
        wrongSelection && styles.optionWrong,
        disabled && !correct && !wrongSelection && { opacity: 0.55 },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.optionBadge}>
        <ThemedText style={styles.metaText}>{option.label}</ThemedText>
      </View>
      <ThemedText style={styles.optionText}>{option.text}</ThemedText>
      {reveal && correct ? <CheckCircle2 color={QuizColors.success} size={18} /> : null}
      {wrongSelection ? <XCircle color={QuizColors.danger} size={18} /> : null}
    </Pressable>
  );
}
