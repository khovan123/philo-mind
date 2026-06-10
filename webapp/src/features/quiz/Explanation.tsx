import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { QuizQuestion } from "./mock";
import type { FeedbackState } from "./types";
import { QuizColors, quizStyles as styles } from "./ui";

type ExplanationProps = {
  feedback: FeedbackState;
  question: QuizQuestion;
};

export function Explanation({ feedback, question }: ExplanationProps) {
  const { t } = useTranslation();

  const title =
    feedback === "timeout"
      ? t("quiz.explanation_timeout")
      : feedback === "correct"
        ? t("quiz.explanation_correct")
        : t("quiz.explanation_incorrect");

  return (
    <View style={styles.explanation}>
      <ThemedText style={styles.explanationTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardText}>{question.explanation}</ThemedText>
      <ThemedText style={[styles.metaText, { color: QuizColors.primaryLight }]}>
        {question.concept}
      </ThemedText>
    </View>
  );
}
