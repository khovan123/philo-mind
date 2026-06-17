import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen, CheckSquare, Square } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepProgress } from "@/components/story/StepProgress";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useStoryStore } from "@/stores/story.store";

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
}

const EVIDENCE_LIST: EvidenceItem[] = [
  {
    id: "ev-1",
    title: "Thuật toán quyết định thu nhập",
    description:
      "Thu nhập thực tế của tài xế công nghệ bị chi phối hoàn toàn bởi hệ thống phân bổ đơn của thuật toán (Vật chất quyết định).",
  },
  {
    id: "ev-2",
    title: "Định danh 'đối tác' để tránh nghĩa vụ",
    description:
      "Hãng công nghệ coi tài xế là đối tác tự do nhằm né tránh trách nhiệm đóng bảo hiểm và cung cấp các phúc lợi cơ bản.",
  },
  {
    id: "ev-3",
    title: "Mối quan hệ tương sinh & mâu thuẫn",
    description:
      "Hãng cần tài xế chạy xe để tạo doanh thu, tài xế cần hãng để nhận đơn. Quan hệ biện chứng vừa phụ thuộc vừa mâu thuẫn lợi ích.",
  },
  {
    id: "ev-4",
    title: "Sự tự do giả tạo của 'Hợp đồng thương mại'",
    description:
      "Góc nhìn siêu hình chỉ thấy sự độc lập giữa hai bên tự nguyện ký hợp đồng, bỏ qua quan hệ sản xuất thực tế bất bình đẳng.",
  },
];

export default function EvidenceBoardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { setStep } = useStoryStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleSelect(evId: string) {
    setSelectedIds((prev) =>
      prev.includes(evId) ? prev.filter((id) => id !== evId) : [...prev, evId],
    );
  }

  function handleNext() {
    setStep("build-argument");
    router.push({
      pathname: `/story/${storyId}/build-argument` as never,
      params: { selectedEvidences: selectedIds.join(",") },
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
            <BookOpen color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              BƯỚC 5A: BẢNG CHỨNG CỨ
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1}>
            Thu thập chứng cứ từ thực tế
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="default" style={styles.subtext}>
          Hãy lựa chọn các chứng cứ và lập luận quan trọng thu thập được từ câu chuyện của bác tài
          xế công nghệ để chuẩn bị xây dựng luận điểm triết học của bạn.
        </ThemedText>

        <View style={styles.listContainer}>
          {EVIDENCE_LIST.map((ev) => {
            const isSelected = selectedIds.includes(ev.id);

            return (
              <Pressable
                key={ev.id}
                onPress={() => toggleSelect(ev.id)}
                style={[
                  styles.card,
                  {
                    borderColor: isSelected ? theme.primary : theme.border,
                    backgroundColor: isSelected ? "rgba(217, 119, 6, 0.05)" : theme.surfaceElevated,
                  },
                ]}
              >
                <View style={styles.checkboxContainer}>
                  {isSelected ? (
                    <CheckSquare color={theme.primary} size={20} />
                  ) : (
                    <Square color={theme.textMuted} size={20} />
                  )}
                </View>
                <View style={styles.cardContent}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: isSelected ? theme.primaryLight : theme.text }}
                  >
                    {ev.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
                    {ev.description}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title={
            selectedIds.length === 0
              ? "Chọn ít nhất 1 chứng cứ"
              : `Tiếp tục (${selectedIds.length} đã chọn)`
          }
          disabled={selectedIds.length === 0}
          onPress={handleNext}
          style={{
            flex: 1,
            backgroundColor: selectedIds.length > 0 ? theme.primary : theme.backgroundElement,
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
    gap: Spacing.three,
  },
  subtext: {
    lineHeight: 22,
    color: "#9CA3AF",
  },
  listContainer: {
    gap: Spacing.three,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    flexDirection: "row",
    gap: Spacing.three,
  },
  checkboxContainer: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.one,
  },
  description: {
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});
