import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  HelpCircle,
  Trophy,
  XCircle,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useStoryStore } from "@/stores/story.store";

// ── Quiz Question Types ──────────────────────────────────────
type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuizQuestion = {
  id: string;
  question: string;
  explanation: string;
  options: QuizOption[];
};

// ── Generate quiz from story learn cards ─────────────────────
function generateQuizFromStory(story: {
  title: string;
  learnCards?: { title: string; body: string }[];
  choices?: { choiceText: string }[];
}): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const learnCards = story.learnCards ?? [];

  // Generate questions from learn cards (up to 3)
  for (let i = 0; i < Math.min(learnCards.length, 3); i++) {
    const card = learnCards[i];
    questions.push({
      id: `q-learn-${i}`,
      question: `Khái niệm "${card.title}" liên quan đến nội dung nào?`,
      explanation: card.body.slice(0, 120) + "...",
      options: [
        { id: `o-${i}-a`, text: card.title, isCorrect: true },
        {
          id: `o-${i}-b`,
          text: i > 0 ? learnCards[i - 1].title : "Chủ nghĩa thực dụng",
          isCorrect: false,
        },
        {
          id: `o-${i}-c`,
          text: i < learnCards.length - 1 ? learnCards[i + 1].title : "Hiện tượng luận",
          isCorrect: false,
        },
      ],
    });
  }

  // Add 1 question about the story title
  questions.push({
    id: "q-story-title",
    question: `Kịch bản "${story.title}" thuộc về chủ đề triết học nào?`,
    explanation: `Kịch bản này tập trung vào ${story.title.toLowerCase()}.`,
    options: [
      { id: "o-st-a", text: story.title, isCorrect: true },
      { id: "o-st-b", text: "Triết học ngôn ngữ", isCorrect: false },
      { id: "o-st-c", text: "Mỹ học phương Đông", isCorrect: false },
    ],
  });

  // Add 1 question about making choices
  if (story.choices && story.choices.length > 0) {
    questions.push({
      id: "q-choice",
      question: "Trong kịch bản này, yếu tố nào quan trọng nhất khi ra quyết định?",
      explanation: "Mỗi lựa chọn đều dẫn tới hệ quả khác nhau về đạo đức và xã hội.",
      options: [
        {
          id: "o-ch-a",
          text: "Cân nhắc hệ quả đạo đức và triết học",
          isCorrect: true,
        },
        {
          id: "o-ch-b",
          text: "Luôn chọn phương án an toàn nhất",
          isCorrect: false,
        },
        {
          id: "o-ch-c",
          text: "Làm theo số đông",
          isCorrect: false,
        },
      ],
    });
  }

  return questions;
}

// ── Phase Type ───────────────────────────────────────────────
type QuizPhase = "answering" | "review" | "complete";

