import { useRouter } from "expo-router";
import { Home, RefreshCcw, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

import { QuizHeader } from "./QuizHeader";
import { QuizColors, quizStyles as styles } from "./ui";
import { formatDuration, formatTime } from "./utils";

type QuizResultViewProps = {
  correctCount: number;
  onRetry: () => void;
  remainingSeconds: number;
  timeSpentSeconds: number;
  totalQuestions: number;
};

export function QuizResultView({
  correctCount,
  onRetry,
  remainingSeconds,
  timeSpentSeconds,
  totalQuestions,
}: QuizResultViewProps) {
  const router = useRouter();
  const [celebration] = useState(() => new Animated.Value(0));
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  useEffect(() => {
    celebration.setValue(0);
    Animated.spring(celebration, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [celebration]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <QuizHeader title="Quiz Completed" timer={formatTime(remainingSeconds)} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View
            style={[
              styles.resultHero,
              {
                opacity: celebration,
                transform: [
                  {
                    scale: celebration.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.88, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.scoreRing}>
              <ThemedText style={styles.scoreText}>{accuracy}%</ThemedText>
              <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
            </View>
            <ThemedText style={[styles.title, { textAlign: "center" }]}>
              {accuracy >= 70
                ? "Excellent. You understood the core conflict."
                : "Review and try again."}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { textAlign: "center" }]}>
              Score {correctCount}/{totalQuestions} • Time {formatDuration(timeSpentSeconds)}
            </ThemedText>
          </Animated.View>

          <View style={styles.statsGrid}>
            <ResultStat label="Correct" value={`${correctCount}/${totalQuestions}`} />
            <ResultStat label="Time" value={formatDuration(timeSpentSeconds)} />
            <ResultStat label="Rank" value={accuracy >= 70 ? "Master" : "Learner"} />
            <ResultStat label="Badge" value={accuracy >= 70 ? "Truth Seeker" : "Pending"} />
          </View>

          <View style={styles.stateCard}>
            <Trophy color={QuizColors.primaryLight} size={42} />
            <ThemedText style={styles.cardTitle}>
              {accuracy >= 70 ? "Truth Seeker" : "Keep Practicing"}
            </ThemedText>
            <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
              {accuracy >= 70
                ? "Badge earned for defending the philosophical core."
                : "Revisit the lesson and strengthen the concepts."}
            </ThemedText>
          </View>

          <Pressable onPress={onRetry} style={styles.primaryButton}>
            <RefreshCcw color={QuizColors.buttonText} size={16} />
            <ThemedText style={styles.primaryButtonText}>Retry Quiz</ThemedText>
          </Pressable>
          <Pressable onPress={() => router.push("/learn")} style={styles.outlineButton}>
            <Home color={QuizColors.text} size={16} />
            <ThemedText style={styles.outlineButtonText}>Back to Learning</ThemedText>
          </Pressable>
          <Pressable onPress={() => router.push("/profile")} style={styles.outlineButton}>
            <Trophy color={QuizColors.text} size={16} />
            <ThemedText style={styles.outlineButtonText}>View Progress</ThemedText>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}
