import { Trophy } from "lucide-react-native";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { QuizColors, quizStyles as styles } from "./ui";

export function QuizListEmpty() {
  return (
    <View style={styles.stateCard}>
      <Trophy color={QuizColors.muted} size={36} />
      <ThemedText style={styles.cardTitle}>No quizzes found</ThemedText>
      <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
        Try another search term or filter.
      </ThemedText>
    </View>
  );
}
