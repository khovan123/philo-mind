import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react-native";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { QuizColors, quizStyles as styles } from "./ui";

export function QuizListEmpty() {
  const { t } = useTranslation();

  return (
    <View style={styles.stateCard}>
      <Trophy color={QuizColors.muted} size={36} />
      <ThemedText style={styles.cardTitle}>{t("quiz.no_quizzes_found")}</ThemedText>
      <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
        {t("quiz.try_another_filter")}
      </ThemedText>
    </View>
  );
}
