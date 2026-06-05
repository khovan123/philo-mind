import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { AnswerOption } from "@/features/quiz/AnswerOption";
import { Explanation } from "@/features/quiz/Explanation";
import { QuestionCard } from "@/features/quiz/QuestionCard";
import { QuestionProgress } from "@/features/quiz/QuestionProgress";
import { QuizHeader } from "@/features/quiz/QuizHeader";
import { QuizResultView } from "@/features/quiz/QuizResultView";
import { QuizState } from "@/features/quiz/QuizState";
import { SubmitAction } from "@/features/quiz/SubmitAction";
import { getQuizByLessonId } from "@/features/quiz/mock";
import type { FeedbackState, LoadState } from "@/features/quiz/types";
import { QuizColors, quizStyles as styles } from "@/features/quiz/ui";
import { formatTime } from "@/features/quiz/utils";
import {
  useCompleteQuizAttemptMutation,
  useGetQuizByLessonQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAnswerMutation,
} from "@/services/rtk-api/quiz.api";

export default function QuizGameplayScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [resultVisible, setResultVisible] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const fallbackQuiz = useMemo(() => getQuizByLessonId(lessonId ?? ""), [lessonId]);
  const {
    data: apiQuiz,
    isLoading: quizLoading,
    isError: quizError,
    refetch,
  } = useGetQuizByLessonQuery(lessonId ?? "", { skip: !lessonId || lessonId === "error" });
  const [startAttempt] = useStartQuizAttemptMutation();
  const [submitQuizAnswer] = useSubmitQuizAnswerMutation();
  const [completeAttempt] = useCompleteQuizAttemptMutation();
  const quiz = apiQuiz ?? fallbackQuiz;
  const question = quiz?.questions[questionIndex];
  const progress = quiz ? (questionIndex + 1) / quiz.questions.length : 0;
  const answered = feedback !== "idle" && feedback !== "submitting";
  const timeSpentSeconds = quiz ? quiz.durationSeconds - remainingSeconds : 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lessonId === "error") {
        setLoadState("error");
        return;
      }

      if (quizLoading) {
        setLoadState("loading");
        return;
      }

      setLoadState(quiz && !quizError ? "ready" : fallbackQuiz ? "ready" : "empty");
      setRemainingSeconds((apiQuiz ?? fallbackQuiz)?.durationSeconds ?? 0);
    }, 240);

    return () => clearTimeout(timeout);
  }, [apiQuiz, fallbackQuiz, lessonId, quiz, quizError, quizLoading]);

  useEffect(() => {
    if (!quiz?.id || attemptId || loadState !== "ready") return;

    startAttempt(quiz.id)
      .unwrap()
      .then((attempt) => setAttemptId(attempt.attemptId))
      .catch(() => {
        setAttemptId(null);
      });
  }, [attemptId, loadState, quiz?.id, startAttempt]);

  useEffect(() => {
    if (loadState !== "ready" || resultVisible || feedback === "timeout") {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          setFeedback("timeout");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [feedback, loadState, resultVisible]);

  function retryLoad() {
    setLoadState("loading");
    void refetch();
    setTimeout(() => setLoadState(quiz ? "ready" : "empty"), 260);
  }

  function submitAnswer() {
    if (!question || !selectedOptionId || feedback !== "idle") {
      return;
    }

    setFeedback("submitting");

    if (attemptId) {
      void submitQuizAnswer({
        attemptId,
        questionId: question.id,
        selectedOptionId,
      }).catch(() => undefined);
    }

    setTimeout(() => {
      const correct = selectedOptionId === question.correctOptionId;
      setFeedback(correct ? "correct" : "wrong");
      setCorrectCount((current) => current + (correct ? 1 : 0));
    }, 280);
  }

  function nextQuestion() {
    if (!quiz) {
      return;
    }

    if (questionIndex === quiz.questions.length - 1) {
      if (attemptId) {
        void completeAttempt(attemptId).catch(() => undefined);
      }
      setResultVisible(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(null);
    setFeedback("idle");
  }

  function retryQuiz() {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setFeedback("idle");
    setCorrectCount(0);
    setResultVisible(false);
    setRemainingSeconds(quiz?.durationSeconds ?? 0);
    setAttemptId(null);
  }

  if (loadState === "loading") {
    return (
      <QuizState title="PhiloMind">
        <ActivityIndicator color={QuizColors.primaryLight} size="large" />
        <ThemedText style={styles.cardTitle}>{t("quiz.loading_quiz")}</ThemedText>
        <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
          {t("quiz.preparing_questions")}
        </ThemedText>
      </QuizState>
    );
  }

  if (loadState === "error") {
    return (
      <QuizState title="PhiloMind">
        <BookOpen color={QuizColors.primaryLight} size={52} />
        <ThemedText style={styles.cardTitle}>{t("quiz.failed_to_load")}</ThemedText>
        <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
          {t("quiz.check_connection")}
        </ThemedText>
        <Pressable onPress={retryLoad} style={styles.primaryButton}>
          <ThemedText style={styles.primaryButtonText}>{t("quiz.retry")}</ThemedText>
        </Pressable>
      </QuizState>
    );
  }

  if (loadState === "empty" || !quiz || !question) {
    return (
      <QuizState title="PhiloMind">
        <BookOpen color={QuizColors.primaryLight} size={52} />
        <ThemedText style={styles.cardTitle}>{t("quiz.no_quiz_available")}</ThemedText>
        <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
          {t("quiz.try_another_lesson")}
        </ThemedText>
        <Pressable onPress={() => router.push("/(tabs)/learn")} style={styles.primaryButton}>
          <ThemedText style={styles.primaryButtonText}>{t("quiz.back_to_learning")}</ThemedText>
        </Pressable>
      </QuizState>
    );
  }

  if (resultVisible) {
    return (
      <QuizResultView
        correctCount={correctCount}
        onRetry={retryQuiz}
        remainingSeconds={remainingSeconds}
        timeSpentSeconds={timeSpentSeconds}
        totalQuestions={quiz.questions.length}
      />
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <QuizHeader title={quiz.title} timer={formatTime(remainingSeconds)} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <QuestionProgress
            current={questionIndex + 1}
            progress={progress}
            total={quiz.questions.length}
          />

          <QuestionCard question={question} />

          <View style={{ gap: 10 }}>
            {question.options.map((option) => (
              <AnswerOption
                key={option.id}
                correctOptionId={question.correctOptionId}
                disabled={answered}
                feedback={feedback}
                option={option}
                selectedOptionId={selectedOptionId}
                onSelect={setSelectedOptionId}
              />
            ))}
          </View>

          {answered ? <Explanation question={question} feedback={feedback} /> : null}

          <SubmitAction
            answered={answered}
            disabled={feedback === "idle" && !selectedOptionId}
            feedback={feedback}
            isLast={questionIndex === quiz.questions.length - 1}
            onPress={answered ? nextQuestion : submitAnswer}
          />

          {feedback === "idle" && !selectedOptionId ? (
            <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
              {t("quiz.select_option_to_continue")}
            </ThemedText>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
