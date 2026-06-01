import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useGetApiLayerChecksQuery,
  useRunApiLayerCheckMutation,
} from "@/services/rtk-api/apiLayer.api";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    return `Request failed: ${String(error.status)}`;
  }

  return "Không thể tải API layer checks.";
}

export default function ApiLayerScreen() {
  const theme = useTheme();

  const { data = [], isLoading, isFetching, isError, error, refetch } = useGetApiLayerChecksQuery();

  const [runApiLayerCheck, { data: runResult, isLoading: isSubmitting, isError: isSubmitError }] =
    useRunApiLayerCheckMutation();

  const disabled = isLoading || isFetching || isSubmitting;
  const isEmpty = !isLoading && !isError && data.length === 0;

  async function handleRunCheck() {
    try {
      await runApiLayerCheck().unwrap();
    } catch {
      // RTK Query exposes error through isSubmitError.
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedText type="subtitle">RTK Query API Layer</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        baseQuery, reauth, token persistence, 401 retry queue và type-safe endpoints.
      </ThemedText>

      <Pressable
        disabled={disabled}
        onPress={handleRunCheck}
        style={[
          styles.primaryButton,
          { backgroundColor: theme.primary },
          disabled && styles.disabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold" style={{ color: theme.buttonText }}>
            Run API Layer Check
          </ThemedText>
        )}
      </Pressable>

      {runResult && (
        <ThemedView type="surface" style={[styles.box, { borderColor: theme.success }]}>
          <ThemedText type="smallBold" style={{ color: theme.success }}>
            Check success
          </ThemedText>

          <ThemedText type="small">{runResult.message}</ThemedText>

          <ThemedText type="code" themeColor="textSecondary">
            queued={runResult.queuedRequestCount} · refresh=
            {runResult.refreshCallCount} · retried=
            {runResult.retriedRequestCount}
          </ThemedText>
        </ThemedView>
      )}

      {isSubmitError && (
        <ThemedView type="surface" style={[styles.box, { borderColor: theme.danger }]}>
          <ThemedText type="smallBold" style={{ color: theme.danger }}>
            Run API Layer Check thất bại.
          </ThemedText>
        </ThemedView>
      )}

      {isLoading && (
        <ThemedView type="surface" style={styles.stateBox}>
          <ActivityIndicator />
          <ThemedText type="small" themeColor="textSecondary">
            Đang tải API layer checks...
          </ThemedText>
        </ThemedView>
      )}

      {!isLoading && isError && (
        <ThemedView type="surface" style={[styles.box, { borderColor: theme.danger }]}>
          <ThemedText type="smallBold" style={{ color: theme.danger }}>
            {getErrorMessage(error)}
          </ThemedText>

          <Pressable
            disabled={disabled}
            onPress={() => refetch()}
            style={[
              styles.secondaryButton,
              { borderColor: theme.border },
              disabled && styles.disabled,
            ]}
          >
            <ThemedText type="smallBold">Thử lại</ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {isEmpty && (
        <ThemedView type="surface" style={styles.stateBox}>
          <ThemedText type="small" themeColor="textSecondary">
            Chưa có API layer check nào.
          </ThemedText>
        </ThemedView>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <View style={styles.list}>
          {data.map((item) => (
            <Pressable
              key={item.id}
              disabled={disabled}
              onPress={() =>
                router.push({
                  pathname: "/api-layer/[id]",
                  params: { id: item.id },
                } as never)
              }
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
                disabled && styles.disabled,
              ]}
            >
              <View style={styles.cardHeader}>
                <ThemedText type="smallBold" style={styles.cardTitle}>
                  {item.title}
                </ThemedText>

                <ThemedText type="code" style={{ color: theme.success }}>
                  {item.status}
                </ThemedText>
              </View>

              <ThemedText type="small" themeColor="textSecondary">
                {item.description}
              </ThemedText>

              <ThemedText type="code" themeColor="textSecondary">
                AC: {item.ac}
              </ThemedText>

              <ThemedText type="code" themeColor="textMuted">
                {item.evidence}
              </ThemedText>
            </Pressable>
          ))}
        </View>
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
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    alignItems: "center",
  },
  secondaryButton: {
    marginTop: Spacing.three,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  stateBox: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
    alignItems: "center",
  },
  list: {
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  cardTitle: {
    flex: 1,
  },
});
