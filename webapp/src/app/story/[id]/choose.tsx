// ── T-D11: Step 4 CHOOSE screen (choice cards + reasoning) ──
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, MessageSquareText } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepProgress } from "@/components/story/StepProgress";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import type { StoryChoice } from "@/types/story";

export default function ChooseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { activeSession, submitDecision, setStep } = useStoryStore();
  const currentSessionId = activeSession?.id;
  const { data: story, isLoading } = useGetStoryDetailQuery(storyId || "");

  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  // Selection animations: initialize using useMemo to avoid mutating hook/ref values during render
  const scaleAnims = useMemo(() => {
    const anims: Record<string, Animated.Value> = {};
    if (story?.choices) {
      story.choices.forEach((c) => {
        anims[c.id] = new Animated.Value(1);
      });
    }
    return anims;
  }, [story]);

  const fallbackAnim = useMemo(() => new Animated.Value(1), []);

  const getScaleAnim = useCallback(
    (choiceId: string) => {
      return scaleAnims[choiceId] || fallbackAnim;
    },
    [scaleAnims, fallbackAnim],
  );

  function handleSelect(choice: StoryChoice) {
    // Deselect previous
    if (selectedChoice) {
      const prevAnim = scaleAnims[selectedChoice.id];
      if (prevAnim) {
        Animated.spring(prevAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }
    }

    setSelectedChoice(choice);
    setShowReasoning(true);

    // Bounce selected
    const currAnim = scaleAnims[choice.id];
    if (currAnim) {
      Animated.sequence([
        Animated.spring(currAnim, {
          toValue: 0.96,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(currAnim, {
          toValue: 1.02,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!selectedChoice || !currentSessionId) return;

    setIsSubmitting(true);
    try {
      await submitDecision(selectedChoice.id, reasoning.trim() || undefined);
      setStep("result");
      router.push(`/story/${storyId}/consequence` as never);
    } catch (error) {
      console.error("Failed to submit decision:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedChoice, currentSessionId, reasoning, storyId, submitDecision, setStep, router]);

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

  const choices = story.choices ?? [];

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StepProgress currentStep="choose" completedSteps={["intro", "learn", "dilemma"]} />

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
            <CheckCircle2 color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              BƯỚC 4: LỰA CHỌN
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1}>
            Bạn sẽ chọn con đường nào?
          </ThemedText>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Choice Cards */}
          {choices.map((choice, index) => {
            const isSelected = selectedChoice?.id === choice.id;
            const choiceLabel = String.fromCharCode(65 + index); // A, B, C...

            return (
              <Animated.View
                key={choice.id}
                style={{ transform: [{ scale: getScaleAnim(choice.id) }] }}
              >
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleSelect(choice)}
                  style={[
                    styles.choiceCard,
                    {
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected
                        ? "rgba(217, 119, 6, 0.08)"
                        : theme.surfaceElevated,
                    },
                  ]}
                >
                  {/* Choice letter */}
                  <View
                    style={[
                      styles.choiceLetter,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
                      },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: isSelected ? "#FFFFFF" : theme.textMuted,
                        fontWeight: "800",
                      }}
                    >
                      {choiceLabel}
                    </ThemedText>
                  </View>

                  <View style={styles.choiceContent}>
                    {/* Choice label */}
                    <ThemedText style={styles.choiceTitle}>{choice.choiceText}</ThemedText>

                    {/* Choice reasoning prompt/description */}
                    {choice.reasoningPrompt && (
                      <ThemedText type="small" themeColor="textSecondary" style={styles.choiceDesc}>
                        {choice.reasoningPrompt}
                      </ThemedText>
                    )}
                  </View>

                  {/* Selection indicator */}
                  {isSelected && (
                    <CheckCircle2 color={theme.primary} size={22} style={styles.checkIcon} />
                  )}
                </Pressable>
              </Animated.View>
            );
          })}

          {/* Reasoning input (shown after selection) */}
          {showReasoning && selectedChoice && (
            <View style={[styles.reasoningBox, { borderColor: theme.border }]}>
              <View style={styles.reasoningHeader}>
                <MessageSquareText color={theme.primaryLight} size={16} />
                <ThemedText
                  type="smallBold"
                  style={{ color: theme.primaryLight, marginLeft: Spacing.one }}
                >
                  Lý do của bạn (tuỳ chọn)
                </ThemedText>
              </View>
              <TextInput
                placeholder="Tại sao bạn đưa ra lựa chọn này?"
                placeholderTextColor={theme.textMuted}
                value={reasoning}
                onChangeText={setReasoning}
                multiline
                maxLength={500}
                style={[
                  styles.reasoningInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
              />
              <ThemedText type="label" themeColor="textMuted" style={{ alignSelf: "flex-end" }}>
                {reasoning.length}/500
              </ThemedText>
            </View>
          )}
        </ScrollView>

        {/* Submit Footer */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Button
            title={isSubmitting ? "Đang gửi..." : "Xác nhận lựa chọn"}
            onPress={handleSubmit}
            disabled={!selectedChoice || isSubmitting}
            style={{
              flex: 1,
              backgroundColor: selectedChoice ? theme.primary : theme.backgroundElement,
              opacity: selectedChoice ? 1 : 0.5,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    gap: Spacing.three,
  },
  choiceCard: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    flexDirection: "row",
    gap: Spacing.three,
  },
  choiceLetter: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  choiceContent: { flex: 1, gap: Spacing.two },
  choiceTitle: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  choiceDesc: {
    lineHeight: 20,
  },
  checkIcon: {
    alignSelf: "flex-start",
  },
  reasoningBox: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  reasoningHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  reasoningInput: {
    minHeight: 80,
    maxHeight: 150,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.md,
    fontSize: 14,
    lineHeight: 22,
    textAlignVertical: "top",
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});
