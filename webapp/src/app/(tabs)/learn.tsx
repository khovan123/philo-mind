import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { QuizCard } from "@/app/(lesson)/quiz/QuizCard";
import { QuizFilters } from "@/app/(lesson)/quiz/QuizFilters";
import { QuizListEmpty } from "@/app/(lesson)/quiz/QuizListEmpty";
import { QuizListStats } from "@/app/(lesson)/quiz/QuizListStats";
import { QuizSearchBox } from "@/app/(lesson)/quiz/QuizSearchBox";
import { quizSummaries, type QuizSummary } from "@/app/(lesson)/quiz/mock";
import { quizStyles as styles } from "@/app/(lesson)/quiz/ui";

const filters = ["All", "Philosophy", "History", "Ethics", "Politics", "Completed"];

export default function LearnScreen() {
  const router = useRouter();
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
