// ── T-D12: Step 5 CONSEQUENCE screen (narrative + 4 analysis tabs) ──
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
  Sparkles,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepProgress } from "@/components/story/StepProgress";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import type { StoryChoice } from "@/types/story";

type TabKey = "consequence" | "philosophy" | "perspective" | "insight";

const TABS: { key: TabKey; label: string; icon: typeof Eye }[] = [
  { key: "consequence", label: "Hệ quả", icon: Eye },
  { key: "philosophy", label: "Triết học", icon: BookOpen },
  { key: "perspective", label: "Góc nhìn", icon: Layers },
  { key: "insight", label: "Bài học", icon: Brain },
];

export default function ConsequenceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { lastDecisionChoiceId, setStep } = useStoryStore();
  const { data: story, isLoading } = useGetStoryDetailQuery(storyId || "");

  const [activeTab, setActiveTab] = useState<TabKey>("consequence");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Entrance animations via useMemo
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(40), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Find the chosen option
  const chosenOption = useMemo(() => {
    if (!story?.choices || !lastDecisionChoiceId) return null;
    return story.choices.find((c: StoryChoice) => c.id === lastDecisionChoiceId) ?? null;
  }, [story, lastDecisionChoiceId]);

  // Get primary consequence
  const primaryConsequence = useMemo(() => {
    return chosenOption?.consequences?.[0] ?? null;
  }, [chosenOption]);

  // Get analysis tabs data for the primary consequence
  const analysisTabs = useMemo(() => {
    if (!primaryConsequence?.analysisTabs) return [];
    return [...primaryConsequence.analysisTabs].sort((a, b) => a.order - b.order);
  }, [primaryConsequence]);

  // Map analysis tabs to our tab keys
  const tabContent = useMemo(() => {
    const content: Record<TabKey, string | null> = {
      consequence: primaryConsequence?.resultText ?? null,
      philosophy: null,
      perspective: null,
      insight: null,
    };
    analysisTabs.forEach((tab) => {
      if (tab.tabType === "PHILOSOPHICAL") {
        content.philosophy = tab.content;
      } else if (tab.tabType === "ETHICAL") {
        content.perspective = tab.content;
      } else if (tab.tabType === "POLITICAL_ECONOMIC" || tab.tabType === "HISTORICAL") {
        content.insight = tab.content;
      }
    });
    return content;
  }, [primaryConsequence, analysisTabs]);

  function toggleSection(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleContinue() {
    setStep("knowledge");
    router.push(`/story/${storyId}/knowledge` as never);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!story) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center, { backgroundColor: theme.background }]}>
        <ThemedText type="smallBold">Không tìm thấy dữ liệu.</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StepProgress currentStep="result" completedSteps={["intro", "learn", "dilemma", "choose"]} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <View style={styles.headerLabelRow}>
            <Sparkles color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              BƯỚC 5: HỆ QUẢ
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1}>
            {story.title}
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            gap: Spacing.three,
          }}
        >
          {/* Your Choice Summary */}
          {chosenOption && (
            <View
              style={[
                styles.choiceSummary,
                { backgroundColor: "rgba(217, 119, 6, 0.08)", borderColor: theme.primary },
              ]}
            >
              <ThemedText type="label" style={{ color: theme.primary }}>
                LỰA CHỌN CỦA BẠN
              </ThemedText>
              <ThemedText style={styles.choiceLabel}>{chosenOption.choiceText}</ThemedText>
              {chosenOption.reasoningPrompt && (
                <ThemedText type="small" themeColor="textSecondary">
                  {chosenOption.reasoningPrompt}
                </ThemedText>
              )}
            </View>
          )}

          {/* Tab Navigation */}
          <View style={styles.tabRow}>
            {TABS.map(({ key, label, icon: Icon }) => {
              const isActive = key === activeTab;
              const hasContent = !!tabContent[key];

              return (
                <Pressable
                  key={key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => hasContent && setActiveTab(key)}
                  style={[
                    styles.tabBtn,
                    {
                      borderColor: isActive ? theme.primary : theme.border,
                      backgroundColor: isActive ? "rgba(217, 119, 6, 0.12)" : theme.surfaceElevated,
                      opacity: hasContent ? 1 : 0.4,
                    },
                  ]}
                >
                  <Icon color={isActive ? theme.primary : theme.textMuted} size={14} />
                  <ThemedText
                    type="label"
                    style={{
                      color: isActive ? theme.primary : theme.textMuted,
                      fontSize: 10,
                      fontWeight: isActive ? "800" : "600",
                    }}
                  >
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Tab Content */}
          <View
            style={[
              styles.contentCard,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            {tabContent[activeTab] ? (
              <ThemedText type="default" style={styles.contentText}>
                {tabContent[activeTab]}
              </ThemedText>
            ) : (
              <View style={styles.center}>
                <ThemedText type="small" themeColor="textMuted">
                  Nội dung chưa có sẵn cho tab này.
                </ThemedText>
              </View>
            )}
          </View>

          {/* Other Choices (collapsed by default) */}
          {story.choices && story.choices.length > 1 && (
            <View style={[styles.othersSection, { borderColor: theme.border }]}>
              <Pressable
                accessibilityRole="button"
                onPress={() => toggleSection("otherChoices")}
                style={styles.othersHeader}
              >
                <Layers color={theme.textSecondary} size={16} />
                <ThemedText
                  type="smallBold"
                  themeColor="textSecondary"
                  style={{ flex: 1, marginLeft: Spacing.two }}
                >
                  Xem các lựa chọn khác
                </ThemedText>
                {expandedSections.otherChoices ? (
                  <ChevronUp color={theme.textMuted} size={18} />
                ) : (
                  <ChevronDown color={theme.textMuted} size={18} />
                )}
              </Pressable>

              {expandedSections.otherChoices &&
                story.choices
                  .filter((c: StoryChoice) => c.id !== lastDecisionChoiceId)
                  .map((choice: StoryChoice) => {
                    const cons = choice.consequences?.[0];
                    return (
                      <View
                        key={choice.id}
                        style={[styles.otherChoice, { borderTopColor: theme.border }]}
                      >
                        <ThemedText type="smallBold">{choice.choiceText}</ThemedText>
                        {cons?.resultText && (
                          <ThemedText type="small" themeColor="textSecondary">
                            {cons.resultText}
                          </ThemedText>
                        )}
                      </View>
                    );
                  })}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title="Tiếp tục: Tri thức"
          onPress={handleContinue}
          style={{ flex: 1, backgroundColor: theme.primary }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center", padding: Spacing.four },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: { flex: 1 },
  headerLabelRow: { flexDirection: "row", alignItems: "center" },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  choiceSummary: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  choiceLabel: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 26,
  },
  tabRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.md,
    gap: 4,
  },
  contentCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    minHeight: 160,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 26,
  },
  othersSection: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  othersHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
  },
  otherChoice: {
    borderTopWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});
