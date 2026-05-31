import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Cpu, Scale, Coins, Globe, Sparkles, Share2, Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { apiRequest } from "@/services/api";
import { TopicPerspectiveDTO, PerspectiveType } from "@philo-mind/shared";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  surfaceSoft: "#18181B",
  chip: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  primaryText: "#0C0C0E",
};

// Cấu hình UI cho từng góc nhìn
const PERSPECTIVE_CONFIGS = {
  [PerspectiveType.TECH]: {
    name: "CÔNG NGHỆ & ĐỔI MỚI",
    icon: Cpu,
    color: "#D97706",
  },
  [PerspectiveType.ETHICAL]: {
    name: "ĐẠO ĐỨC & CÔNG LÝ",
    icon: Scale,
    color: "#3B82F6",
  },
  [PerspectiveType.ECONOMIC]: {
    name: "KINH TẾ & TÀI NGUYÊN",
    icon: Coins,
    color: "#10B981",
  },
  [PerspectiveType.SOCIAL]: {
    name: "XÃ HỘI & CỘNG ĐỒNG",
    icon: Globe,
    color: "#8B5CF6",
  },
  [PerspectiveType.PHILOSOPHICAL]: {
    name: "TRIẾT HỌC CỐT LÕI",
    icon: Sparkles,
    color: "#EC4899",
  },
};

