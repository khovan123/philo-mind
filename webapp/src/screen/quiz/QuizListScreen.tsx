import { useRouter } from "expo-router";
import { Gamepad2, GitBranch, Heart } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { QuizCard } from "@/features/quiz/QuizCard";
import { QuizFilters } from "@/features/quiz/QuizFilters";
import { QuizListEmpty } from "@/features/quiz/QuizListEmpty";
import { QuizListStats } from "@/features/quiz/QuizListStats";
import { QuizSearchBox } from "@/features/quiz/QuizSearchBox";
import { quizSummaries, type QuizSummary } from "@/features/quiz/mock";
import { quizStyles as styles } from "@/features/quiz/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const filters = ["All", "Philosophy", "History", "Ethics", "Politics", "Completed"];

export default function LearnScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const filteredQuizzes = useMemo(
    () => quizSummaries.filter((quiz) => matchesQuiz(quiz, query, activeFilter)),
    [activeFilter, query],
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
          <ThemedText style={styles.brand}>Quizzes</ThemedText>
          <View style={styles.headerSide} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View>
            <ThemedText style={styles.title}>Học tập</ThemedText>
            <ThemedText style={styles.subtitle}>
              Test your understanding and strengthen your thinking.
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
              <ThemedText type="smallBold">Bookmark đã lưu</ThemedText>
              <ThemedText type="small" themeColor="textMuted">
                Xem danh sách bookmark được nhóm theo bài học, topic, story và debate.
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
              <ThemedText type="smallBold">MiniGame luyện tập</ThemedText>
              <ThemedText type="small" themeColor="textMuted">
                Chơi matching cards, portrait quiz và argument sorting để ghi điểm.
              </ThemedText>
            </View>
          </Pressable>

          <QuizListStats />
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
    activeFilter === "All" ||
    quiz.topic.toLowerCase().includes(activeFilter.toLowerCase()) ||
    (activeFilter === "Completed" && quiz.status === "completed");

  return matchesQuery && matchesFilter;
}
