import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Award, BookOpen } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";

export default function StoryLearnScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { data: story, isLoading } = useGetStoryDetailQuery(storyId || "");
  const { setStep } = useStoryStore();

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Set step to learn on mount
  useEffect(() => {
    setStep("learn");
  }, [setStep]);

  const learnCards = useMemo(() => {
    return story?.learnCards ?? [];
  }, [story]);

  const currentCard = learnCards[activeCardIndex];

  const handleNext = () => {
    setStep("dilemma");
    router.push(`/story/${storyId}/dilemma` as never);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
          Đang tải thẻ học tập...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (!story || learnCards.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <Card style={styles.errorCard}>
          <BookOpen color={theme.textMuted} size={48} />
          <ThemedText type="subtitle" style={{ marginTop: Spacing.two, fontWeight: "800" }}>
            Không tìm thấy bài học
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", marginVertical: Spacing.three }}
          >
            Không có dữ liệu bài học triết học cho kịch bản này.
          </ThemedText>
          <Button title="Tiến đến Tình huống" onPress={handleNext} fullWidth />
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
          <ThemedText type="smallBold">Học khái niệm</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 7/13 • {story.title}
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation Indicator / Tabs for cards */}
        <View style={styles.tabBar}>
          {learnCards.map((card, idx) => (
            <Pressable
              key={card.id || idx}
              accessibilityRole="tab"
              accessibilityState={{ selected: idx === activeCardIndex }}
              onPress={() => setActiveCardIndex(idx)}
              style={[
                styles.tabIndicator,
                {
                  backgroundColor: idx === activeCardIndex ? theme.primary : theme.border,
                },
              ]}
            />
          ))}
        </View>

        {/* The Card View */}
        <View style={styles.cardContainer}>
          <Card
            style={[
              styles.learnCard,
              { borderColor: theme.border, backgroundColor: theme.surface },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: "rgba(217, 119, 6, 0.15)" }]}>
                <BookOpen color={theme.primary} size={24} />
              </View>
              <ThemedText type="label" themeColor="textSecondary" style={{ fontWeight: "700" }}>
                KHÁI NIỆM {activeCardIndex + 1} / {learnCards.length}
              </ThemedText>
            </View>

            <ThemedText type="title" style={[styles.cardTitle, { color: theme.primaryLight }]}>
              {currentCard.title}
            </ThemedText>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <ThemedText type="default" style={styles.cardBody}>
              {currentCard.body}
            </ThemedText>

            {currentCard.sourceRef && (
              <View style={[styles.sourceBox, { backgroundColor: theme.backgroundElement }]}>
                <Award size={14} color={theme.primary} />
                <ThemedText
                  type="label"
                  themeColor="textSecondary"
                  style={{ fontStyle: "italic", flex: 1 }}
                >
                  Nguồn: {currentCard.sourceRef}
                </ThemedText>
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      {/* Footer / Stepper controls */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View style={styles.footerButtons}>
          {activeCardIndex < learnCards.length - 1 ? (
            <Button
              title="Khái niệm tiếp theo →"
              onPress={() => setActiveCardIndex((prev) => prev + 1)}
              fullWidth
            />
          ) : (
            <Button title="Tiến đến Tình huống →" onPress={handleNext} fullWidth />
          )}
        </View>
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
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.two,
  },
  tabIndicator: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  cardContainer: {
    minHeight: 350,
  },
  learnCard: {
    padding: Spacing.five,
    borderRadius: Radius.lg,
    borderWidth: 1,
    minHeight: 320,
    justifyContent: "flex-start",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: Spacing.three,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: Spacing.three,
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 28,
    marginBottom: Spacing.four,
  },
  sourceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    marginTop: "auto",
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
  footerButtons: {
    flexDirection: "row",
    gap: Spacing.two,
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
