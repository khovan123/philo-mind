import { useRouter } from "expo-router";
import { Gamepad2, GitBranch, Heart } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { QuizCard } from "@/features/quiz/QuizCard";
import { QuizFilters } from "@/features/quiz/QuizFilters";
import { QuizListEmpty } from "@/features/quiz/QuizListEmpty";
import { QuizListStats } from "@/features/quiz/QuizListStats";
import { QuizSearchBox } from "@/features/quiz/QuizSearchBox";
import { quizSummaries } from "@/features/quiz/mock";
import type { QuizSummary } from "@/features/quiz/types";
import { quizStyles as styles } from "@/features/quiz/ui";
import { useTheme } from "@/hooks/use-theme";
import { useListQuizzesQuery } from "@/services/rtk-api/quiz.api";

const filters = ["Tất cả", "Triết học", "Lịch sử", "Đạo đức", "Chính trị", "Đã hoàn thành"];

export default function LearnScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const {
    data: apiQuizzes,
    isLoading,
    isError,
    refetch,
  } = useListQuizzesQuery({
    search: query || undefined,
    status: activeFilter === "Đã hoàn thành" ? "completed" : undefined,
  });
  const quizzes = apiQuizzes && apiQuizzes.length > 0 ? apiQuizzes : quizSummaries;

  const filteredQuizzes = useMemo(
    () => quizzes.filter((quiz) => matchesQuiz(quiz, query, activeFilter)),
    [activeFilter, query, quizzes],
  );

  function openQuiz(quiz: QuizSummary) {
    if (quiz.status !== "locked") {
      router.push(`/quiz/${quiz.lessonId}` as never);
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <ThemedText style={styles.brand}>Câu hỏi</ThemedText>
          <View style={styles.headerSide} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View>
            <ThemedText style={styles.title}>Học tập</ThemedText>
            <ThemedText style={styles.subtitle}>
              Kiểm tra hiểu biết và rèn luyện tư duy của bạn.
            </ThemedText>
          </View>

          <Pressable
            onPress={() => router.push("/mindmap" as never)}
            style={[
              mindmapEntryStyles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={[mindmapEntryStyles.icon, { backgroundColor: theme.primary }]}>
              <GitBranch color={theme.buttonText} size={20} />
            </View>
            <View style={mindmapEntryStyles.copy}>
              <ThemedText type="smallBold">Mindmap khái niệm</ThemedText>
              <ThemedText type="small" themeColor="textMuted">
                Mở SVG force-directed map, zoom, pan và chạm node để xem chi tiết.
              </ThemedText>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/bookmarks" as never)}
            style={[
              mindmapEntryStyles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={[mindmapEntryStyles.icon, { backgroundColor: "#FB7185" }]}>
              <Heart color="#0C0C0E" fill="#0C0C0E" size={20} />
            </View>
            <View style={mindmapEntryStyles.copy}>
              <ThemedText type="smallBold">Đã lưu</ThemedText>
              <ThemedText type="small" themeColor="textMuted">
                Xem danh sách đã lưu được nhóm theo bài học, chủ đề, câu chuyện và tranh luận.
              </ThemedText>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/minigames" as never)}
            style={[
              mindmapEntryStyles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={[mindmapEntryStyles.icon, { backgroundColor: "#34D399" }]}>
              <Gamepad2 color="#0C0C0E" size={20} />
            </View>
            <View style={mindmapEntryStyles.copy}>
              <ThemedText type="smallBold">Trò chơi luyện tập</ThemedText>
              <ThemedText type="small" themeColor="textMuted">
                Chơi ghép thẻ, đoán chân dung và sắp xếp lập luận để ghi điểm.
              </ThemedText>
            </View>
          </Pressable>

          <QuizListStats />
          {isError ? (
            <Pressable onPress={() => refetch()} style={styles.outlineButton}>
              <ThemedText style={styles.outlineButtonText}>
                API quiz chÆ°a sáºµn sÃ ng, Ä‘ang hiá»ƒn thá»‹ dá»¯ liá»‡u dá»± phÃ²ng
              </ThemedText>
            </Pressable>
          ) : null}
          {isLoading ? <ThemedText style={styles.cardText}>Đang tải câu hỏi...</ThemedText> : null}
          <QuizSearchBox value={query} onChange={setQuery} />
          <QuizFilters filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />

          {filteredQuizzes.length === 0 ? (
            <QuizListEmpty />
          ) : (
            filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onPress={() => openQuiz(quiz)} />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const mindmapEntryStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    flexDirection: "row",
    gap: Spacing.three,
    alignItems: "center",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
});

function matchesQuiz(quiz: QuizSummary, query: string, activeFilter: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery =
    !normalizedQuery ||
    `${quiz.title} ${quiz.topic} ${quiz.description}`.toLowerCase().includes(normalizedQuery);
  const matchesFilter =
    activeFilter === "Tất cả" ||
    quiz.topic.toLowerCase().includes(activeFilter.toLowerCase()) ||
    (activeFilter === "Đã hoàn thành" && quiz.status === "completed");

  return matchesQuery && matchesFilter;
}
