import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Radius, Spacing } from "@/constants/theme";
import { defaultMapData, mapCatalog } from "@/features/story/mapData";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";

export default function StoryDilemmaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { data: story, isLoading } = useGetStoryDetailQuery(storyId || "");
  const { setStep } = useStoryStore();

  // Set step to dilemma on mount
  useEffect(() => {
    setStep("dilemma");
  }, [setStep]);

  const stakes = useMemo(() => {
    if (!story) return "";
    return mapCatalog[story.title]?.stakes ?? defaultMapData(story.title).stakes;
  }, [story]);

  const handleNext = () => {
    setStep("choose");
    router.push(`/story/${storyId}/choose` as never);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
          Đang tải tình huống nan giải...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (!story) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <Card style={styles.errorCard}>
          <AlertTriangle color={theme.danger} size={48} />
          <ThemedText type="subtitle" style={{ marginTop: Spacing.two, fontWeight: "800" }}>
            Không tìm thấy kịch bản
          </ThemedText>
          <Button
            title="Quay về Bản đồ"
            onPress={() => router.replace(`/story/${storyId}/map` as never)}
            style={{ marginTop: Spacing.four }}
          />
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(`/story/${storyId}/map` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Tình huống nan giải</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 8/13 • {story.title}
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Dilemma Card */}
        <Card
          style={[
            styles.dilemmaCard,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
        >
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
              <ShieldAlert size={14} color={theme.danger} />
              <ThemedText
                type="label"
                style={{ color: theme.danger, fontWeight: "800", marginLeft: 4 }}
              >
                ĐIỂM QUYẾT ĐỊNH ĐẠO ĐỨC
              </ThemedText>
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Bối Cảnh & Tình Huống
          </ThemedText>

          <ThemedText type="default" style={styles.descriptionText}>
            {story.description}
          </ThemedText>
        </Card>

        {/* Stakes Info Box */}
        <Card
          style={[
            styles.stakesCard,
            { borderColor: theme.primary, backgroundColor: "rgba(217, 119, 6, 0.05)" },
          ]}
        >
          <View style={styles.stakesHeader}>
            <Sparkles size={16} color={theme.primary} />
            <ThemedText type="label" style={{ color: theme.primaryLight, fontWeight: "800" }}>
              STAKES: NHỮNG GÌ BỊ ẢNH HƯỞNG
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.stakesText}>
            {stakes ||
              "Quyết định của bạn sẽ định hình tương lai, lương tâm đạo đức và các mối quan hệ xã hội của nhân vật."}
          </ThemedText>
        </Card>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title="Tiến đến Lựa Chọn →"
          onPress={handleNext}
          fullWidth
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  dilemmaCard: {
    padding: Spacing.five,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: Spacing.three,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  sectionTitle: {
    fontWeight: "900",
    marginBottom: Spacing.three,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 28,
  },
  stakesCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  stakesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  stakesText: {
    lineHeight: 22,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
  actionButton: {
    height: 48,
  },
  errorCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.five,
    borderWidth: 1,
    borderRadius: Radius.lg,
    width: "100%",
    maxWidth: 400,
  },
});
