import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RefreshCcw,
  Send,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useGetScenarioDetailQuery,
  useRethinkScenarioMutation,
  type ScenarioFrameworkDTO,
} from "@/services/rtk-api/scenario.api";

/** ─── T-F04: Scenario FRAMEWORK + RETHINK Screen ──────────────
 *  Route: /scenarios/rethink?scenarioId=xxx
 *  Flow: Stepper timeline through frameworks → Rethink form → Confirmation
 */
export default function ScenarioRethinkScreen() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  const router = useRouter();
  const theme = useTheme();

  const {
    data: scenario,
    isLoading,
    isError,
    refetch,
  } = useGetScenarioDetailQuery(scenarioId!, {
    skip: !scenarioId,
  });
  const [rethinkScenario, { isLoading: isSubmitting }] = useRethinkScenarioMutation();

  // ─── Local state ───────────────────────────────────────────────
  const [phase, setPhase] = useState<"frameworks" | "rethink" | "done">("frameworks");
  const [activeFrameworkIdx, setActiveFrameworkIdx] = useState(0);
  const [revisedPosition, setRevisedPosition] = useState("");
  const [reflection, setReflection] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const frameworks = scenario?.frameworks ?? [];
  const totalFrameworks = frameworks.length;
  const currentFramework: ScenarioFrameworkDTO | undefined = frameworks[activeFrameworkIdx];
  const hasResponded = !!scenario?.userResponse;

  // Pre-fill from existing rethink if any
  const hasExistingRethink = !!scenario?.userResponse?.revisedPosition;

  const frameworkColors = useMemo(
    () => [
      { accent: theme.primary, bg: "rgba(217, 119, 6, 0.08)", border: "rgba(217, 119, 6, 0.2)" },
      { accent: theme.info, bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.2)" },
      { accent: theme.success, bg: "rgba(34, 197, 94, 0.08)", border: "rgba(34, 197, 94, 0.2)" },
      { accent: theme.danger, bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.2)" },
    ],
    [theme],
  );

  // ─── Handlers ──────────────────────────────────────────────────
  const goNextFramework = useCallback(() => {
    if (activeFrameworkIdx < totalFrameworks - 1) {
      setActiveFrameworkIdx((i) => i + 1);
    } else {
      // Last framework → transition to rethink phase
      if (hasResponded) {
        setPhase("rethink");
      }
    }
  }, [activeFrameworkIdx, totalFrameworks, hasResponded]);

  const goPrevFramework = useCallback(() => {
    if (activeFrameworkIdx > 0) {
      setActiveFrameworkIdx((i) => i - 1);
    }
  }, [activeFrameworkIdx]);

  const handleSubmitRethink = useCallback(async () => {
    if (!scenarioId || !revisedPosition.trim()) return;
    setSubmitError(null);

    try {
      await rethinkScenario({
        scenarioId,
        body: {
          revisedPosition: revisedPosition.trim(),
          reflection: reflection.trim() || undefined,
        },
      }).unwrap();
      setPhase("done");
    } catch {
      setSubmitError("Không thể cập nhật lập trường. Vui lòng thử lại.");
    }
  }, [scenarioId, revisedPosition, reflection, rethinkScenario]);

  // ─── Loading / Error ──────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError || !scenario) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ThemedText style={{ color: theme.danger, marginBottom: Spacing.three }}>
          Không thể tải dữ liệu phân tích.
        </ThemedText>
        <Pressable style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={refetch}>
          <Text style={styles.retryBtnText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={22} color={theme.icon} />
          </Pressable>
          <View style={styles.headerCenter}>
            <ThemedText style={styles.headerLabel} type="label" themeColor="textSecondary">
              {phase === "done"
                ? "HOÀN THÀNH"
                : phase === "rethink"
                  ? "SUY NGHĨ LẠI"
                  : "KHUNG PHÂN TÍCH"}
            </ThemedText>
            <ThemedText style={styles.headerTitle} numberOfLines={1}>
              {scenario.title}
            </ThemedText>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentInner}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══════ PHASE: FRAMEWORKS (Stepper Timeline) ══════ */}
          {phase === "frameworks" && (
            <View>
              {/* Stepper timeline */}
              <View style={styles.stepperContainer}>
                {frameworks.map((fw, i) => {
                  const colorSet = frameworkColors[i % frameworkColors.length];
                  const isActive = i === activeFrameworkIdx;
                  const isCompleted = i < activeFrameworkIdx;

                  return (
                    <Pressable
                      key={fw.id}
                      style={styles.stepperItem}
                      onPress={() => setActiveFrameworkIdx(i)}
                    >
                      {/* Connector line */}
                      {i > 0 && (
                        <View
                          style={[
                            styles.stepperLine,
                            {
                              backgroundColor: isCompleted ? theme.primary : theme.border,
                            },
                          ]}
                        />
                      )}

                      {/* Step circle */}
                      <View
                        style={[
                          styles.stepperCircle,
                          {
                            backgroundColor: isActive
                              ? colorSet.accent
                              : isCompleted
                                ? theme.primary
                                : theme.surface,
                            borderColor: isActive
                              ? colorSet.accent
                              : isCompleted
                                ? theme.primary
                                : theme.border,
                          },
                        ]}
                      >
                        {isCompleted ? (
                          <Check size={14} color="#fff" />
                        ) : (
                          <Text
                            style={[
                              styles.stepperNum,
                              { color: isActive ? "#fff" : theme.textMuted },
                            ]}
                          >
                            {i + 1}
                          </Text>
                        )}
                      </View>

                      {/* Label */}
                      <Text
                        style={[
                          styles.stepperLabel,
                          {
                            color: isActive ? theme.text : theme.textSecondary,
                            fontWeight: isActive ? "700" : "500",
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {fw.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Active framework card */}
              {currentFramework && (
                <View
                  style={[
                    styles.frameworkCard,
                    {
                      backgroundColor:
                        frameworkColors[activeFrameworkIdx % frameworkColors.length].bg,
                      borderColor:
                        frameworkColors[activeFrameworkIdx % frameworkColors.length].border,
                    },
                  ]}
                >
                  <View style={styles.frameworkHeader}>
                    <View style={styles.frameworkTitleRow}>
                      <Lightbulb
                        size={20}
                        color={frameworkColors[activeFrameworkIdx % frameworkColors.length].accent}
                      />
                      <ThemedText style={styles.frameworkName}>{currentFramework.name}</ThemedText>
                    </View>
                    <Text style={[styles.frameworkCounter, { color: theme.textMuted }]}>
                      {activeFrameworkIdx + 1}/{totalFrameworks}
                    </Text>
                  </View>

                  {currentFramework.description && (
                    <ThemedText style={styles.frameworkDesc} themeColor="textSecondary">
                      {currentFramework.description}
                    </ThemedText>
                  )}

                  <View style={[styles.frameworkContentBox, { borderColor: theme.border }]}>
                    <ThemedText style={styles.frameworkContent}>
                      {currentFramework.content}
                    </ThemedText>
                  </View>
                </View>
              )}

              {/* Navigation */}
              <View style={styles.navRow}>
                <Pressable
                  style={[
                    styles.navBtn,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    activeFrameworkIdx === 0 && { opacity: 0.3 },
                  ]}
                  onPress={goPrevFramework}
                  disabled={activeFrameworkIdx === 0}
                >
                  <ChevronLeft size={20} color={theme.icon} />
                  <Text style={[styles.navBtnText, { color: theme.text }]}>Trước</Text>
                </Pressable>

                <Pressable
                  style={[styles.navBtn, { backgroundColor: theme.primary }]}
                  onPress={goNextFramework}
                >
                  <Text style={[styles.navBtnText, { color: "#0C0C0E" }]}>
                    {activeFrameworkIdx === totalFrameworks - 1 ? "Suy nghĩ lại" : "Tiếp"}
                  </Text>
                  {activeFrameworkIdx === totalFrameworks - 1 ? (
                    <RefreshCcw size={18} color="#0C0C0E" />
                  ) : (
                    <ChevronRight size={18} color="#0C0C0E" />
                  )}
                </Pressable>
              </View>
            </View>
          )}

          {/* ══════ PHASE: RETHINK ══════ */}
          {phase === "rethink" && (
            <View>
              {/* Context reminder */}
              {scenario.userResponse && (
                <View
                  style={[
                    styles.contextReminder,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <ThemedText
                    style={styles.contextReminderLabel}
                    type="label"
                    themeColor="textMuted"
                  >
                    LẬP TRƯỜNG BAN ĐẦU CỦA BẠN
                  </ThemedText>
                  <ThemedText style={styles.contextReminderValue}>
                    {scenario.userResponse.initialPosition}
                  </ThemedText>
                </View>
              )}

              <View style={styles.sectionHeader}>
                <View style={styles.rethinkTitleRow}>
                  <RefreshCcw size={22} color={theme.primary} />
                  <ThemedText style={styles.sectionTitle} type="title">
                    Suy nghĩ lại
                  </ThemedText>
                </View>
                <ThemedText style={styles.sectionSubtitle} themeColor="textSecondary">
                  Sau khi xem các góc nhìn và khung phân tích, bạn có muốn điều chỉnh lập trường
                  không?
                </ThemedText>
              </View>

              {hasExistingRethink && (
                <View
                  style={[
                    styles.existingRethinkNote,
                    { backgroundColor: "rgba(34, 197, 94, 0.08)" },
                  ]}
                >
                  <ThemedText style={{ fontSize: 13, color: theme.success }}>
                    ✓ Bạn đã suy nghĩ lại trước đó. Gửi lại sẽ cập nhật lập trường mới.
                  </ThemedText>
                </View>
              )}

              {/* Revised position input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  LẬP TRƯỜNG ĐIỀU CHỈNH *
                </ThemedText>
                <TextInput
                  style={[
                    styles.positionInput,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Lập trường mới hoặc xác nhận lập trường ban đầu…"
                  placeholderTextColor={theme.textMuted}
                  value={revisedPosition}
                  onChangeText={setRevisedPosition}
                  maxLength={300}
                />
              </View>

              {/* Reflection input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  SUY NGẪM (TÙY CHỌN)
                </ThemedText>
                <TextInput
                  style={[
                    styles.reflectionInput,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Điều gì đã thay đổi suy nghĩ của bạn? Khung phân tích nào ảnh hưởng nhiều nhất?"
                  placeholderTextColor={theme.textMuted}
                  value={reflection}
                  onChangeText={setReflection}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {submitError && (
                <View style={styles.errorBox}>
                  <Text style={{ color: theme.danger, fontSize: 13 }}>{submitError}</Text>
                </View>
              )}

              {/* Action buttons */}
              <View style={styles.rethinkActions}>
                <Pressable
                  style={[
                    styles.ctaButton,
                    {
                      backgroundColor: revisedPosition.trim() ? theme.primary : theme.border,
                      opacity: revisedPosition.trim() ? 1 : 0.5,
                      flex: 1,
                    },
                  ]}
                  onPress={handleSubmitRethink}
                  disabled={!revisedPosition.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#0C0C0E" />
                  ) : (
                    <>
                      <Send size={16} color="#0C0C0E" />
                      <Text style={styles.ctaButtonText}>Gửi lập trường mới</Text>
                    </>
                  )}
                </Pressable>
              </View>

              {/* Back to frameworks */}
              <Pressable
                style={[styles.linkBtn]}
                onPress={() => {
                  setPhase("frameworks");
                  setActiveFrameworkIdx(0);
                }}
              >
                <ChevronLeft size={16} color={theme.textSecondary} />
                <Text style={[styles.linkBtnText, { color: theme.textSecondary }]}>
                  Xem lại khung phân tích
                </Text>
              </Pressable>
            </View>
          )}

          {/* ══════ PHASE: DONE (Confirmation) ══════ */}
          {phase === "done" && (
            <View style={styles.doneContainer}>
              <View style={[styles.doneCircle, { backgroundColor: "rgba(34, 197, 94, 0.12)" }]}>
                <Check size={32} color={theme.success} />
              </View>
              <ThemedText style={styles.doneTitle} type="title">
                Đã cập nhật lập trường!
              </ThemedText>
              <ThemedText style={styles.doneSubtitle} themeColor="textSecondary">
                Hành trình tư duy phản biện của bạn được ghi nhận. Hãy tiếp tục khám phá các tình
                huống khác.
              </ThemedText>

              <Pressable
                style={[
                  styles.ctaButton,
                  { backgroundColor: theme.primary, marginTop: Spacing.five },
                ]}
                onPress={() => router.push("/scenarios" as never)}
              >
                <Text style={styles.ctaButtonText}>Khám phá tình huống khác</Text>
              </Pressable>

              <Pressable
                style={[styles.linkBtn, { marginTop: Spacing.three }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.linkBtnText, { color: theme.textSecondary }]}>
                  Quay về tình huống này
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: Spacing.five },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, marginHorizontal: Spacing.two },
  headerLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 2 },
  headerTitle: { fontSize: 14, fontWeight: "700", fontFamily: Fonts.sans },

  scrollContent: { flex: 1 },
  scrollContentInner: { padding: Spacing.four, paddingBottom: Spacing.five * 2 },

  /* Stepper */
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.two,
    flexWrap: "wrap",
    gap: 4,
  },
  stepperItem: { alignItems: "center", gap: 6, minWidth: 60 },
  stepperLine: {
    position: "absolute",
    top: 14,
    left: -20,
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  stepperCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperNum: { fontSize: 12, fontWeight: "700" },
  stepperLabel: { fontSize: 10, textAlign: "center", maxWidth: 80 },

  /* Framework card */
  frameworkCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  frameworkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  frameworkTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  frameworkName: { fontSize: 16, fontWeight: "800", fontFamily: Fonts.sans },
  frameworkCounter: { fontSize: 11, fontWeight: "600" },
  frameworkDesc: { fontSize: 13, lineHeight: 19, marginBottom: Spacing.three },
  frameworkContentBox: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: Spacing.three },
  frameworkContent: { fontSize: 14, lineHeight: 22 },

  /* Navigation */
  navRow: { flexDirection: "row", gap: Spacing.three },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  navBtnText: { fontSize: 14, fontWeight: "700", fontFamily: Fonts.sans },

  /* Section */
  sectionHeader: { marginBottom: Spacing.four },
  sectionTitle: { fontSize: 20, fontWeight: "800", fontFamily: Fonts.sans, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, lineHeight: 19 },
  rethinkTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },

  /* Context reminder */
  contextReminder: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  contextReminderLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  contextReminderValue: { fontSize: 15, fontWeight: "700", fontFamily: Fonts.sans },

  existingRethinkNote: {
    borderRadius: Radius.sm,
    padding: Spacing.two,
    marginBottom: Spacing.three,
  },

  /* Form inputs */
  inputGroup: { marginBottom: Spacing.three },
  inputLabel: { fontSize: 10, letterSpacing: 1, marginBottom: Spacing.one },
  positionInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  reflectionInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 120,
  },
  errorBox: { marginBottom: Spacing.two },

  /* Actions */
  rethinkActions: { flexDirection: "row", gap: Spacing.two },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: Radius.md,
  },
  ctaButtonText: { color: "#0C0C0E", fontSize: 15, fontWeight: "800", fontFamily: Fonts.sans },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.md },
  retryBtnText: { color: "#0C0C0E", fontWeight: "700", fontSize: 14 },

  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.two,
    marginTop: Spacing.two,
  },
  linkBtnText: { fontSize: 13, fontWeight: "600" },

  /* Done */
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.five * 2,
  },
  doneCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: Fonts.sans,
    marginBottom: Spacing.two,
    textAlign: "center",
  },
  doneSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: Spacing.four,
  },
});
