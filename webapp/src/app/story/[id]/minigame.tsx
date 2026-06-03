import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Trophy,
  XCircle,
} from "lucide-react-native";
import { useState, useMemo } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import {
  minigameCatalog,
  defaultMinigameData,
  type ClueChallengePuzzle,
} from "@/features/story/minigameData";

type GamePhase = "intro" | "playing" | "feedback" | "results";

export default function MinigameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  // TODO: swap to RTK Query GET /minigames/:storyId when backend available
  const { data: story, isLoading, error } = useGetStoryDetailQuery(storyId);
  const { setMinigameScore } = useStoryStore();

  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answeredPuzzles, setAnsweredPuzzles] = useState<
    { puzzle: ClueChallengePuzzle; chosenIndex: number; correct: boolean }[]
  >([]);

  const minigameData = useMemo(() => {
    if (!story) return null;
    return minigameCatalog[story.title] ?? defaultMinigameData(story.title);
  }, [story]);

  const currentPuzzle: ClueChallengePuzzle | undefined = minigameData?.puzzles[currentPuzzleIndex];

  const totalPuzzles = minigameData?.puzzles.length ?? 0;
  const score = answeredPuzzles.filter((a) => a.correct).length;
  const isLastPuzzle = currentPuzzleIndex === totalPuzzles - 1;

  const handleStartGame = () => {
    setPhase("playing");
    setCurrentPuzzleIndex(0);
    setSelectedOptionIndex(null);
    setAnsweredPuzzles([]);
  };

  const handleSelectOption = (index: number) => {
    if (phase !== "playing") return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || !currentPuzzle) return;
    const correct = selectedOptionIndex === currentPuzzle.correctIndex;
    setAnsweredPuzzles((prev) => [
      ...prev,
      { puzzle: currentPuzzle, chosenIndex: selectedOptionIndex, correct },
    ]);
    setPhase("feedback");
  };

  const handleNextPuzzle = () => {
    if (isLastPuzzle) {
      const finalScore = answeredPuzzles.filter((a) => a.correct).length;
      // count the current puzzle answer too
      const lastCorrect = selectedOptionIndex === currentPuzzle?.correctIndex ? 1 : 0;
      const total = finalScore + lastCorrect;
      setMinigameScore(total);
      setPhase("results");
    } else {
      setCurrentPuzzleIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setPhase("playing");
    }
  };

  const lastAnswer = answeredPuzzles[answeredPuzzles.length - 1];

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
            Đang tải Clue Challenge...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error || !story || !minigameData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ThemedText type="subtitle" style={{ color: theme.danger }}>
            Không thể tải mini game
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", marginVertical: Spacing.three }}
          >
            Đã xảy ra lỗi khi tải câu đố. Vui lòng quay lại bản đồ.
          </ThemedText>
          <Button
            title="Quay lại bản đồ"
            onPress={() => router.replace(`/story/${storyId}/map` as never)}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(`/story/${storyId}/encounter` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">{minigameData.title}</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 7/7 • {story.title}
          </ThemedText>
        </View>
        {/* Score badge */}
        {phase !== "intro" && phase !== "results" && (
          <View style={[styles.scoreBadge, { backgroundColor: "rgba(217,119,6,0.15)" }]}>
            <ThemedText type="label" style={{ color: theme.primary, fontWeight: "800" }}>
              {score}/{answeredPuzzles.length}
            </ThemedText>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Phase: Intro ─────────────────────────────────────────────── */}
        {phase === "intro" && (
          <View style={styles.phaseContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(217,119,6,0.1)" }]}>
              <BookOpen color={theme.primary} size={44} />
            </View>

            <ThemedText type="subtitle" style={styles.introTitle}>
              {minigameData.title}
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary" style={styles.introDesc}>
              {minigameData.description}
            </ThemedText>

            {/* Tag badges showing puzzle count (acceptance criteria) */}
            <View style={styles.badgeRow}>
              <View style={[styles.tagBadge, { backgroundColor: "rgba(217,119,6,0.15)" }]}>
                <ThemedText
                  type="label"
                  style={{ color: theme.primary, fontWeight: "800", fontSize: 11 }}
                >
                  {totalPuzzles} CÂU ĐỐ
                </ThemedText>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
                <ThemedText
                  type="label"
                  style={{ color: theme.info, fontWeight: "800", fontSize: 11 }}
                >
                  TRIẾT HỌC
                </ThemedText>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
                <ThemedText
                  type="label"
                  style={{ color: theme.success, fontWeight: "800", fontSize: 11 }}
                >
                  CLUE CHALLENGE
                </ThemedText>
              </View>
            </View>

            {/* Puzzle list preview */}
            {minigameData.puzzles.map((puzzle, idx) => (
              <Card
                key={puzzle.id}
                style={[
                  styles.puzzlePreviewCard,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                ]}
              >
                <View style={styles.puzzlePreviewRow}>
                  <View
                    style={[styles.puzzleIndexBadge, { backgroundColor: "rgba(217,119,6,0.2)" }]}
                  >
                    <ThemedText type="label" style={{ color: theme.primary, fontWeight: "800" }}>
                      {idx + 1}
                    </ThemedText>
                  </View>
                  <View style={{ flex: 1 }}>
                    {/* Philosopher tag badge (acceptance criteria) */}
                    <View style={styles.philosopherBadgeRow}>
                      <View style={[styles.tagBadge, { backgroundColor: "rgba(139,92,246,0.15)" }]}>
                        <ThemedText
                          type="label"
                          style={{ color: "#8B5CF6", fontWeight: "800", fontSize: 10 }}
                        >
                          {puzzle.philosopherName.toUpperCase()}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      numberOfLines={2}
                      style={{ lineHeight: 18 }}
                    >
                      {puzzle.clue}
                    </ThemedText>
                  </View>
                </View>
              </Card>
            ))}

            <Button
              title="Bắt đầu Clue Challenge"
              onPress={handleStartGame}
              fullWidth
              style={{ marginTop: Spacing.two }}
            />
          </View>
        )}

        {/* ─── Phase: Playing ───────────────────────────────────────────── */}
        {phase === "playing" && currentPuzzle && (
          <View style={styles.phaseContainer}>
            {/* Progress bar */}
            <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${(currentPuzzleIndex / totalPuzzles) * 100}%`,
                  },
                ]}
              />
            </View>
            <ThemedText type="label" themeColor="textSecondary" style={styles.progressLabel}>
              Câu {currentPuzzleIndex + 1} / {totalPuzzles}
            </ThemedText>

            {/* Clue card */}
            <Card
              style={[
                styles.clueCard,
                { backgroundColor: "rgba(217,119,6,0.05)", borderColor: "rgba(217,119,6,0.3)" },
              ]}
            >
              <View style={styles.clueHeader}>
                <HelpCircle size={18} color={theme.primary} />
                <ThemedText type="label" style={{ color: theme.primaryLight, fontWeight: "800" }}>
                  MANH MỐI
                </ThemedText>
              </View>
              <ThemedText type="small" style={{ lineHeight: 22, marginTop: Spacing.one }}>
                {currentPuzzle.clue}
              </ThemedText>
            </Card>

            {/* Philosopher hint tag (acceptance criteria) */}
            <View style={styles.hintTagRow}>
              <View style={[styles.tagBadge, { backgroundColor: "rgba(139,92,246,0.15)" }]}>
                <ThemedText
                  type="label"
                  style={{ color: "#8B5CF6", fontWeight: "800", fontSize: 10 }}
                >
                  GỢI Ý: {currentPuzzle.philosopherHint}
                </ThemedText>
              </View>
            </View>

            {/* Options — glow on selected (acceptance criteria) */}
            <ThemedText
              type="smallBold"
              style={{ marginTop: Spacing.two, marginBottom: Spacing.one }}
            >
              Chọn đáp án đúng:
            </ThemedText>

            {currentPuzzle.options.map((option, idx) => {
              const isSelected = idx === selectedOptionIndex;
              return (
                <Pressable
                  key={idx}
                  accessibilityRole="button"
                  onPress={() => handleSelectOption(idx)}
                  style={[
                    styles.optionButton,
                    {
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected
                        ? "rgba(217,119,6,0.08)"
                        : theme.backgroundElement,
                      // glow selection (acceptance criteria)
                      shadowColor: isSelected ? theme.primary : "transparent",
                      shadowOpacity: isSelected ? 0.3 : 0,
                      shadowRadius: isSelected ? 8 : 0,
                      elevation: isSelected ? 6 : 1,
                    },
                  ]}
                >
                  <View style={styles.optionRow}>
                    <View
                      style={[
                        styles.optionIndex,
                        {
                          backgroundColor: isSelected
                            ? "rgba(217,119,6,0.25)"
                            : "rgba(255,255,255,0.05)",
                          borderColor: isSelected ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <ThemedText
                        type="label"
                        style={{
                          color: isSelected ? theme.primary : theme.textMuted,
                          fontWeight: "800",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </ThemedText>
                    </View>
                    {/* min 20 chars enforced in data (acceptance criteria) */}
                    <ThemedText type="small" style={[styles.optionText, { lineHeight: 20 }]}>
                      {option}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}

            <Button
              title="Xác nhận đáp án"
              onPress={handleSubmitAnswer}
              disabled={selectedOptionIndex === null}
              fullWidth
              style={{ marginTop: Spacing.three }}
            />
          </View>
        )}

        {/* ─── Phase: Feedback ──────────────────────────────────────────── */}
        {phase === "feedback" && currentPuzzle && lastAnswer && (
          <View style={styles.phaseContainer}>
            {/* Result banner */}
            <Card
              style={[
                styles.resultBanner,
                {
                  backgroundColor: lastAnswer.correct
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.08)",
                  borderColor: lastAnswer.correct ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
                },
              ]}
            >
              <View style={styles.resultBannerHeader}>
                {lastAnswer.correct ? (
                  <CheckCircle2 color={theme.success} size={24} />
                ) : (
                  <XCircle color={theme.danger} size={24} />
                )}
                <ThemedText
                  type="smallBold"
                  style={{ color: lastAnswer.correct ? theme.success : theme.danger }}
                >
                  {lastAnswer.correct ? "Chính xác!" : "Chưa đúng"}
                </ThemedText>
              </View>
            </Card>

            {/* Answer review */}
            <ThemedText type="smallBold" style={{ marginTop: Spacing.three }}>
              Đáp án của bạn:
            </ThemedText>
            <Card
              style={[
                styles.answerCard,
                {
                  borderColor: lastAnswer.correct ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
                  backgroundColor: lastAnswer.correct
                    ? "rgba(16,185,129,0.05)"
                    : "rgba(239,68,68,0.05)",
                },
              ]}
            >
              <ThemedText type="small" style={{ lineHeight: 20 }}>
                {currentPuzzle.options[lastAnswer.chosenIndex]}
              </ThemedText>
            </Card>

            {!lastAnswer.correct && (
              <>
                <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
                  Đáp án đúng:
                </ThemedText>
                <Card
                  style={[
                    styles.answerCard,
                    {
                      borderColor: "rgba(16,185,129,0.4)",
                      backgroundColor: "rgba(16,185,129,0.05)",
                    },
                  ]}
                >
                  <ThemedText type="small" style={{ lineHeight: 20 }}>
                    {currentPuzzle.options[currentPuzzle.correctIndex]}
                  </ThemedText>
                </Card>
              </>
            )}

            {/* Explanation with philosopher hint tag (acceptance criteria) */}
            <Card
              style={[
                styles.explanationCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <View style={styles.philosopherBadgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: "rgba(139,92,246,0.15)" }]}>
                  <ThemedText
                    type="label"
                    style={{ color: "#8B5CF6", fontWeight: "800", fontSize: 10 }}
                  >
                    {currentPuzzle.philosopherName.toUpperCase()}
                  </ThemedText>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: "rgba(217,119,6,0.15)" }]}>
                  <ThemedText
                    type="label"
                    style={{ color: theme.primary, fontWeight: "800", fontSize: 10 }}
                  >
                    GIẢI THÍCH
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={{ lineHeight: 20, marginTop: Spacing.one }}
              >
                {currentPuzzle.explanation}
              </ThemedText>
            </Card>

            <Button
              title={
                isLastPuzzle
                  ? "Xem kết quả →"
                  : `Câu tiếp theo (${currentPuzzleIndex + 2}/${totalPuzzles}) →`
              }
              onPress={handleNextPuzzle}
              fullWidth
              style={{ marginTop: Spacing.two }}
            />
          </View>
        )}

        {/* ─── Phase: Results ───────────────────────────────────────────── */}
        {phase === "results" && (
          <View style={styles.phaseContainer}>
            <View style={styles.trophyWrapper}>
              <Trophy
                color={score >= totalPuzzles * 0.6 ? theme.primary : theme.textMuted}
                size={56}
              />
            </View>

            <ThemedText type="subtitle" style={styles.resultsTitle}>
              {score >= totalPuzzles * 0.8
                ? "Xuất sắc! Nhà triết học tương lai!"
                : score >= totalPuzzles * 0.6
                  ? "Tốt lắm! Bạn đã nắm vững các khái niệm!"
                  : "Hoàn thành! Hãy ôn lại các khái niệm thêm."}
            </ThemedText>

            {/* Score card */}
            <Card
              style={[
                styles.scoreCard,
                {
                  backgroundColor: "rgba(217,119,6,0.06)",
                  borderColor: "rgba(217,119,6,0.3)",
                },
              ]}
            >
              <ThemedText
                type="label"
                themeColor="textSecondary"
                style={{ textAlign: "center", marginBottom: Spacing.one }}
              >
                Điểm số
              </ThemedText>
              <ThemedText style={[styles.scoreNumber, { color: theme.primary }]}>
                {score}/{totalPuzzles}
              </ThemedText>
              <ThemedText
                type="label"
                themeColor="textSecondary"
                style={{ textAlign: "center", marginTop: Spacing.one }}
              >
                {Math.round((score / totalPuzzles) * 100)}% chính xác
              </ThemedText>
            </Card>

            {/* Answer summary tags (acceptance criteria) */}
            <View style={styles.summaryTagRow}>
              {answeredPuzzles.map((a, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: a.correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    },
                  ]}
                >
                  <ThemedText
                    type="label"
                    style={{
                      color: a.correct ? theme.success : theme.danger,
                      fontWeight: "800",
                      fontSize: 10,
                    }}
                  >
                    #{idx + 1} {a.correct ? "✓" : "✗"}
                  </ThemedText>
                </View>
              ))}
            </View>

            <Button
              title="Tiến đến Phản Tư →"
              onPress={() => router.push(`/story/${storyId}/reflect` as never)}
              fullWidth
              style={{ marginTop: Spacing.three }}
            />
            <Button
              title="Về Bản Đồ"
              onPress={() => router.replace(`/story/${storyId}/map` as never)}
              variant="outline"
              fullWidth
              style={{ marginTop: Spacing.two }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.six,
  },
  phaseContainer: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  // Intro
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.two,
  },
  introTitle: {
    fontWeight: "900",
    textAlign: "center",
    marginBottom: Spacing.one,
  },
  introDesc: {
    lineHeight: 18,
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  tagBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  puzzlePreviewCard: {
    padding: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  puzzlePreviewRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
  },
  puzzleIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  philosopherBadgeRow: {
    flexDirection: "row",
    gap: Spacing.one,
    flexWrap: "wrap",
    marginBottom: Spacing.one,
  },
  // Playing
  progressBarTrack: {
    height: 6,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    borderRadius: Radius.full,
    minWidth: 6,
  },
  progressLabel: {
    textAlign: "right",
    marginTop: 2,
  },
  clueCard: {
    padding: Spacing.three,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  clueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: 2,
  },
  hintTagRow: {
    marginTop: Spacing.one,
  },
  optionButton: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    shadowOffset: { width: 0, height: 3 },
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  optionIndex: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
  },
  // Feedback
  resultBanner: {
    padding: Spacing.three,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
  },
  resultBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  answerCard: {
    padding: Spacing.three,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    marginTop: Spacing.one,
  },
  explanationCard: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.lg,
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  // Results
  trophyWrapper: {
    alignItems: "center",
    marginBottom: Spacing.two,
    marginTop: Spacing.two,
  },
  resultsTitle: {
    fontWeight: "900",
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  scoreCard: {
    padding: Spacing.four,
    borderWidth: 1.5,
    borderRadius: Radius.xl,
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 52,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 60,
  },
  summaryTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    justifyContent: "center",
    marginTop: Spacing.one,
  },
});
