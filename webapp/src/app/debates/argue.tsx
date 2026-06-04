import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  PenLine,
  Shield,
  Swords,
  Scale,
} from "lucide-react-native";
import React, { useState, useMemo } from "react";
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
import { useCreateArgumentMutation, useGetDebateDetailQuery } from "@/services/rtk-api/debate.api";

type StanceType = "AGREE" | "DISAGREE" | "NEUTRAL";

const MIN_ARGUMENT_LENGTH = 50;

/** ─── Argue Screen (T-F07) ──────────────────────────────────────────
 *  Full-screen argument creation flow:
 *  Step 1 → Stance selection (FOR / AGAINST / NEUTRAL)
 *  Step 2 → Argument editor with title + body
 *  Step 3 → Preview + self-rating → Submit
 */
export default function ArgueScreen() {
  const { debateId } = useLocalSearchParams<{ debateId: string }>();
  const router = useRouter();
  const theme = useTheme();

  const { data: debate, isLoading } = useGetDebateDetailQuery(debateId!, {
    skip: !debateId,
  });
  const [createArgument, { isLoading: isSubmitting }] = useCreateArgumentMutation();

  // ─── Local state ───────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [stance, setStance] = useState<StanceType | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [convincingRating, setConvincingRating] = useState(80);
  const [isPreview, setIsPreview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ─── Derived ───────────────────────────────────────────────────────
  const combinedText = `**${title.trim()}**\n\n${body.trim()}`;
  const totalLength = (title.trim() + body.trim()).length;
  const isValidLength = totalLength >= MIN_ARGUMENT_LENGTH;
  const canProceedStep2 = title.trim().length > 0 && isValidLength;

  const stanceConfig = useMemo(
    () => ({
      AGREE: {
        label: "Đồng ý",
        sublabel: "Tôi ủng hộ luận điểm này",
        icon: Shield,
        color: theme.success,
        bgColor: "rgba(34, 197, 94, 0.12)",
        borderColor: "rgba(34, 197, 94, 0.3)",
      },
      DISAGREE: {
        label: "Phản đối",
        sublabel: "Tôi phản bác luận điểm này",
        icon: Swords,
        color: theme.danger,
        bgColor: "rgba(239, 44, 68, 0.12)",
        borderColor: "rgba(239, 44, 68, 0.3)",
      },
      NEUTRAL: {
        label: "Trung lập",
        sublabel: "Tôi muốn đóng góp ý kiến trung lập",
        icon: Scale,
        color: theme.warning,
        bgColor: "rgba(245, 158, 11, 0.12)",
        borderColor: "rgba(245, 158, 11, 0.3)",
      },
    }),
    [theme],
  );

  // ─── Handlers ──────────────────────────────────────────────────────
  const handleStanceSelect = (s: StanceType) => {
    setStance(s);
    setCurrentStep(2);
  };

  const handleGoToPreview = () => {
    setIsPreview(true);
    setCurrentStep(3);
  };

  const handleBackToEditor = () => {
    setIsPreview(false);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    if (!debateId || !stance || !isValidLength) return;
    setSubmitError(null);

    try {
      await createArgument({
        debateId,
        body: {
          stance,
          content: combinedText,
        },
      }).unwrap();

      router.back();
    } catch {
      setSubmitError("Đã xảy ra lỗi khi gửi lập luận. Vui lòng thử lại.");
    }
  };

  // ─── Loading / Error ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!debate) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ThemedText style={{ color: theme.danger }}>Không tìm thấy phiên tranh luận.</ThemedText>
        <Pressable style={{ marginTop: Spacing.four }} onPress={() => router.back()}>
          <ThemedText themeColor="primary">Quay lại</ThemedText>
        </Pressable>
      </View>
    );
  }

  const activeStanceConfig = stance ? stanceConfig[stance] : null;

  // ─── RENDER ────────────────────────────────────────────────────────
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
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              if (currentStep > 1 && !isPreview) {
                setCurrentStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
              } else if (isPreview) {
                handleBackToEditor();
              } else {
                router.back();
              }
            }}
          >
            <ArrowLeft size={22} color={theme.icon} />
          </Pressable>
          <View style={styles.headerCenter}>
            <ThemedText style={styles.headerLabel} type="label" themeColor="textSecondary">
              VIẾT LẬP LUẬN
            </ThemedText>
            <ThemedText style={styles.headerTitle} numberOfLines={1}>
              {debate.title}
            </ThemedText>
          </View>
          {/* Step indicator */}
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: step <= currentStep ? theme.primary : theme.border,
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
          {/* ══════ STEP 1: Stance Selection ══════ */}
          {currentStep === 1 && (
            <View>
              <View style={styles.stepTitleRow}>
                <ThemedText style={styles.stepTitle} type="title">
                  Chọn lập trường của bạn
                </ThemedText>
                <ThemedText style={styles.stepSubtitle} themeColor="textSecondary">
                  Hãy xác định rõ quan điểm trước khi viết lập luận
                </ThemedText>
              </View>

              {/* Debate context card */}
              <View
                style={[
                  styles.contextCard,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ThemedText style={styles.contextLabel} type="label" themeColor="textSecondary">
                  CHỦ ĐỀ TRANH LUẬN
                </ThemedText>
                <ThemedText style={styles.contextTitle}>{debate.title}</ThemedText>
                {debate.description ? (
                  <ThemedText
                    style={styles.contextDesc}
                    themeColor="textSecondary"
                    numberOfLines={3}
                  >
                    {debate.description}
                  </ThemedText>
                ) : null}
              </View>

              {/* Stance cards */}
              {(["AGREE", "DISAGREE", "NEUTRAL"] as StanceType[]).map((s) => {
                const config = stanceConfig[s];
                const IconComp = config.icon;
                return (
                  <Pressable
                    key={s}
                    style={[
                      styles.stanceCard,
                      {
                        backgroundColor: config.bgColor,
                        borderColor: config.borderColor,
                      },
                    ]}
                    onPress={() => handleStanceSelect(s)}
                  >
                    <View style={[styles.stanceIconCircle, { backgroundColor: config.bgColor }]}>
                      <IconComp size={24} color={config.color} />
                    </View>
                    <View style={styles.stanceCardText}>
                      <Text style={[styles.stanceLabel, { color: config.color }]}>
                        {config.label}
                      </Text>
                      <Text style={[styles.stanceSublabel, { color: theme.textSecondary }]}>
                        {config.sublabel}
                      </Text>
                    </View>
                    <ChevronRight size={20} color={config.color} />
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* ══════ STEP 2: Editor ══════ */}
          {currentStep === 2 && !isPreview && (
            <View>
              {/* Active stance badge */}
              {activeStanceConfig && (
                <View
                  style={[
                    styles.activeBadge,
                    {
                      backgroundColor: activeStanceConfig.bgColor,
                      borderColor: activeStanceConfig.borderColor,
                    },
                  ]}
                >
                  <View style={[styles.splitDot, { backgroundColor: activeStanceConfig.color }]} />
                  <Text style={[styles.activeBadgeText, { color: activeStanceConfig.color }]}>
                    {activeStanceConfig.label}
                  </Text>
                  <Pressable onPress={() => setCurrentStep(1)}>
                    <Text style={[styles.changeBadgeText, { color: theme.textMuted }]}>Đổi</Text>
                  </Pressable>
                </View>
              )}

              <View style={styles.stepTitleRow}>
                <ThemedText style={styles.stepTitle} type="title">
                  Viết lập luận
                </ThemedText>
                <ThemedText style={styles.stepSubtitle} themeColor="textSecondary">
                  Trình bày luận điểm của bạn rõ ràng và thuyết phục
                </ThemedText>
              </View>

              {/* Title input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  TIÊU ĐỀ LẬP LUẬN
                </ThemedText>
                <TextInput
                  style={[
                    styles.titleInput,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                    },
                  ]}
                  placeholder="VD: Tự do ý chí là nền tảng của đạo đức"
                  placeholderTextColor={theme.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={120}
                />
              </View>

              {/* Body input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  NỘI DUNG LẬP LUẬN
                </ThemedText>
                <TextInput
                  style={[
                    styles.bodyInput,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Trình bày lập luận của bạn..."
                  placeholderTextColor={theme.textMuted}
                  value={body}
                  onChangeText={setBody}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Character count */}
              <View style={styles.charCountRow}>
                <Text
                  style={[
                    styles.charCountText,
                    {
                      color: isValidLength ? theme.success : theme.danger,
                    },
                  ]}
                >
                  {totalLength}/{MIN_ARGUMENT_LENGTH} ký tự tối thiểu
                </Text>
                {isValidLength && <Check size={14} color={theme.success} />}
              </View>

              {/* Convincing rating slider */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel} type="label" themeColor="textSecondary">
                  TỰ ĐÁNH GIÁ ĐỘ THUYẾT PHỤC
                </ThemedText>
                <View style={styles.ratingRow}>
                  {[20, 40, 60, 80, 100].map((val) => (
                    <Pressable
                      key={val}
                      style={[
                        styles.ratingChip,
                        {
                          backgroundColor: convincingRating === val ? theme.primary : theme.surface,
                          borderColor: convincingRating === val ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => setConvincingRating(val)}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: convincingRating === val ? "700" : "500",
                          color: convincingRating === val ? "#0C0C0E" : theme.text,
                        }}
                      >
                        {val}%
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Preview CTA */}
              <Pressable
                style={[
                  styles.ctaButton,
                  {
                    backgroundColor: canProceedStep2 ? theme.primary : theme.border,
                    opacity: canProceedStep2 ? 1 : 0.5,
                  },
                ]}
                onPress={handleGoToPreview}
                disabled={!canProceedStep2}
              >
                <Eye size={18} color="#0C0C0E" />
                <Text style={styles.ctaButtonText}>Xem trước lập luận</Text>
              </Pressable>
            </View>
          )}

          {/* ══════ STEP 3: Preview ══════ */}
          {currentStep === 3 && isPreview && (
            <View>
              <View style={styles.stepTitleRow}>
                <View style={styles.previewBadge}>
                  <Eye size={14} color={theme.primary} />
                  <ThemedText style={styles.previewBadgeText} themeColor="primary">
                    XEM TRƯỚC
                  </ThemedText>
                </View>
                <ThemedText style={styles.stepTitle} type="title">
                  Xem lại lập luận
                </ThemedText>
                <ThemedText style={styles.stepSubtitle} themeColor="textSecondary">
                  Kiểm tra nội dung trước khi gửi đi
                </ThemedText>
              </View>

              {/* Preview card */}
              <View
                style={[
                  styles.previewCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: activeStanceConfig ? activeStanceConfig.borderColor : theme.border,
                    borderLeftColor: activeStanceConfig ? activeStanceConfig.color : theme.border,
                  },
                ]}
              >
                {/* Stance badge */}
                {activeStanceConfig && (
                  <View
                    style={[
                      styles.previewStanceBadge,
                      {
                        backgroundColor: activeStanceConfig.bgColor,
                      },
                    ]}
                  >
                    <View
                      style={[styles.splitDot, { backgroundColor: activeStanceConfig.color }]}
                    />
                    <Text style={[styles.previewStanceText, { color: activeStanceConfig.color }]}>
                      {activeStanceConfig.label}
                    </Text>
                  </View>
                )}

                <ThemedText style={styles.previewTitle}>{title.trim()}</ThemedText>
                <ThemedText style={styles.previewBody} themeColor="textSecondary">
                  {body.trim()}
                </ThemedText>

                <View style={[styles.previewMeta, { borderTopColor: theme.border }]}>
                  <Text style={[styles.previewMetaText, { color: theme.textMuted }]}>
                    Độ thuyết phục: {convincingRating}%
                  </Text>
                  <Text style={[styles.previewMetaText, { color: theme.textMuted }]}>
                    {totalLength} ký tự
                  </Text>
                </View>
              </View>

              {submitError && (
                <View style={styles.errorBox}>
                  <Text style={{ color: theme.danger, fontSize: 13 }}>{submitError}</Text>
                </View>
              )}

              {/* Action buttons */}
              <Pressable
                style={[styles.ctaButton, { backgroundColor: theme.primary }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#0C0C0E" />
                ) : (
                  <>
                    <PenLine size={18} color="#0C0C0E" />
                    <Text style={styles.ctaButtonText}>Gửi lập luận</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={[styles.secondaryButton, { borderColor: theme.border }]}
                onPress={handleBackToEditor}
              >
                <EyeOff size={16} color={theme.textSecondary} />
                <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>
                  Chỉnh sửa lại
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.five,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: Spacing.two,
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Fonts.sans,
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    padding: Spacing.four,
    paddingBottom: Spacing.five * 2,
  },
  stepTitleRow: {
    marginBottom: Spacing.four,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    fontFamily: Fonts.sans,
  },
  stepSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },

  /* Context card */
  contextCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  contextLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  contextTitle: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Fonts.sans,
    marginBottom: 4,
  },
  contextDesc: {
    fontSize: 13,
    lineHeight: 18,
  },

  /* Stance cards */
  stanceCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
  stanceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  stanceCardText: {
    flex: 1,
  },
  stanceLabel: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: Fonts.sans,
    marginBottom: 2,
  },
  stanceSublabel: {
    fontSize: 12,
    lineHeight: 17,
  },

  /* Active badge */
  activeBadge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: Spacing.three,
  },
  splitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: Fonts.sans,
  },
  changeBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    textDecorationLine: "underline",
    marginLeft: 4,
  },

  /* Editor inputs */
  inputGroup: {
    marginBottom: Spacing.three,
  },
  inputLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  bodyInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 160,
  },
  charCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: Spacing.three,
  },
  charCountText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  ratingChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
  },

  /* CTA */
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: Radius.md,
    marginTop: Spacing.three,
  },
  ctaButtonText: {
    color: "#0C0C0E",
    fontSize: 15,
    fontWeight: "800",
    fontFamily: Fonts.sans,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* Preview */
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: Spacing.two,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  previewCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.three,
  },
  previewStanceBadge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: Spacing.two,
  },
  previewStanceText: {
    fontSize: 11,
    fontWeight: "700",
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: "800",
    fontFamily: Fonts.sans,
    marginBottom: Spacing.two,
  },
  previewBody: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.three,
  },
  previewMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
  },
  previewMetaText: {
    fontSize: 11,
    fontWeight: "500",
  },
  errorBox: {
    marginTop: Spacing.two,
    padding: Spacing.two,
  },
});
