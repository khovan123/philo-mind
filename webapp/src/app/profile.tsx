import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Profile</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        User profile, progress, and account settings will appear here.
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
