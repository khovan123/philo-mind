import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { QuizColors, quizStyles as styles } from "./ui";

type QuestionProgressProps = {
  current: number;
  progress: number;
  total: number;
};

export function QuestionProgress({ current, progress, total }: QuestionProgressProps) {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.rowBetween}>
        <ThemedText style={styles.statLabel}>
          {t("quiz.question_progress", { current, total })}
        </ThemedText>
        <ThemedText style={[styles.statLabel, { color: QuizColors.primaryLight }]}>
          {t("quiz.percent_complete", { percent: Math.round(progress * 100) })}
        </ThemedText>
      </View>
      <View style={[styles.progressTrack, { marginTop: 8 }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}
