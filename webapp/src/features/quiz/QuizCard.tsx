import { Image } from "expo-image";
import { ArrowRight, Clock, Lock, RotateCcw } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { QuizSummary } from "./mock";
import { QuizColors, quizStyles as styles } from "./ui";
import { getQuizCta, getQuizStatusColor, getQuizStatusLabel } from "./utils";

type QuizCardProps = {
  onPress: () => void;
  quiz: QuizSummary;
};

export function QuizCard({ onPress, quiz }: QuizCardProps) {
  const { t } = useTranslation();
  const locked = quiz.status === "locked";
  const completed = quiz.status === "completed";

  return (
    <View style={[styles.quizCard, locked && styles.disabled]}>
      <Image source={quiz.image} contentFit="cover" style={styles.quizImage} />

      <View style={styles.quizBody}>
        <View style={styles.rowBetween}>
          <ThemedText style={styles.topic}>{quiz.topic}</ThemedText>
          <ThemedText style={[styles.status, getQuizStatusColor(quiz.status)]}>
            {getQuizStatusLabel(quiz, t)}
          </ThemedText>
        </View>

        <ThemedText style={styles.cardTitle}>{quiz.title}</ThemedText>
        <ThemedText style={styles.cardText}>{quiz.description}</ThemedText>

        <View style={styles.metaRow}>
          <ThemedText style={styles.metaText}>
            {t("quiz.meta_questions", { count: quiz.questions })}
          </ThemedText>
          <View style={styles.metaRow}>
            <Clock color={QuizColors.muted} size={14} />
            <ThemedText style={styles.metaText}>
              {t("quiz.meta_time", { minutes: quiz.timeMinutes })}
            </ThemedText>
          </View>
          <ThemedText style={styles.metaText}>
            {t(`quiz.difficulty_${quiz.difficulty}` as Parameters<typeof t>[0])}
          </ThemedText>
        </View>

        {quiz.status === "in-progress" ? (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${quiz.progress ?? 0}%` }]} />
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={locked}
          onPress={onPress}
          style={({ pressed }) => [
            completed ? styles.outlineButton : styles.primaryButton,
            locked && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          {locked ? <Lock color={QuizColors.text} size={15} /> : null}
          {completed ? <RotateCcw color={QuizColors.primaryLight} size={15} /> : null}
          <ThemedText style={completed ? styles.outlineButtonText : styles.primaryButtonText}>
            {getQuizCta(quiz.status, t)}
          </ThemedText>
          {!locked && !completed ? <ArrowRight color={QuizColors.buttonText} size={15} /> : null}
        </Pressable>
      </View>
    </View>
  );
}
