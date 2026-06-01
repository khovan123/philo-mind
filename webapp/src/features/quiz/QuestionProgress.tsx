import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { QuizColors, quizStyles as styles } from "./ui";

type QuestionProgressProps = {
  current: number;
  progress: number;
  total: number;
};

export function QuestionProgress({ current, progress, total }: QuestionProgressProps) {
  return (
    <View>
      <View style={styles.rowBetween}>
        <ThemedText style={styles.statLabel}>
          Question {current} of {total}
        </ThemedText>
        <ThemedText style={[styles.statLabel, { color: QuizColors.primaryLight }]}>
          {Math.round(progress * 100)}% Complete
        </ThemedText>
      </View>
      <View style={[styles.progressTrack, { marginTop: 8 }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}