export default function TopicPerspectivesScreen() {
  const router = useRouter();
  const { topicId, topicTitle } = useLocalSearchParams<{
    topicId: string;
    topicTitle: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perspectives, setPerspectives] = useState<TopicPerspectiveDTO[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [agreeType, setAgreeType] = useState<PerspectiveType | null>(null);

  function goBackOrHome() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/explore");
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest<TopicPerspectiveDTO[]>(`/topics/${topicId}/perspectives`);

        // Sắp xếp góc nhìn theo thứ tự chuẩn
        const order = [
          PerspectiveType.TECH,
          PerspectiveType.ETHICAL,
          PerspectiveType.ECONOMIC,
          PerspectiveType.SOCIAL,
          PerspectiveType.PHILOSOPHICAL,
        ];

        const sorted = data.sort(
          (a, b) => order.indexOf(a.perspectiveType) - order.indexOf(b.perspectiveType),
        );

        setPerspectives(sorted);
      } catch (err: any) {
        setError(err?.message ?? "Không thể tải góc nhìn của chủ đề");
      } finally {
        setLoading(false);
      }
    }

    if (topicId) {
      loadData();
    }
  }, [topicId]);

  // Chia sẻ góc nhìn hiện tại
  async function handleShare() {
    if (perspectives.length === 0) return;
    const current = perspectives[activeIndex];
    const config = PERSPECTIVE_CONFIGS[current.perspectiveType];
    try {
      await Share.share({
        message: `[PhiloMind - Góc nhìn ${config.name} về ${topicTitle}]\n\n"${current.content}"`,
      });
    } catch {
      // Bỏ qua lỗi hoặc log ra console
    }
  }

  // Chuyển sang góc nhìn tiếp theo
  function handleNext() {
    if (activeIndex < perspectives.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      goBackOrHome();
    }
  }

  // Hàm highlight các khái niệm triết học cốt lõi
  function renderHighlightedContent(content: string) {
    const keyTerms = [
      "Khắc kỷ",
      "Siêu hình học",
      "Đạo đức học",
      "Đạo đức",
      "Lý tính",
      "Hạnh phúc",
      "Công nghệ",
      "Trí tuệ nhân tạo",
      "Kinh tế",
      "Xã hội",
      "Triết học",
      "Socrates",
      "Kant",
      "Aristotle",
      "thực dụng",
      "nghĩa vụ",
      "đức hạnh",
    ];

    const regex = new RegExp(`(${keyTerms.join("|")})`, "gi");
    const parts = content.split(regex);

    return parts.map((part, index) => {
      const isKeyword = keyTerms.some((term) => term.toLowerCase() === part.toLowerCase());
      if (isKeyword) {
        return (
          <ThemedText key={index} style={{ color: Colors.primaryLight, fontWeight: "800" }}>
            {part}
          </ThemedText>
        );
      }
      return part;
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={styles.loadingText}>Đang tải góc nhìn đa chiều...</ThemedText>
      </View>
    );
  }

  if (error || perspectives.length === 0) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorTitle}>Lỗi tải dữ liệu</ThemedText>
          <ThemedText style={styles.errorText}>
            {error ?? "Chủ đề này chưa được cập nhật góc nhìn."}
          </ThemedText>
          <Pressable style={styles.backButton} onPress={goBackOrHome}>
            <ThemedText style={styles.backButtonText}>Quay lại</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const activePerspective = perspectives[activeIndex];
  const activeConfig = PERSPECTIVE_CONFIGS[activePerspective.perspectiveType];
  const ActiveIcon = activeConfig.icon;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header bar */}
        <View style={styles.header}>
          <Pressable onPress={goBackOrHome} style={styles.iconBtn}>
            <ArrowLeft color={Colors.text} size={20} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Góc nhìn đa chiều</ThemedText>
          <View style={{ width: 20 }} />
        </View>

        {/* 5-step progress indicator */}
        <View style={styles.timelineContainer}>
          {perspectives.map((p, idx) => (
            <View
              key={p.id}
              style={[
                styles.timelineSegment,
                idx <= activeIndex && { backgroundColor: Colors.primary },
              ]}
            />
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ThemedText style={styles.sectionSubtitle}>PHẦN {activeIndex + 1}: PHÂN TÍCH</ThemedText>
          <ThemedText style={styles.instruction}>Mỗi trường phái phân tích khác nhau:</ThemedText>

          {/* Perspective Card */}
          <View style={[styles.perspectiveCard, { borderLeftColor: activeConfig.color }]}>
            <View style={styles.cardHeader}>
              <ActiveIcon color={activeConfig.color} size={18} />
              <ThemedText style={[styles.cardCategory, { color: activeConfig.color }]}>
                {activeConfig.name}
              </ThemedText>
            </View>

            {/* Quote container */}
            <View style={styles.quoteBlock}>
              <ThemedText style={styles.quoteMark}>“</ThemedText>
              <ThemedText style={styles.quoteText}>
                {renderHighlightedContent(activePerspective.content)}
              </ThemedText>
              <ThemedText style={[styles.quoteMark, { textAlign: "right" }]}>”</ThemedText>
            </View>
          </View>

          {/* User agreement interactive section */}
          <View style={styles.pollSection}>
            <ThemedText style={styles.pollLabel}>Bạn đồng ý nhất với?</ThemedText>
            <View style={styles.pollButtons}>
              {perspectives.map((p, idx) => {
                const cfg = PERSPECTIVE_CONFIGS[p.perspectiveType];
                const Icon = cfg.icon;
                const isSelected = agreeType === p.perspectiveType;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => {
                      setAgreeType(p.perspectiveType);
                      setActiveIndex(idx);
                    }}
                    style={[
                      styles.pollIconBtn,
                      isSelected && {
                        borderColor: cfg.color,
                        backgroundColor: cfg.color + "22",
                      },
                    ]}
                  >
                    {isSelected ? (
                      <Check color={cfg.color} size={18} />
                    ) : (
                      <Icon color={Colors.muted} size={18} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Action Button Row */}
        <View style={styles.actionsBar}>
          <Pressable style={styles.shareBtn} onPress={handleShare}>
            <Share2 color={Colors.text} size={18} />
            <ThemedText style={styles.shareBtnText}>CHIA SẺ</ThemedText>
          </Pressable>

          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <ThemedText style={styles.nextBtnText}>
              {activeIndex < perspectives.length - 1 ? "ĐI SÂU PHÂN TÍCH" : "HOÀN THÀNH"}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: Colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  errorTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  errorText: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  backButtonText: {
    color: Colors.primaryText,
    fontWeight: "800",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  timelineContainer: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  timelineSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.chip,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  sectionSubtitle: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
  },
  instruction: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  perspectiveCard: {
    backgroundColor: Colors.surfaceSoft,
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderTopColor: Colors.border,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: "900",
  },
  quoteBlock: {
    gap: 4,
  },
  quoteMark: {
    color: Colors.muted,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 24,
  },
  quoteText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    fontStyle: "italic",
  },
  pollSection: {
    marginTop: 20,
    gap: 12,
  },
  pollLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  pollButtons: {
    flexDirection: "row",
    gap: 12,
  },
  pollIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  shareBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    height: 48,
  },
  shareBtnText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 48,
  },
  nextBtnText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: "900",
  },
});
