import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepProgress } from "@/components/story/StepProgress";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useStoryStore } from "@/stores/story.store";

interface PremiseOption {
  id: string;
  text: string;
}

const PREMISE_1_OPTIONS: PremiseOption[] = [
  {
    id: "p1-1",
    text: "Thực tại khách quan và các quan hệ kinh tế - vật chất quyết định ý thức của con người.",
  },
  {
    id: "p1-2",
    text: "Ý niệm tinh thần và ý chí chủ quan có trước và quyết định hoàn toàn sự tồn tại vật chất.",
  },
];

const PREMISE_2_OPTIONS: PremiseOption[] = [
  {
    id: "p2-1",
    text: "Thuật toán và công cụ sản xuất của hãng công nghệ áp đặt cách thức lao động và tư duy của tài xế.",
  },
  {
    id: "p2-2",
    text: "Tài xế công nghệ có toàn quyền tự do tuyệt đối về tư duy và hành vi, hoàn toàn tách rời công nghệ của hãng.",
  },
];

const CONCLUSION_OPTIONS: PremiseOption[] = [
  {
    id: "c-1",
    text: "Để thay đổi tư duy và cải thiện đời sống tài xế, cần cải cách thực tế quan hệ sản xuất và phân bổ lợi ích vật chất.",
  },
  {
    id: "c-2",
    text: "Chỉ cần khuyên nhủ tài xế thay đổi suy nghĩ tích cực hơn, không cần quan tâm thay đổi điều kiện vật chất hay thuật toán.",
  },
];

export default function BuildArgumentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id, selectedEvidences } = useLocalSearchParams<{
    id: string;
    selectedEvidences?: string;
  }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { setStep } = useStoryStore();

  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [conclusion, setConclusion] = useState<string | null>(null);

  const isFormComplete = p1 !== null && p2 !== null && conclusion !== null;

  function handleSubmit() {
    if (!isFormComplete) return;
    setStep("argument-result");
    router.push({
      pathname: `/story/${storyId}/argument-result` as never,
      params: { p1, p2, conclusion, selectedEvidences },
    });
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
            <CheckCircle2 color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              BƯỚC 5B: XÂY DỰNG LẬP LUẬN
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1}>
            Xây dựng Tam Đoạn Luận Triết Học
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Tiền đề đại */}
        <View style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            1. Tiền đề 1 (Tiền đề đại - Quy luật chung)
          </ThemedText>
          <View style={styles.optionsContainer}>
            {PREMISE_1_OPTIONS.map((opt) => {
              const isSelected = p1 === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setP1(opt.id)}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected
                        ? "rgba(217, 119, 6, 0.05)"
                        : theme.surfaceElevated,
                    },
                  ]}
                >
                  <View style={styles.radioContainer}>
                    {isSelected ? (
                      <CheckCircle2 color={theme.primary} size={18} />
                    ) : (
                      <Circle color={theme.textMuted} size={18} />
                    )}
                  </View>
                  <ThemedText
                    type="small"
                    style={[styles.optionText, isSelected && { color: theme.primaryLight }]}
                  >
                    {opt.text}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 2: Tiền đề tiểu */}
        <View style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            2. Tiền đề 2 (Tiền đề tiểu - Đối tượng cụ thể)
          </ThemedText>
          <View style={styles.optionsContainer}>
            {PREMISE_2_OPTIONS.map((opt) => {
              const isSelected = p2 === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setP2(opt.id)}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected
                        ? "rgba(217, 119, 6, 0.05)"
                        : theme.surfaceElevated,
                    },
                  ]}
                >
                  <View style={styles.radioContainer}>
                    {isSelected ? (
                      <CheckCircle2 color={theme.primary} size={18} />
                    ) : (
                      <Circle color={theme.textMuted} size={18} />
                    )}
                  </View>
                  <ThemedText
                    type="small"
                    style={[styles.optionText, isSelected && { color: theme.primaryLight }]}
                  >
                    {opt.text}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 3: Kết luận */}
        <View style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            3. Kết luận
          </ThemedText>
          <View style={styles.optionsContainer}>
            {CONCLUSION_OPTIONS.map((opt) => {
              const isSelected = conclusion === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setConclusion(opt.id)}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected
                        ? "rgba(217, 119, 6, 0.05)"
                        : theme.surfaceElevated,
                    },
                  ]}
                >
                  <View style={styles.radioContainer}>
                    {isSelected ? (
                      <CheckCircle2 color={theme.primary} size={18} />
                    ) : (
                      <Circle color={theme.textMuted} size={18} />
                    )}
                  </View>
                  <ThemedText
                    type="small"
                    style={[styles.optionText, isSelected && { color: theme.primaryLight }]}
                  >
                    {opt.text}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title={isFormComplete ? "Xác nhận Lập luận" : "Hãy hoàn thành cả 3 phần lập luận"}
          disabled={!isFormComplete}
          onPress={handleSubmit}
          style={{
            flex: 1,
            backgroundColor: isFormComplete ? theme.primary : theme.backgroundElement,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
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
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: "#E5E7EB",
  },
  optionsContainer: {
    gap: Spacing.two,
  },
  optionCard: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  radioContainer: {
    marginRight: 4,
  },
  optionText: {
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});
