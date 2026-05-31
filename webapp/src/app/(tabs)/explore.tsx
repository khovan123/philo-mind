import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Explore</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        Explore philosophical topics, thinkers, and real-life questions.
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
