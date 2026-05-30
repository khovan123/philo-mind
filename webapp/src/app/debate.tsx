import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export default function DebateScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Debate</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        Debate scenarios and philosophical arguments will appear here.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
