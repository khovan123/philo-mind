import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { quizStyles as styles } from "./ui";

export function QuizListStats() {
  return (
    <View style={styles.statsGrid}>
      <StatCard label="Total" value="12" />
      <StatCard label="Completed" value="5" />
      <StatCard label="Avg Score" value="78%" />
      <StatCard label="Streak" value="3 days" />
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
