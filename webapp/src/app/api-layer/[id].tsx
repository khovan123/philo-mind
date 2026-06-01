import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetApiLayerCheckByIdQuery } from "@/services/rtk-api/apiLayer.api";

export default function ApiLayerDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useGetApiLayerCheckByIdQuery(id, {
    skip: !id,
  });

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable onPress={() => router.back()}>
        <ThemedText type="smallBold">← Quay lại</ThemedText>
      </Pressable>

      {isLoading && (
        <ThemedView type="surface" style={styles.stateBox}>
          <ActivityIndicator />
          <ThemedText type="small" themeColor="textSecondary">
            Đang tải chi tiết...
          </ThemedText>
        </ThemedView>
      )}

      {!isLoading && isError && (
        <ThemedView type="surface" style={[styles.box, { borderColor: theme.danger }]}>
          <ThemedText type="smallBold" style={{ color: theme.danger }}>
            Không thể tải chi tiết.
          </ThemedText>

          <Pressable
            onPress={() => refetch()}
            style={[styles.secondaryButton, { borderColor: theme.border }]}
          >
            <ThemedText type="smallBold">Thử lại</ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {!isLoading && !isError && !data && (
        <ThemedView type="surface" style={styles.stateBox}>
          <ThemedText type="small" themeColor="textSecondary">
            Không tìm thấy check.
          </ThemedText>
        </ThemedView>
      )}

      {!isLoading && !isError && data && (
        <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
          <ThemedText type="subtitle">{data.title}</ThemedText>

          <ThemedText type="small" themeColor="textSecondary">
            {data.description}
          </ThemedText>

          <ThemedText type="label" themeColor="textMuted">
            Acceptance Criteria
          </ThemedText>
          <ThemedText type="code">{data.ac}</ThemedText>

          <ThemedText type="label" themeColor="textMuted">
            Status
          </ThemedText>
          <ThemedText type="code" style={{ color: theme.success }}>
            {data.status}
          </ThemedText>

          <ThemedText type="label" themeColor="textMuted">
            Evidence
          </ThemedText>
          <ThemedText type="small">{data.evidence}</ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  stateBox: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
    alignItems: "center",
  },
  box: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  secondaryButton: {
    marginTop: Spacing.three,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
});
