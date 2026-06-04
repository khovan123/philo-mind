import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useGetScenarioDetailQuery,
  useRespondScenarioMutation,
  type ScenarioPerspectiveDTO,
} from "@/services/rtk-api/scenario.api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - Spacing.four * 2;

/** ─── T-F03: Scenario SITUATION + PERSPECTIVES Screen ──────────────
 *  Route: /scenarios/[id]
 *  Flow: Situation overview → Stance selector → Swipeable perspectives
 */
export default function ScenarioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();

  const {
    data: scenario,
    isLoading,
    isError,
    refetch,
  } = useGetScenarioDetailQuery(id!, {
    skip: !id,
  });
  const [respondScenario, { isLoading: isSubmitting }] = useRespondScenarioMutation();

  // ─── Local state ───────────────────────────────────────────────
  const [phase, setPhase] = useState<"situation" | "respond" | "perspectives">("situation");
  const [initialPosition, setInitialPosition] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [activePerspectiveIdx, setActivePerspectiveIdx] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<ScenarioPerspectiveDTO>>(null);

  // ─── Derived ───────────────────────────────────────────────────
  const hasResponded = !!scenario?.userResponse;
  const perspectives = scenario?.perspectives ?? [];
  const totalPerspectives = perspectives.length;

  const perspectiveColors = useMemo(
    () => [
      { bg: "rgba(34, 197, 94, 0.10)", border: "rgba(34, 197, 94, 0.3)", accent: theme.success },
      { bg: "rgba(239, 68, 68, 0.10)", border: "rgba(239, 68, 68, 0.3)", accent: theme.danger },
      { bg: "rgba(59, 130, 246, 0.10)", border: "rgba(59, 130, 246, 0.3)", accent: theme.info },
      { bg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.3)", accent: theme.warning },
    ],
    [theme],
  );

  // ─── Handlers ──────────────────────────────────────────────────
  const handleSubmitResponse = useCallback(async () => {
    if (!id || !initialPosition.trim()) return;
    setSubmitError(null);

    try {
      await respondScenario({
        scenarioId: id,
        body: {
          initialPosition: initialPosition.trim(),
          reasoning: reasoning.trim() || undefined,
        },
      }).unwrap();
      setPhase("perspectives");
    } catch {
      setSubmitError("Đã xảy ra lỗi khi gửi lập trường. Vui lòng thử lại.");
    }
  }, [id, initialPosition, reasoning, respondScenario]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActivePerspectiveIdx(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 60 }), []);

  const scrollToPerspective = (direction: "prev" | "next") => {
    const newIdx =
      direction === "next"
        ? Math.min(activePerspectiveIdx + 1, totalPerspectives - 1)
        : Math.max(activePerspectiveIdx - 1, 0);
    flatListRef.current?.scrollToIndex({ index: newIdx, animated: true });
  };

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
          Không thể tải tình huống.
        </ThemedText>
        <Pressable style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={refetch}>
          <Text style={styles.retryBtnText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  // If user already responded, jump straight to perspectives
  if (hasResponded && phase === "situation") {
    // Intentionally set phase in next tick to avoid render-during-render
    setTimeout(() => setPhase("perspectives"), 0);
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
              TÌNH HUỐNG THỰC TẾ
            </ThemedText>
            <ThemedText style={styles.headerTitle} numberOfLines={1}>
              {scenario.title}
            </ThemedText>
          </View>
          {/* Phase indicator dots */}
          <View style={styles.phaseDots}>
            {(["situation", "respond", "perspectives"] as const).map((p) => (
              <View
                key={p}
                style={[
                  styles.phaseDot,
                  {
                    backgroundColor:
                      p === phase
                        ? theme.primary
                        : p === "respond" && hasResponded
                          ? theme.success
                          : theme.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentInner}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══════ PHASE: SITUATION ══════ */}
          {phase === "situation" && (
            <View>
              {/* Situation card */}
              <View
                style={[
                  styles.situationCard,
                  { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                ]}
              >
                <View style={styles.situationIconRow}>
                  <View
                    style={[
                      styles.situationIconCircle,
                      { backgroundColor: "rgba(217, 119, 6, 0.12)" },
                    ]}
                  >
                    <BookOpen size={22} color={theme.primary} />
                  </View>
                  <ThemedText style={styles.situationBadge} type="label" themeColor="primary">
                    TÌNH HUỐNG
                  </ThemedText>
                </View>
                <ThemedText style={styles.situationTitle}>{scenario.title}</ThemedText>
                <ThemedText style={styles.situationBody} themeColor="textSecondary">
                  {scenario.situation}
                </ThemedText>
                {scenario.context ? (
                  <View style={[styles.contextBox, { borderColor: theme.border }]}>
                    <ThemedText style={styles.contextLabel} type="label" themeColor="textMuted">
                      BỐI CẢNH
                    </ThemedText>
                    <ThemedText style={styles.contextText} themeColor="textSecondary">
                      {scenario.context}
                    </ThemedText>
                  </View>
                ) : null}
              </View>

              {/* Info chips */}
              <View style={styles.chipRow}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <Eye size={14} color={theme.textSecondary} />
                  <Text style={[styles.chipText, { color: theme.textSecondary }]}>
                    {totalPerspectives} góc nhìn
                  </Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <Sparkles size={14} color={theme.textSecondary} />
                  <Text style={[styles.chipText, { color: theme.textSecondary }]}>
                    {scenario.frameworks?.length ?? 0} khung phân tích
                  </Text>
                </View>
              </View>

              {/* CTA */}
              <Pressable
                style={[styles.ctaButton, { backgroundColor: theme.primary }]}
                onPress={() => setPhase(hasResponded ? "perspectives" : "respond")}
              >
                <Text style={styles.ctaButtonText}>
                  {hasResponded ? "Xem các góc nhìn" : "Bắt đầu phân tích"}
                </Text>
                <ChevronRight size={18} color="#0C0C0E" />
              </Pressable>
            </View>
          )}

          {/* ══════ PHASE: RESPOND (Stance Selector) ══════ */}
          {phase === "respond" && !hasResponded && (
            <View>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle} type="title">
                  Lập trường của bạn
                </ThemedText>
                <ThemedText style={styles.sectionSubtitle} themeColor="textSecondary">
                  Trước khi xem các góc nhìn khác, hãy xác định lập trường ban đầu của bạn.
                </ThemedText>
              </View>

              {/* Position input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  LẬP TRƯỜNG BAN ĐẦU *
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
                  placeholder="VD: Tôi cho rằng hành động này đúng về mặt đạo đức…"
                  placeholderTextColor={theme.textMuted}
                  value={initialPosition}
                  onChangeText={setInitialPosition}
                  maxLength={300}
                />
              </View>

              {/* Reasoning input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  LÝ DO (TÙY CHỌN)
                </ThemedText>
                <TextInput
                  style={[
                    styles.reasoningInput,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Giải thích ngắn gọn lý do bạn nghĩ vậy…"
                  placeholderTextColor={theme.textMuted}
                  value={reasoning}
                  onChangeText={setReasoning}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {submitError && (
                <View style={styles.errorBox}>
                  <Text style={{ color: theme.danger, fontSize: 13 }}>{submitError}</Text>
                </View>
              )}

              {/* Submit CTA */}
              <Pressable
                style={[
                  styles.ctaButton,
                  {
                    backgroundColor: initialPosition.trim() ? theme.primary : theme.border,
                    opacity: initialPosition.trim() ? 1 : 0.5,
                  },
                ]}
                onPress={handleSubmitResponse}
                disabled={!initialPosition.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#0C0C0E" />
                ) : (
                  <>
                    <Send size={16} color="#0C0C0E" />
                    <Text style={styles.ctaButtonText}>Gửi lập trường</Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* ══════ PHASE: PERSPECTIVES (Swipeable Cards) ══════ */}
          {phase === "perspectives" && (
            <View>
              {/* User response summary */}
              {scenario.userResponse && (
                <View
                  style={[
                    styles.userResponseCard,
                    {
                      backgroundColor: "rgba(217, 119, 6, 0.08)",
                      borderColor: "rgba(217, 119, 6, 0.25)",
                    },
                  ]}
                >
                  <View style={styles.userResponseHeader}>
                    <MessageCircle size={16} color={theme.primary} />
                    <ThemedText style={styles.userResponseLabel} themeColor="primary">
                      Lập trường của bạn
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.userResponseText}>
                    {scenario.userResponse.initialPosition}
                  </ThemedText>
                  {scenario.userResponse.reasoning ? (
                    <ThemedText style={styles.userResponseReasoning} themeColor="textSecondary">
                      {scenario.userResponse.reasoning}
                    </ThemedText>
                  ) : null}
                </View>
              )}

              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle} type="title">
                  Các góc nhìn
                </ThemedText>
                <ThemedText style={styles.sectionSubtitle} themeColor="textSecondary">
                  Vuốt để khám phá {totalPerspectives} góc nhìn khác nhau
                </ThemedText>
              </View>

              {totalPerspectives === 0 ? (
                <View
                  style={[
                    styles.emptyCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <ThemedText themeColor="textSecondary" style={{ textAlign: "center" }}>
                    Chưa có góc nhìn nào cho tình huống này.
                  </ThemedText>
                </View>
              ) : (
                <>
                  {/* Swipeable perspective cards */}
                  <FlatList
                    ref={flatListRef}
                    data={perspectives}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + Spacing.three}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingRight: Spacing.four }}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    renderItem={({ item, index }) => {
                      const colorSet = perspectiveColors[index % perspectiveColors.length];
                      return (
                        <View
                          style={[
                            styles.perspectiveCard,
                            {
                              width: CARD_WIDTH,
                              backgroundColor: colorSet.bg,
                              borderColor: colorSet.border,
                            },
                          ]}
                        >
                          <View style={styles.perspectiveHeader}>
                            <View
                              style={[
                                styles.perspectiveTypeBadge,
                                { borderColor: colorSet.accent },
                              ]}
                            >
                              <View
                                style={[
                                  styles.perspectiveDot,
                                  { backgroundColor: colorSet.accent },
                                ]}
                              />
                              <Text
                                style={[styles.perspectiveTypeText, { color: colorSet.accent }]}
                              >
                                {item.perspectiveType}
                              </Text>
                            </View>
                            <Text style={[styles.perspectiveCounter, { color: theme.textMuted }]}>
                              {index + 1}/{totalPerspectives}
                            </Text>
                          </View>
                          <ThemedText style={styles.perspectiveContent}>{item.content}</ThemedText>
                        </View>
                      );
                    }}
                  />

                  {/* Nav arrows */}
                  <View style={styles.perspectiveNav}>
                    <Pressable
                      style={[
                        styles.navArrow,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        activePerspectiveIdx === 0 && { opacity: 0.3 },
                      ]}
                      onPress={() => scrollToPerspective("prev")}
                      disabled={activePerspectiveIdx === 0}
                    >
                      <ChevronLeft size={20} color={theme.icon} />
                    </Pressable>

                    {/* Dots */}
                    <View style={styles.dotsRow}>
                      {perspectives.map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.navDot,
                            {
                              backgroundColor:
                                i === activePerspectiveIdx ? theme.primary : theme.border,
                            },
                          ]}
                        />
                      ))}
                    </View>

                    <Pressable
                      style={[
                        styles.navArrow,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        activePerspectiveIdx === totalPerspectives - 1 && { opacity: 0.3 },
                      ]}
                      onPress={() => scrollToPerspective("next")}
                      disabled={activePerspectiveIdx === totalPerspectives - 1}
                    >
                      <ChevronRight size={20} color={theme.icon} />
                    </Pressable>
                  </View>
                </>
              )}

              {/* Navigate to Framework/Rethink */}
              {scenario.frameworks && scenario.frameworks.length > 0 && (
                <Pressable
                  style={[
                    styles.ctaButton,
                    { backgroundColor: theme.primary, marginTop: Spacing.four },
                  ]}
                  onPress={() => router.push(`/scenarios/rethink?scenarioId=${id}` as never)}
                >
                  <Text style={styles.ctaButtonText}>Khám phá khung phân tích</Text>
                  <ChevronRight size={18} color="#0C0C0E" />
                </Pressable>
              )}
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
  phaseDots: { flexDirection: "row", gap: 6 },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },

  scrollContent: { flex: 1 },
  scrollContentInner: { padding: Spacing.four, paddingBottom: Spacing.five * 2 },

  /* Situation card */
  situationCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  situationIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  situationIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  situationBadge: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  situationTitle: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: Fonts.sans,
    marginBottom: Spacing.two,
  },
  situationBody: { fontSize: 14, lineHeight: 22 },
  contextBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
  },
  contextLabel: { fontSize: 10, letterSpacing: 1, marginBottom: Spacing.one },
  contextText: { fontSize: 13, lineHeight: 20 },

  /* Chips */
  chipRow: { flexDirection: "row", gap: Spacing.two, marginBottom: Spacing.four },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: "600" },

  /* Section */
  sectionHeader: { marginBottom: Spacing.three },
  sectionTitle: { fontSize: 20, fontWeight: "800", fontFamily: Fonts.sans, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, lineHeight: 19 },

  /* Respond form */
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
  reasoningInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 100,
  },
  errorBox: { marginBottom: Spacing.two },

  /* CTA */
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  ctaButtonText: { color: "#0C0C0E", fontSize: 15, fontWeight: "800", fontFamily: Fonts.sans },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.md },
  retryBtnText: { color: "#0C0C0E", fontWeight: "700", fontSize: 14 },

  /* User response */
  userResponseCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  userResponseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: Spacing.one,
  },
  userResponseLabel: { fontSize: 12, fontWeight: "700" },
  userResponseText: { fontSize: 15, fontWeight: "700", fontFamily: Fonts.sans, marginBottom: 4 },
  userResponseReasoning: { fontSize: 13, lineHeight: 19 },

  /* Perspective cards */
  perspectiveCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginRight: Spacing.three,
  },
  perspectiveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  perspectiveTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  perspectiveDot: { width: 8, height: 8, borderRadius: 4 },
  perspectiveTypeText: { fontSize: 12, fontWeight: "700" },
  perspectiveCounter: { fontSize: 11, fontWeight: "600" },
  perspectiveContent: { fontSize: 14, lineHeight: 22 },

  /* Nav */
  perspectiveNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: { flexDirection: "row", gap: 6 },
  navDot: { width: 8, height: 8, borderRadius: 4 },

  /* Empty */
  emptyCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: "center",
  },
});
