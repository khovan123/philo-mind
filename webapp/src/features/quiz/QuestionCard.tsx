import { Image } from "expo-image";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { QuizQuestion } from "./mock";
import { quizStyles as styles } from "./ui";

type QuestionCardProps = {
  question: QuizQuestion;
};

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <View style={styles.questionCard}>
      <ThemedText style={styles.statLabel}>{question.concept}</ThemedText>
      <ThemedText style={styles.questionTitle}>{question.prompt}</ThemedText>
      {question.image ? (
        <Image source={question.image} contentFit="cover" style={styles.quizImage} />
      ) : null}
      {question.context ? (
        <View style={styles.contextBox}>
          <ThemedText style={styles.cardText}>{question.context}</ThemedText>
        </View>
      ) : null}
    </View>
  );
}