// ── Main Component ───────────────────────────────────────────
export default function StoryQuizScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { currentStory, setQuizScore, setStep } = useStoryStore();

  // ── State ───────────────────────────────────────────────────
  const [phase, setPhase] = useState<QuizPhase>("answering");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // ── Animations ──────────────────────────────────────────────
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [scoreAnim] = useState(() => new Animated.Value(0));

  const questions = useMemo(
    () => (currentStory ? generateQuizFromStory(currentStory) : []),
    [currentStory],
  );

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // ── Calculate score ─────────────────────────────────────────
  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      const answerId = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (answerId && correctOption && answerId === correctOption.id) {
        correct++;
      }
    }
    return correct;
  }, [answers, questions]);

  const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // ── Handlers ────────────────────────────────────────────────
  const handleSelectOption = useCallback((optionId: string) => {
    setSelectedOptionId(optionId);
    setShowExplanation(false);
  }, []);

  const handleConfirmAnswer = useCallback(() => {
    if (!currentQuestion || !selectedOptionId) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionId }));
    setShowExplanation(true);
  }, [currentQuestion, selectedOptionId]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setShowExplanation(false);
      }, 150);
    } else {
      // All questions answered — show results
      setPhase("complete");
      setQuizScore(score);

      // Animate score appearance
      Animated.spring(scoreAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex, totalQuestions, fadeAnim, score, scoreAnim, setQuizScore]);

  const handleContinueToComplete = useCallback(() => {
    setStep("reflect");
    router.push(`/story/${storyId}/reflect` as never);
  }, [router, storyId, setStep]);

  // ── Empty state ─────────────────────────────────────────────
  if (!currentStory || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Card style={styles.emptyCard}>
          <HelpCircle color={theme.textMuted} size={40} />
          <ThemedText type="smallBold" style={styles.centerText}>
            Không thể tạo câu hỏi
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            Dữ liệu kịch bản chưa đầy đủ để tạo bài trắc nghiệm.
          </ThemedText>
          <Button
            title="Bỏ qua → Hoàn thành"
            onPress={() => {
              setQuizScore(0);
              setStep("reflect");
              router.push(`/story/${storyId}/reflect` as never);
            }}
            variant="primary"
          />
        </Card>
      </SafeAreaView>
    );
  }

  // ── Results Phase ───────────────────────────────────────────
  if (phase === "complete") {
    const isPerfect = score === totalQuestions;
    const isGood = scorePercent >= 60;

    return (
      <SafeAreaView
        edges={["top"]}
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Animated.View
            style={[
              styles.resultsContent,
              {
                opacity: scoreAnim,
                transform: [
                  {
                    scale: scoreAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Trophy Icon */}
            <View
              style={[
                styles.trophyCircle,
                {
                  backgroundColor: isPerfect
                    ? "rgba(34, 197, 94, 0.15)"
                    : isGood
                      ? "rgba(249, 115, 22, 0.15)"
                      : "rgba(239, 68, 68, 0.15)",
                  borderColor: isPerfect ? theme.success : isGood ? theme.primary : theme.danger,
                },
              ]}
            >
              <Trophy
                color={isPerfect ? theme.success : isGood ? theme.primary : theme.danger}
                size={48}
              />
            </View>

            <ThemedText type="title" style={styles.resultsTitle}>
              {isPerfect ? "Xuất sắc!" : isGood ? "Khá tốt!" : "Hãy thử lại!"}
            </ThemedText>

            {/* Score Display */}
            <View style={styles.scoreRow}>
              <ThemedText
                type="title"
                style={[
                  styles.scoreNumber,
                  {
                    color: isPerfect ? theme.success : isGood ? theme.primary : theme.danger,
                  },
                ]}
              >
                {score}/{totalQuestions}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                câu trả lời đúng ({scorePercent}%)
              </ThemedText>
            </View>

            {/* Points earned */}
            <Card style={[styles.pointsCard, { borderColor: theme.primary }]}>
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                +{score * 10} điểm triết học
              </ThemedText>
              <ThemedText type="label" themeColor="textSecondary">
                Bạn đã nhận được {score * 10} điểm từ bài trắc nghiệm
              </ThemedText>
            </Card>

            {/* Answer Review */}
            <View style={styles.reviewList}>
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const correctOption = q.options.find((o) => o.isCorrect);
                const isCorrect = userAnswer === correctOption?.id;

                return (
                  <Card key={q.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      {isCorrect ? (
                        <CheckCircle2 color={theme.success} size={18} />
                      ) : (
                        <XCircle color={theme.danger} size={18} />
                      )}
                      <ThemedText type="label" themeColor="textSecondary">
                        Câu {idx + 1}
                      </ThemedText>
                    </View>
                    <ThemedText type="small" numberOfLines={2}>
                      {q.question}
                    </ThemedText>
                  </Card>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Button title="Tiếp tục → Hoàn thành" onPress={handleContinueToComplete} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  // ── Answering Phase ─────────────────────────────────────────
  const isAnswered = showExplanation;
  const correctOption = currentQuestion.options.find((o) => o.isCorrect);
  const isCorrectAnswer = selectedOptionId === correctOption?.id;

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Trắc nghiệm nhanh</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Câu {currentIndex + 1} / {totalQuestions}
          </ThemedText>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.primary,
              width: `${((currentIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%`,
            },
          ]}
        />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={styles.questionSection}>
          <View style={[styles.questionBadge, { backgroundColor: theme.backgroundElement }]}>
            <HelpCircle color={theme.primary} size={16} />
            <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
              Câu hỏi {currentIndex + 1}
            </ThemedText>
          </View>

          <ThemedText type="subtitle" style={styles.questionText}>
            {currentQuestion.question}
          </ThemedText>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isAnsweredCorrect = isAnswered && option.isCorrect;
            const isAnsweredWrong = isAnswered && isSelected && !option.isCorrect;

            let optionBg: string = theme.surface;
            let borderColor: string = theme.border;

            if (isAnsweredCorrect) {
              optionBg = "rgba(34, 197, 94, 0.12)";
              borderColor = theme.success;
            } else if (isAnsweredWrong) {
              optionBg = "rgba(239, 68, 68, 0.12)";
              borderColor = theme.danger;
            } else if (isSelected) {
              optionBg = "rgba(217, 119, 6, 0.12)";
              borderColor = theme.primary;
            }

            return (
              <Pressable
                key={option.id}
                disabled={isAnswered}
                onPress={() => handleSelectOption(option.id)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: optionBg,
                    borderColor,
                  },
                ]}
              >
                <View style={styles.optionContent}>
                  {isAnsweredCorrect ? (
                    <CheckCircle2 color={theme.success} size={20} />
                  ) : isAnsweredWrong ? (
                    <XCircle color={theme.danger} size={20} />
                  ) : (
                    <CircleDot color={isSelected ? theme.primary : theme.textMuted} size={20} />
                  )}
                  <ThemedText
                    type="small"
                    style={[styles.optionText, isSelected && { fontWeight: "600" }]}
                  >
                    {option.text}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Explanation */}
        {isAnswered && (
          <Card
            style={[
              styles.explanationCard,
              {
                borderColor: isCorrectAnswer ? theme.success : theme.danger,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{ color: isCorrectAnswer ? theme.success : theme.danger }}
            >
              {isCorrectAnswer ? "✓ Chính xác!" : "✗ Chưa đúng"}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.one }}>
              {currentQuestion.explanation}
            </ThemedText>
          </Card>
        )}
      </Animated.ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {!isAnswered ? (
          <Button
            title="Xác nhận"
            onPress={handleConfirmAnswer}
            disabled={!selectedOptionId}
            fullWidth
          />
        ) : (
          <Button
            title={currentIndex < totalQuestions - 1 ? "Câu tiếp theo" : "Xem kết quả"}
            onPress={handleNextQuestion}
            fullWidth
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    width: "100%",
    maxWidth: 400,
  },
  centerText: {
    textAlign: "center",
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
  progressTrack: {
    height: 4,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  questionSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  questionBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  questionText: {
    fontWeight: "700",
    lineHeight: 30,
  },
  optionsList: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  optionCard: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  optionText: {
    flex: 1,
    lineHeight: 22,
  },
  explanationCard: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.three,
    alignItems: "center",
  },
  // Results phase styles
  resultsContainer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  resultsContent: {
    alignItems: "center",
    paddingTop: Spacing.four * 2,
    paddingHorizontal: Spacing.four,
    width: "100%",
  },
  trophyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  resultsTitle: {
    fontWeight: "800",
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  scoreRow: {
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.four,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 56,
  },
  pointsCard: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    width: "100%",
    marginBottom: Spacing.four,
  },
  reviewList: {
    width: "100%",
    gap: Spacing.two,
  },
  reviewItem: {
    gap: Spacing.one,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
