import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { quizStyles as styles } from "./ui";

export function QuizListStats() {
  const { t } = useTranslation();

  return (
    <View style={styles.statsGrid}>
      <StatCard label={t("quiz.stat_total")} value="12" />
      <StatCard label={t("quiz.stat_completed_count")} value="5" />
      <StatCard label={t("quiz.stat_avg_score")} value="78%" />
      <StatCard label={t("quiz.stat_streak")} value={t("quiz.stat_streak_days", { days: 3 })} />
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}
