import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Clock,
  History,
  Sparkles,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import type { StoryDifficulty } from "@/types/story";

export default function StoryDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { activeSession, startOrResumeSession } = useStoryStore();
  const {
    data: story,
    isLoading: isLoadingDetail,
    error: apiError,
    refetch,
  } = useGetStoryDetailQuery(storyId || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isResuming = activeSession?.storyId === storyId;

  async function handleStartJourney() {
    if (!storyId) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await startOrResumeSession(storyId);
      router.push(`/story/${storyId}/role-selection` as never);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Không thể khởi tạo hành trình kịch bản.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getDifficultyColor(diff: StoryDifficulty) {
    switch (diff) {
      case "EASY":
        return theme.success ?? "#10B981";
      case "MEDIUM":
        return theme.primary ?? "#D97706";
      case "HARD":
        return theme.danger ?? "#EF4444";
      default:
        return theme.textMuted ?? "#71717A";
    }
  }

  function getDifficultyText(diff: StoryDifficulty) {
    switch (diff) {
      case "EASY":
        return "Dễ";
      case "MEDIUM":
        return "Trung bình";
      case "HARD":
        return "Khó";
      default:
        return diff;
    }
  }

  if (isLoadingDetail) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
          Đang tải thông tin kịch bản...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (apiError || !story) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Card style={styles.stateCard}>
          <AlertCircle color={theme.danger} size={32} />
          <ThemedText type="smallBold">Không thể tải thông tin kịch bản</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            {apiError
              ? "Lỗi kết nối máy chủ hoặc kịch bản không tồn tại."
              : "Không tìm thấy dữ liệu kịch bản."}
          </ThemedText>
          <View style={styles.errorBtnRow}>
            <Button title="Thử lại" onPress={() => refetch()} variant="primary" />
            <Button
              title="Quay lại"
              onPress={() => router.replace("/(tabs)/story" as never)}
              variant="outline"
            />
          </View>
        </Card>
      </SafeAreaView>
    );
  }

  const diffColor = getDifficultyColor(story.difficulty);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/(tabs)/story" as never)}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold" numberOfLines={1}>
            Chi tiết kịch bản
          </ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            {story.topic.title}
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover Image / Fallback Hero Banner */}
        <View style={styles.heroContainer}>
          {story.coverImageUrl ? (
            <Image source={{ uri: story.coverImageUrl }} style={styles.coverImage} />
          ) : (
            <View style={[styles.imageFallback, { backgroundColor: theme.backgroundElement }]}>
              <Sparkles color={theme.primaryLight} size={48} />
            </View>
          )}

          {/* Badges Overlay */}
          <View style={styles.badgeOverlay}>
            <View
              style={[
                styles.badge,
                { backgroundColor: "rgba(12,12,14,0.75)", borderColor: diffColor },
              ]}
            >
              <View style={[styles.diffDot, { backgroundColor: diffColor }]} />
              <ThemedText type="label" style={{ color: diffColor }}>
                Độ khó: {getDifficultyText(story.difficulty)}
              </ThemedText>
            </View>

            {story.estimatedMinutes && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: "rgba(12,12,14,0.75)", borderColor: theme.border },
                ]}
              >
                <Clock color={theme.primaryLight} size={12} />
                <ThemedText type="label" style={{ color: theme.text, marginLeft: Spacing.one }}>
                  {story.estimatedMinutes} phút
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Story Title & Topic */}
        <View style={styles.section}>
          <View style={styles.topicRow}>
            <BookOpen color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              {story.topic.category}
            </ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.title}>
            {story.title}
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            {story.description}
          </ThemedText>
        </View>

        {/* Character Role Brief */}
        {story.characterRole && (
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              Nhân vật nhập vai
            </ThemedText>
            <Card style={styles.detailCard}>
              <View style={styles.cardHeaderRow}>
                <User color={theme.primary} size={18} />
                <ThemedText type="smallBold" style={{ marginLeft: Spacing.two }}>
                  Thông tin nhân vật
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardBodyText}>
                {story.characterRole}
              </ThemedText>
            </Card>
          </View>
        )}

        {/* Historical Context Brief */}
        {story.historicalContext && (
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              Bối cảnh lịch sử
            </ThemedText>
            <Card style={styles.detailCard}>
              <View style={styles.cardHeaderRow}>
                <History color={theme.primary} size={18} />
                <ThemedText type="smallBold" style={{ marginLeft: Spacing.two }}>
                  Bối cảnh & Thời đại
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardBodyText}>
                {story.historicalContext}
              </ThemedText>
            </Card>
          </View>
        )}

        {errorMsg && (
          <Card style={[styles.errorCard, { borderColor: theme.danger }]}>
            <AlertCircle color={theme.danger} size={16} />
            <ThemedText
              type="small"
              style={{ color: theme.danger, marginLeft: Spacing.two, flex: 1 }}
            >
              {errorMsg}
            </ThemedText>
          </Card>
        )}
      </ScrollView>

      {/* Footer / CTA Actions */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title={isResuming ? "Tiếp tục hành trình" : "Bắt đầu hành trình"}
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleStartJourney}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  stateCard: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    width: "100%",
    maxWidth: 400,
  },
  centerText: {
    textAlign: "center",
  },
  errorBtnRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#353437",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconButton: {
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
    paddingBottom: 40,
  },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeOverlay: {
    position: "absolute",
    bottom: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: "row",
    gap: Spacing.two,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    gap: Spacing.one,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  section: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "800",
    lineHeight: 34,
  },
  description: {
    lineHeight: 24,
    color: "#D1D5DB",
    marginTop: Spacing.one,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: Spacing.one,
  },
  detailCard: {
    padding: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.one,
  },
  cardBodyText: {
    lineHeight: 22,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    borderWidth: 1,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
    alignItems: "center",
  },
});
