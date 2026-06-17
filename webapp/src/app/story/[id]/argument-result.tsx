import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, ArrowLeft, CheckCircle2, Award } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepProgress } from "@/components/story/StepProgress";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useStoryStore } from "@/stores/story.store";

export default function ArgumentResultScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id, p1, p2, conclusion } = useLocalSearchParams<{
    id: string;
    p1?: string;
    p2?: string;
    conclusion?: string;
  }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { setStep } = useStoryStore();

  const isValid = p1 === "p1-1" && p2 === "p2-1" && conclusion === "c-1";

  function handleContinue() {
    setStep("knowledge");
    router.push(`/story/${storyId}/knowledge` as never);
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
            <Award color={theme.primary} size={14} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              BƯỚC 5C: KẾT QUẢ BIỆN LUẬN
            </ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={1}>
            Đánh giá lập luận Logic
          </ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultContainer}>
          {isValid ? (
            <View style={styles.badgeContainer}>
              <CheckCircle2 color={theme.success} size={64} />
              <ThemedText
                type="subtitle"
                style={{ color: theme.success, fontWeight: "900", marginTop: Spacing.two }}
              >
                Lập luận hợp lệ!
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                Bạn đã áp dụng thành công thế giới quan Duy vật Biện chứng để phân tích thực tiễn.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.badgeContainer}>
              <AlertTriangle color={theme.warning} size={64} />
              <ThemedText
                type="subtitle"
                style={{ color: theme.warning, fontWeight: "900", marginTop: Spacing.two }}
              >
                Lập luận chưa tối ưu
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                Có vẻ luận điểm của bạn đang bị ảnh hưởng bởi góc nhìn siêu hình hoặc duy tâm.
              </ThemedText>
            </View>
          )}

          <Card
            style={[
              styles.explanationCard,
              { borderColor: isValid ? theme.success : theme.warning },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{ color: isValid ? theme.success : theme.warning, marginBottom: Spacing.one }}
            >
              {isValid ? "Phân tích Logic Biện chứng:" : "Góp ý Logic:"}
            </ThemedText>
            <ThemedText type="small" style={styles.explanationText}>
              {isValid
                ? "Lập luận của bạn rất xuất sắc! Bạn xác định đúng rằng cơ sở vật chất khách quan (thuật toán và công cụ sản xuất của hãng) đóng vai trò quyết định, quy định trực tiếp phương thức sinh hoạt và tư duy của tài xế. Do đó, để thay đổi tư duy của họ, ta buộc phải thay đổi các quan hệ sản xuất vật chất này trước."
                : "Tiền đề hoặc kết luận bạn chọn đang rơi vào phương pháp luận siêu hình (tách rời ý thức tài xế ra khỏi công cụ lao động thực tế) hoặc duy tâm chủ quan (nghĩ rằng chỉ cần thay đổi tinh thần là cuộc sống tự tốt lên). Triết học Mác - Lênin nhấn mạnh vật chất quyết định ý thức, thực tiễn quyết định nhận thức. Hãy nhấn nút Quay lại để thử lập luận lại."}
            </ThemedText>
          </Card>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {isValid ? (
          <Button
            title="Tiếp tục: Tri thức Chương 1"
            onPress={handleContinue}
            style={{ flex: 1, backgroundColor: theme.primary }}
          />
        ) : (
          <Button
            title="Quay lại xây dựng lại lập luận"
            onPress={() => router.back()}
            style={{ flex: 1, backgroundColor: theme.backgroundElement }}
          />
        )}
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
    justifyContent: "center",
  },
  resultContainer: {
    alignItems: "center",
    gap: Spacing.four,
    paddingTop: Spacing.four,
  },
  badgeContainer: {
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: "center",
    lineHeight: 18,
    marginTop: 4,
  },
  explanationCard: {
    borderWidth: 1,
    padding: Spacing.four,
    width: "100%",
  },
  explanationText: {
    lineHeight: 22,
    color: "#E5E7EB",
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});
