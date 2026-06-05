import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Layers, RefreshCcw, RotateCcw } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/* ─── Flashcard data ─── */

interface FlashcardPair {
  id: string;
  front: { term: string; description: string; school: string };
  back: { term: string; description: string; school: string };
}

const flashcardPairs: FlashcardPair[] = [
  {
    id: "1",
    front: {
      term: "Duy vật biện chứng",
      description:
        "Vật chất có trước, ý thức có sau. Vật chất quyết định ý thức nhưng ý thức có tính độc lập tương đối và tác động ngược trở lại vật chất.",
      school: "Chủ nghĩa Mác – Lênin",
    },
    back: {
      term: "Duy vật siêu hình",
      description:
        "Thừa nhận vật chất có trước ý thức, nhưng xem xét sự vật trong trạng thái cô lập, tĩnh tại, không thấy mối liên hệ và sự phát triển.",
      school: "Triết học cận đại",
    },
  },
  {
    id: "2",
    front: {
      term: "Duy tâm chủ quan",
      description:
        "Ý thức, cảm giác của con người là cái có trước, sinh ra và quyết định sự tồn tại của thế giới vật chất.",
      school: "George Berkeley",
    },
    back: {
      term: "Duy tâm khách quan",
      description:
        "Có một thực thể tinh thần siêu việt (Ý niệm tuyệt đối, Thượng đế) tồn tại trước và độc lập với con người, sinh ra thế giới.",
      school: "Georg Hegel, Plato",
    },
  },
  {
    id: "3",
    front: {
      term: "Khả tri luận",
      description:
        "Con người có khả năng nhận thức được thế giới khách quan. Thực tiễn là tiêu chuẩn của chân lý.",
      school: "Duy vật biện chứng",
    },
    back: {
      term: "Bất khả tri luận",
      description:
        "Con người không thể nhận thức được bản chất của sự vật. Giác quan chỉ cho ta cảm giác, không phải sự vật tự nó.",
      school: "Immanuel Kant, David Hume",
    },
  },
  {
    id: "4",
    front: {
      term: "Vật chất",
      description:
        "Phạm trù triết học dùng để chỉ thực tại khách quan, tồn tại không phụ thuộc vào ý thức và được ý thức phản ánh.",
      school: "V.I. Lênin",
    },
    back: {
      term: "Ý thức",
      description:
        "Sự phản ánh hiện thực khách quan vào trong bộ não con người một cách năng động, sáng tạo. Là hình ảnh chủ quan của thế giới khách quan.",
      school: "Chủ nghĩa Mác – Lênin",
    },
  },
  {
    id: "5",
    front: {
      term: "Nguồn gốc nhận thức",
      description:
        "Triết học ra đời khi con người đạt đến trình độ tư duy trừu tượng nhất định, có khả năng khái quát hóa các hiện tượng tự nhiên.",
      school: "Nhận thức luận",
    },
    back: {
      term: "Nguồn gốc xã hội",
      description:
        "Triết học ra đời khi xã hội đã phân chia thành lao động trí óc và lao động chân tay, tạo điều kiện cho một bộ phận chuyên nghiên cứu lý luận.",
      school: "Lịch sử triết học",
    },
  },
  {
    id: "6",
    front: {
      term: "Mặt thứ nhất: Bản thể luận",
      description:
        "Giữa vật chất và ý thức, cái nào có trước, cái nào có sau, cái nào quyết định cái nào? Câu trả lời phân chia thành Duy vật và Duy tâm.",
      school: "Vấn đề cơ bản của Triết học",
    },
    back: {
      term: "Mặt thứ hai: Nhận thức luận",
      description:
        "Con người có khả năng nhận thức được thế giới hay không? Câu trả lời phân thành Khả tri luận và Bất khả tri luận.",
      school: "Vấn đề cơ bản của Triết học",
    },
  },
];

/* ─── Component ─── */

