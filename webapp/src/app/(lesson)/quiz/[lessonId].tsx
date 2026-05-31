import { useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { AnswerOption } from "./AnswerOption";
import { Explanation } from "./Explanation";
import { QuestionCard } from "./QuestionCard";
import { QuestionProgress } from "./QuestionProgress";
import { QuizHeader } from "./QuizHeader";
import { QuizResultView } from "./QuizResultView";
import { QuizState } from "./QuizState";
import { SubmitAction } from "./SubmitAction";
import { getQuizByLessonId } from "./mock";
import type { FeedbackState, LoadState } from "./types";
import { QuizColors, quizStyles as styles } from "./ui";
import { formatTime } from "./utils";

export default function QuizGameplayScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [resultVisible, setResultVisible] = useState(false);

  const quiz = useMemo(() => getQuizByLessonId(lessonId ?? ""), [lessonId]);
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

      setLoadState(quiz ? "ready" : "empty");
      setRemainingSeconds(quiz?.durationSeconds ?? 0);
    }, 240);

    return () => clearTimeout(timeout);
  }, [lessonId, quiz]);

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
    setTimeout(() => setLoadState(quiz ? "ready" : "empty"), 260);
  }

  function submitAnswer() {
    if (!question || !selectedOptionId || feedback !== "idle") {
      return;
    }

    setFeedback("submitting");

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
  }

  if (loadState === "loading") {
    return (
      <QuizState title="PhiloMind">
        <ActivityIndicator color={QuizColors.primaryLight} size="large" />
        <ThemedText style={styles.cardTitle}>Loading quiz</ThemedText>
        <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
          Preparing questions, timer, and answer states.
        </ThemedText>
      </QuizState>
    );
  }

  if (loadState === "error") {
    return (
      <QuizState title="PhiloMind">
        <BookOpen color={QuizColors.primaryLight} size={52} />
        <ThemedText style={styles.cardTitle}>Failed to load quiz.</ThemedText>
        <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
          Please check your connection and try again.
        </ThemedText>
        <Pressable onPress={retryLoad} style={styles.primaryButton}>
          <ThemedText style={styles.primaryButtonText}>Retry</ThemedText>
        </Pressable>
      </QuizState>
    );
  }

  if (loadState === "empty" || !quiz || !question) {
    return (
      <QuizState title="PhiloMind">
        <BookOpen color={QuizColors.primaryLight} size={52} />
        <ThemedText style={styles.cardTitle}>No quiz available for this lesson.</ThemedText>
        <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
          Try another lesson or come back later.
        </ThemedText>
        <Pressable onPress={() => router.push("/learn")} style={styles.primaryButton}>
          <ThemedText style={styles.primaryButtonText}>Back to Learning</ThemedText>
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
              Select an option to continue the inquiry.
            </ThemedText>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
