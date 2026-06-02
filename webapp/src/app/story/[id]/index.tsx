import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Info,
  Lightbulb,
  Sparkles,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useStoryStore, type StoryStep } from "@/stores/story.store";

export default function StoryGameplayScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const {
    currentStory,
    activeSession,
    currentStep,
    loadingSession,
    submittingDecision,
    error,
    startOrResumeSession,
    submitDecision,
    setStep,
    resetStore,
  } = useStoryStore();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  useEffect(() => {
    if (storyId) {
      startOrResumeSession(storyId);
    }
    return () => {
      resetStore();
    };
  }, [storyId, startOrResumeSession, resetStore]);

  // Derived states
  const learnCards = currentStory?.learnCards ?? [];
  const choices = currentStory?.choices ?? [];

  const latestDecision = activeSession?.decisions?.[0];
  const userSelectedChoice = choices.find(
    (c) => c.id === (latestDecision?.choiceId ?? selectedChoiceId),
  );
  const consequence = userSelectedChoice?.consequences?.[0];
  const analysisTabs = consequence?.analysisTabs ?? [];

  // Determine available tabs
  const tabOptions = [
    {
      type: "PHILOSOPHICAL",
      label: "Triết học",
      icon: Lightbulb,
      content: consequence?.philosophicalAnalysis,
    },
    { type: "ETHICAL", label: "Đạo đức", icon: Info, content: consequence?.ethicalAnalysis },
    {
      type: "POLITICAL_ECONOMIC",
      label: "Chính trị - Xã hội",
      icon: FileText,
      content: consequence?.politicalEconomicAnalysis,
    },
    {
      type: "HISTORICAL",
      label: "Lịch sử",
      icon: HelpCircle,
      content: consequence?.historicalImpact,
    },
  ].filter((t) => t.content || analysisTabs.some((at) => at.tabType === t.type));

  const activeTabType = selectedTab || tabOptions[0]?.type || "PHILOSOPHICAL";

  // Step Progress helper

  // Step Progress helper
  const stepsList: { value: StoryStep; label: string }[] = [
    { value: "intro", label: "Bối cảnh" },
    { value: "learn", label: "Khái niệm" },
    { value: "dilemma", label: "Tình huống" },
    { value: "choose", label: "Lựa chọn" },
    { value: "result", label: "Hệ quả" },
    { value: "knowledge", label: "Phân tích" },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.value === currentStep);

  async function handleConfirmChoice() {
    if (!selectedChoiceId) return;
    try {
      await submitDecision(selectedChoiceId, reasoning.trim());
    } catch {
      // Error handled in store
    }
  }

  function handleNextStep() {
    if (currentStep === "intro") {
      setStep("learn");
      setActiveCardIndex(0);
    } else if (currentStep === "learn") {
      if (activeCardIndex < learnCards.length - 1) {
        setActiveCardIndex(activeCardIndex + 1);
      } else {
        setStep("dilemma");
      }
    } else if (currentStep === "dilemma") {
      setStep("choose");
    } else if (currentStep === "choose") {
      // Advances after API submit decision succeeds
    } else if (currentStep === "result") {
      setStep("knowledge");
    } else if (currentStep === "knowledge") {
      router.push(`/story/${storyId}/reflect` as never);
    }
  }

  function handlePrevStep() {
    if (currentStep === "learn") {
      if (activeCardIndex > 0) {
        setActiveCardIndex(activeCardIndex - 1);
      } else {
        setStep("intro");
      }
    } else if (currentStep === "dilemma") {
      setStep("learn");
      setActiveCardIndex(learnCards.length - 1);
    } else if (currentStep === "choose") {
      setStep("dilemma");
    } else if (currentStep === "result") {
      // Consequence locked once decision is made. No going back to choose.
    } else if (currentStep === "knowledge") {
      setStep("result");
    }
  }

  if (loadingSession) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
          Khởi tạo kịch bản học tập...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (error && !currentStory) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Card style={styles.stateCard}>
          <AlertCircle color={theme.danger} size={32} />
          <ThemedText type="smallBold">Không thể khởi chạy kịch bản</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            {error}
          </ThemedText>
          <Button
            title="Thử lại"
            onPress={() => storyId && startOrResumeSession(storyId)}
            variant="outline"
          />
        </Card>
      </SafeAreaView>
    );
  }

  if (!currentStory) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ThemedText type="small" themeColor="textSecondary">
          Kịch bản không tồn tại.
        </ThemedText>
        <Button title="Quay lại" onPress={() => router.back()} style={{ marginTop: Spacing.two }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/story" as never)}
            style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          >
            <ArrowLeft color={theme.text} size={20} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {currentStory.title}
            </ThemedText>
            <ThemedText type="label" themeColor="textSecondary">
              Bước {currentStepIndex + 1}/{stepsList.length}: {stepsList[currentStepIndex]?.label}
            </ThemedText>
          </View>
        </View>

        {/* Step Progress Line */}
        <View style={styles.progressContainer}>
          {stepsList.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <View
                key={step.value}
                style={[
                  styles.progressBarSegment,
                  {
                    backgroundColor: isCompleted
                      ? theme.success
                      : isActive
                        ? theme.primary
                        : theme.border,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Main Content Area */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: INTRO */}
          {currentStep === "intro" && (
            <View style={styles.stepContainer}>
              <View style={[styles.stepIconBox, { backgroundColor: theme.backgroundElement }]}>
                <Sparkles color={theme.primaryLight} size={32} />
              </View>
              <ThemedText style={styles.stepTitle}>Bối Cảnh Lịch Sử</ThemedText>

              {currentStory.historicalContext && (
                <Card style={[styles.highlightBox, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="smallBold" style={{ color: theme.primaryLight }}>
                    Sơ lược lịch sử
                  </ThemedText>
                  <ThemedText
                    type="small"
                    themeColor="textSecondary"
                    style={{ marginTop: Spacing.one }}
                  >
                    {currentStory.historicalContext}
                  </ThemedText>
                </Card>
              )}

              <ThemedText type="small" themeColor="textSecondary" style={styles.introDesc}>
                {currentStory.description}
              </ThemedText>

              {currentStory.characterRole && (
                <Card style={[styles.roleCard, { borderColor: theme.border }]}>
                  <View style={styles.row}>
                    <BookOpen
                      color={theme.primary}
                      size={18}
                      style={{ marginRight: Spacing.two }}
                    />
                    <View style={{ flex: 1 }}>
                      <ThemedText type="smallBold">Nhân vật của bạn</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        Bạn sẽ nhập vai vào:{" "}
                        <ThemedText type="smallBold" style={{ color: theme.primary }}>
                          {currentStory.characterRole}
                        </ThemedText>
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              )}
            </View>
          )}

          {/* STEP 2: LEARN */}
          {currentStep === "learn" && (
            <View style={styles.stepContainer}>
              <ThemedText style={styles.stepTitle}>Chuẩn bị kiến thức</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                Tìm hiểu các khái niệm triết học cốt lõi trước khi đưa ra quyết định kịch tính.
              </ThemedText>

              {learnCards.length > 0 ? (
                <Card style={[styles.learnCard, { borderColor: theme.primary }]}>
                  <View style={styles.learnCardHeader}>
                    <ThemedText type="smallBold" style={{ color: theme.primaryLight }}>
                      Thẻ kiến thức {activeCardIndex + 1}/{learnCards.length}
                    </ThemedText>
                    <ThemedText type="label" themeColor="textSecondary">
                      {learnCards[activeCardIndex].sourceRef || "Concept"}
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.learnCardTitle}>
                    {learnCards[activeCardIndex].title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.learnCardBody}>
                    {learnCards[activeCardIndex].body}
                  </ThemedText>

                  {learnCards[activeCardIndex].tags &&
                    learnCards[activeCardIndex].tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {learnCards[activeCardIndex].tags.map((t) => (
                          <View
                            key={t.tagId}
                            style={[styles.tagPill, { backgroundColor: theme.backgroundElement }]}
                          >
                            <ThemedText type="label" style={{ color: theme.primaryLight }}>
                              #{t.tag.name}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    )}
                </Card>
              ) : (
                <View style={styles.mutedState}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Không có thẻ kiến thức nào cho kịch bản này.
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          {/* STEP 3: DILEMMA */}
          {currentStep === "dilemma" && (
            <View style={styles.stepContainer}>
              <View style={[styles.stepIconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
                <AlertCircle color={theme.danger} size={32} />
              </View>
              <ThemedText style={styles.stepTitle}>Tình huống nan giải</ThemedText>

              <View
                style={[
                  styles.dilemmaQuote,
                  { borderLeftColor: theme.danger, backgroundColor: theme.backgroundElement },
                ]}
              >
                <ThemedText type="small" style={{ fontStyle: "italic", lineHeight: 22 }}>
                  {'"'}
                  {currentStory.description}
                  {'"'}
                </ThemedText>
              </View>

              <ThemedText type="small" themeColor="textSecondary" style={styles.introDesc}>
                Thời khắc quyết định đã đến. Bạn đứng trước ngã rẽ lớn. Mỗi lựa chọn đều mang lại hệ
                quả đạo đức sâu sắc và định hình tương lai lịch sử. Hãy chuẩn bị đưa ra lựa chọn của
                mình.
              </ThemedText>
            </View>
          )}

          {/* STEP 4: CHOOSE */}
          {currentStep === "choose" && (
            <View style={styles.stepContainer}>
              <ThemedText style={styles.stepTitle}>Đưa ra lựa chọn</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                Hãy chọn phương án của bạn và viết lại lập luận bảo vệ lập trường đó.
              </ThemedText>

              {error && (
                <Card style={[styles.errorCard, { borderColor: theme.danger }]}>
                  <ThemedText type="small" style={{ color: theme.danger }}>
                    {error}
                  </ThemedText>
                </Card>
              )}

              <View style={styles.choicesList}>
                {choices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  return (
                    <Pressable
                      key={choice.id}
                      onPress={() => setSelectedChoiceId(choice.id)}
                      style={[
                        styles.choiceOptionCard,
                        {
                          borderColor: isSelected ? theme.primary : theme.border,
                          backgroundColor: isSelected
                            ? theme.backgroundSelected
                            : theme.surfaceElevated,
                        },
                      ]}
                    >
                      <View style={styles.choiceHeaderRow}>
                        <View
                          style={[
                            styles.radioCircle,
                            { borderColor: isSelected ? theme.primary : theme.textMuted },
                          ]}
                        >
                          {isSelected && (
                            <View style={[styles.radioFill, { backgroundColor: theme.primary }]} />
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <ThemedText type="smallBold">{choice.choiceText}</ThemedText>
                          {choice.reasoningPrompt && (
                            <ThemedText
                              type="label"
                              themeColor="textSecondary"
                              style={{ marginTop: Spacing.half }}
                            >
                              💭 Gợi ý: {choice.reasoningPrompt}
                            </ThemedText>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {selectedChoiceId && (
                <View style={styles.reasoningContainer}>
                  <ThemedText type="smallBold">Lập luận của bạn (Không bắt buộc)</ThemedText>
                  <TextInput
                    multiline
                    value={reasoning}
                    onChangeText={setReasoning}
                    placeholder="Viết lý do vì sao bạn lựa chọn phương án này..."
                    placeholderTextColor={theme.textMuted}
                    textAlignVertical="top"
                    style={[
                      styles.reasoningInput,
                      {
                        color: theme.text,
                        backgroundColor: theme.surfaceElevated,
                        borderColor: theme.border,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
          )}

          {/* STEP 5: RESULT (CONSEQUENCE) */}
          {currentStep === "result" && (
            <View style={styles.stepContainer}>
              <View style={[styles.stepIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                <CheckCircle2 color={theme.success} size={32} />
              </View>
              <ThemedText style={styles.stepTitle}>Hệ quả kịch bản</ThemedText>

              {latestDecision?.userReason && (
                <Card style={[styles.myReasonBox, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="label" themeColor="textSecondary">
                    Lập luận của bạn
                  </ThemedText>
                  <ThemedText type="small" style={{ fontStyle: "italic", marginTop: Spacing.half }}>
                    {'"'}
                    {latestDecision.userReason}
                    {'"'}
                  </ThemedText>
                </Card>
              )}

              <Card style={[styles.consequenceCard, { borderColor: theme.success }]}>
                <ThemedText type="smallBold" style={{ color: theme.success }}>
                  Hậu quả xảy ra
                </ThemedText>
                <ThemedText type="small" style={{ marginTop: Spacing.two, lineHeight: 22 }}>
                  {consequence?.resultText || "Hệ quả kịch bản đang được cập nhật."}
                </ThemedText>
              </Card>
            </View>
          )}

          {/* STEP 6: KNOWLEDGE (ANALYSIS TABS) */}
          {currentStep === "knowledge" && (
            <View style={styles.stepContainer}>
              <ThemedText style={styles.stepTitle}>Phân tích chuyên sâu</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                Tìm hiểu quyết định này dưới các lăng kính phân tích học thuật khác nhau.
              </ThemedText>

              {tabOptions.length > 0 ? (
                <View style={styles.tabsWrapper}>
                  {/* Tab Selector */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabButtonsContainer}
                  >
                    {tabOptions.map((opt) => {
                      const isActive = activeTabType === opt.type;
                      const Icon = opt.icon;
                      return (
                        <Pressable
                          key={opt.type}
                          onPress={() => setSelectedTab(opt.type)}
                          style={[
                            styles.tabBtn,
                            {
                              backgroundColor: isActive ? theme.primary : theme.backgroundElement,
                              borderColor: isActive ? theme.primary : theme.border,
                            },
                          ]}
                        >
                          <Icon color={isActive ? "#0C0C0E" : theme.text} size={14} />
                          <ThemedText
                            type="label"
                            style={{
                              color: isActive ? "#0C0C0E" : theme.text,
                              fontWeight: "700",
                            }}
                          >
                            {opt.label}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  {/* Tab Content Display */}
                  <Card style={[styles.tabContentCard, { borderColor: theme.border }]}>
                    <ThemedText type="small" style={{ lineHeight: 22 }}>
                      {tabOptions.find((t) => t.type === activeTabType)?.content ||
                        analysisTabs.find((at) => at.tabType === activeTabType)?.content ||
                        "Nội dung đang được cập nhật."}
                    </ThemedText>
                  </Card>
                </View>
              ) : (
                <View style={styles.mutedState}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Chưa có bài phân tích chuyên sâu cho lựa chọn này.
                  </ThemedText>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer Navigation Buttons */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          {currentStep !== "intro" && currentStep !== "result" ? (
            <Button
              title="Quay lại"
              variant="outline"
              onPress={handlePrevStep}
              style={styles.footerBtn}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {currentStep === "choose" ? (
            <Button
              title="Xác nhận lựa chọn"
              disabled={!selectedChoiceId || submittingDecision}
              loading={submittingDecision}
              onPress={handleConfirmChoice}
              style={[styles.footerBtn, { backgroundColor: theme.primary }]}
            />
          ) : (
            <Button
              title={currentStep === "knowledge" ? "Viết phản tư" : "Tiếp tục"}
              onPress={handleNextStep}
              style={[
                styles.footerBtn,
                currentStep === "knowledge" ? { backgroundColor: theme.primary } : {},
              ]}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stateCard: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    marginHorizontal: Spacing.four,
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
  progressContainer: {
    height: 4,
    flexDirection: "row",
    gap: Spacing.half,
  },
  progressBarSegment: {
    flex: 1,
    height: "100%",
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 40,
  },
  stepContainer: {
    alignItems: "center",
    gap: Spacing.three,
  },
  stepIconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  centerText: {
    textAlign: "center",
  },
  introDesc: {
    lineHeight: 22,
    marginTop: Spacing.one,
  },
  highlightBox: {
    padding: Spacing.three,
    width: "100%",
  },
  roleCard: {
    borderWidth: 1,
    width: "100%",
    padding: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  learnCard: {
    borderWidth: 1,
    width: "100%",
    padding: Spacing.four,
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  learnCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  learnCardTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  learnCardBody: {
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tagPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  dilemmaQuote: {
    borderLeftWidth: 4,
    padding: Spacing.three,
    width: "100%",
    marginTop: Spacing.two,
  },
  choicesList: {
    width: "100%",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  choiceOptionCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
  },
  choiceHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  reasoningContainer: {
    width: "100%",
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  reasoningInput: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    fontSize: 14,
    lineHeight: 20,
  },
  errorCard: {
    borderWidth: 1,
    padding: Spacing.three,
    width: "100%",
  },
  myReasonBox: {
    width: "100%",
    padding: Spacing.three,
  },
  consequenceCard: {
    borderWidth: 1,
    width: "100%",
    padding: Spacing.four,
    marginTop: Spacing.one,
  },
  tabsWrapper: {
    width: "100%",
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  tabButtonsContainer: {
    gap: Spacing.two,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    gap: Spacing.one,
  },
  tabContentCard: {
    borderWidth: 1,
    padding: Spacing.four,
    minHeight: 180,
  },
  mutedState: {
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerBtn: {
    flex: 1,
  },
});