export default function FlashcardScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  const flipAnim = useMemo(() => new Animated.Value(0), []);

  const card = flashcardPairs[currentIndex];
  const progress = (currentIndex + 1) / flashcardPairs.length;
  const masteredCount = mastered.size;

  const doFlip = useCallback(() => {
    const nextFlipped = !isFlipped;
    Animated.spring(flipAnim, {
      toValue: nextFlipped ? 1 : 0,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
    setIsFlipped(nextFlipped);
  }, [flipAnim, isFlipped]);

  function goTo(index: number) {
    setIsFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex(index);
  }

  function goNext() {
    if (currentIndex < flashcardPairs.length - 1) {
      goTo(currentIndex + 1);
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }

  function toggleMastered() {
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) {
        next.delete(card.id);
      } else {
        next.add(card.id);
      }
      return next;
    });
  }

  function resetAll() {
    setMastered(new Set());
    goTo(0);
  }

  const frontRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const isMastered = mastered.has(card.id);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.background }}>
      <AppHeader title="Thẻ ghi nhớ" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Progress Bar */}
        <View style={s.progressRow}>
          <ThemedText type="small" themeColor="textMuted">
            {currentIndex + 1} / {flashcardPairs.length}
          </ThemedText>
          <ThemedText type="small" themeColor="success">
            Đã thuộc: {masteredCount}/{flashcardPairs.length}
          </ThemedText>
        </View>
        <View style={[s.progressTrack, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              s.progressFill,
              { width: `${progress * 100}%`, backgroundColor: theme.primary },
            ]}
          />
        </View>

        {/* Flashcard 3D Flip */}
        <Pressable onPress={doFlip} style={s.cardContainer}>
          {/* Front */}
          <Animated.View
            style={[
              s.card,
              {
                backgroundColor: theme.surface,
                borderColor: isMastered ? theme.success : theme.border,
                borderWidth: isMastered ? 2 : 1,
                transform: [{ perspective: 1000 }, { rotateY: frontRotation }],
                backfaceVisibility: "hidden",
              },
            ]}
          >
            <View style={[s.cardBadge, { backgroundColor: `${theme.primary}20` }]}>
              <ThemedText type="label" style={{ color: theme.primary, fontSize: 10 }}>
                MẶT TRƯỚC
              </ThemedText>
            </View>
            <ThemedText style={s.cardTerm}>{card.front.term}</ThemedText>
            <View style={[s.divider, { backgroundColor: theme.border }]} />
            <ThemedText style={s.cardDescription} themeColor="textSecondary">
              {card.front.description}
            </ThemedText>
            <View style={[s.schoolBadge, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textMuted">
                {card.front.school}
              </ThemedText>
            </View>
            <View style={s.tapHint}>
              <RotateCcw color={theme.textMuted} size={14} />
              <ThemedText type="small" themeColor="textMuted">
                Chạm để lật thẻ
              </ThemedText>
            </View>
          </Animated.View>

          {/* Back */}
          <Animated.View
            style={[
              s.card,
              s.cardBack,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: isMastered ? theme.success : theme.primary,
                borderWidth: isMastered ? 2 : 1,
                transform: [{ perspective: 1000 }, { rotateY: backRotation }],
                backfaceVisibility: "hidden",
              },
            ]}
          >
            <View style={[s.cardBadge, { backgroundColor: `${theme.danger}20` }]}>
              <ThemedText type="label" style={{ color: theme.danger, fontSize: 10 }}>
                MẶT SAU — ĐỐI LẬP
              </ThemedText>
            </View>
            <ThemedText style={s.cardTerm}>{card.back.term}</ThemedText>
            <View style={[s.divider, { backgroundColor: theme.border }]} />
            <ThemedText style={s.cardDescription} themeColor="textSecondary">
              {card.back.description}
            </ThemedText>
            <View style={[s.schoolBadge, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textMuted">
                {card.back.school}
              </ThemedText>
            </View>
            <View style={s.tapHint}>
              <RotateCcw color={theme.textMuted} size={14} />
              <ThemedText type="small" themeColor="textMuted">
                Chạm để lật lại
              </ThemedText>
            </View>
          </Animated.View>
        </Pressable>

        {/* Action Buttons */}
        <View style={s.actions}>
          <Pressable
            style={[s.navBtn, { backgroundColor: theme.backgroundElement }]}
            onPress={goPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft color={currentIndex === 0 ? theme.textMuted : theme.text} size={20} />
          </Pressable>

          <Pressable
            style={[
              s.masteredBtn,
              {
                backgroundColor: isMastered ? `${theme.success}20` : theme.backgroundElement,
                borderColor: isMastered ? theme.success : theme.border,
              },
            ]}
            onPress={toggleMastered}
          >
            <ThemedText type="smallBold" style={{ color: isMastered ? theme.success : theme.text }}>
              {isMastered ? "✓ Đã thuộc" : "Đánh dấu đã thuộc"}
            </ThemedText>
          </Pressable>

          <Pressable
            style={[s.navBtn, { backgroundColor: theme.backgroundElement }]}
            onPress={goNext}
            disabled={currentIndex === flashcardPairs.length - 1}
          >
            <ChevronRight
              color={currentIndex === flashcardPairs.length - 1 ? theme.textMuted : theme.text}
              size={20}
            />
          </Pressable>
        </View>

        {/* Card Dots */}
        <View style={s.dots}>
          {flashcardPairs.map((pair, i) => (
            <Pressable
              key={pair.id}
              onPress={() => goTo(i)}
              style={[
                s.dot,
                {
                  backgroundColor:
                    i === currentIndex
                      ? theme.primary
                      : mastered.has(pair.id)
                        ? theme.success
                        : theme.backgroundElement,
                },
              ]}
            />
          ))}
        </View>

        {/* Summary Card */}
        {masteredCount === flashcardPairs.length && (
          <View
            style={[s.summaryCard, { backgroundColor: theme.surface, borderColor: theme.success }]}
          >
            <Layers color={theme.success} size={28} />
            <ThemedText style={s.summaryTitle}>
              🎉 Xuất sắc! Bạn đã thuộc tất cả {flashcardPairs.length} cặp thuật ngữ!
            </ThemedText>
            <View style={s.summaryActions}>
              <Button title="Ôn lại" variant="outline" onPress={resetAll} />
              <Button title="Quay lại Học tập" onPress={() => router.back()} />
            </View>
          </View>
        )}

        {/* Bottom reset */}
        {masteredCount > 0 && masteredCount < flashcardPairs.length && (
          <Pressable style={s.resetRow} onPress={resetAll}>
            <RefreshCcw color={theme.textMuted} size={14} />
            <ThemedText type="small" themeColor="textMuted">
              Đặt lại tiến trình
            </ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */

const s = StyleSheet.create({
  content: {
    padding: Spacing.three,
    paddingBottom: 120,
    gap: Spacing.three,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  cardContainer: {
    height: 340,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: Radius.lg,
    padding: Spacing.four,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.three,
  },
  cardBack: {
    position: "absolute",
  },
  cardBadge: {
    position: "absolute",
    top: Spacing.three,
    left: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  cardTerm: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: Fonts.sans,
    textAlign: "center",
    lineHeight: 30,
  },
  divider: {
    width: 48,
    height: 2,
    borderRadius: 1,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: Spacing.two,
  },
  schoolBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  tapHint: {
    position: "absolute",
    bottom: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  masteredBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  summaryCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  summaryActions: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
});
