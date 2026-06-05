import { useRouter } from "expo-router";
import { Home, RefreshCcw, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        <QuizHeader title={t("quiz.completed")} timer={formatTime(remainingSeconds)} />

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
              <ThemedText style={styles.statLabel}>{t("quiz.accuracy")}</ThemedText>
            </View>
            <ThemedText style={[styles.title, { textAlign: "center" }]}>
              {accuracy >= 70 ? t("quiz.excellent_score") : t("quiz.review_score")}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { textAlign: "center" }]}>
              {t("quiz.score_summary", {
                correct: correctCount,
                total: totalQuestions,
                time: formatDuration(timeSpentSeconds, t),
              })}
            </ThemedText>
          </Animated.View>

          <View style={styles.statsGrid}>
            <ResultStat
              label={t("quiz.stat_correct")}
              value={`${correctCount}/${totalQuestions}`}
            />
            <ResultStat label={t("quiz.stat_time")} value={formatDuration(timeSpentSeconds, t)} />
            <ResultStat
              label={t("quiz.stat_rank")}
              value={accuracy >= 70 ? t("quiz.rank_master") : t("quiz.rank_learner")}
            />
            <ResultStat
              label={t("quiz.stat_badge")}
              value={accuracy >= 70 ? t("quiz.badge_truth_seeker") : t("quiz.badge_pending")}
            />
          </View>

          <View style={styles.stateCard}>
            <Trophy color={QuizColors.primaryLight} size={42} />
            <ThemedText style={styles.cardTitle}>
              {accuracy >= 70 ? t("quiz.badge_truth_seeker") : t("quiz.keep_practicing")}
            </ThemedText>
            <ThemedText style={[styles.cardText, { textAlign: "center" }]}>
              {accuracy >= 70 ? t("quiz.badge_earned") : t("quiz.badge_not_earned")}
            </ThemedText>
          </View>

          <Pressable onPress={onRetry} style={styles.primaryButton}>
            <RefreshCcw color={QuizColors.buttonText} size={16} />
            <ThemedText style={styles.primaryButtonText}>{t("quiz.retry_quiz")}</ThemedText>
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/learn")} style={styles.outlineButton}>
            <Home color={QuizColors.text} size={16} />
            <ThemedText style={styles.outlineButtonText}>{t("quiz.back_to_learning")}</ThemedText>
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.outlineButton}>
            <Trophy color={QuizColors.text} size={16} />
            <ThemedText style={styles.outlineButtonText}>{t("quiz.view_progress")}</ThemedText>
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
