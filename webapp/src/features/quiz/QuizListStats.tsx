import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { quizStyles as styles } from "./ui";

export function QuizListStats() {
  return (
    <View style={styles.statsGrid}>
      <StatCard label="Tổng cộng" value="12" />
      <StatCard label="Hoàn thành" value="5" />
      <StatCard label="Điểm TB" value="78%" />
      <StatCard label="Chuỗi" value="3 ngày" />
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
