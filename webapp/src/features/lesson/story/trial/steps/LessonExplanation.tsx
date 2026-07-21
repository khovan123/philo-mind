import { CheckCircle2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import type { LessonDecision } from "../data";
import { Colors } from "../data";
import { InfoCard, MarkdownBlock, PrimaryButton, SecondaryButton, styles } from "../ui";

type LessonExplanationProps = {
  decision: LessonDecision;
  quizChoice: string | null;
  onQuiz: (choice: string) => void;
  onRetry: () => void;
  onFinish: () => void;
};

export function LessonExplanation({
  decision,
  quizChoice,
  onQuiz,
  onRetry,
  onFinish,
}: LessonExplanationProps) {
  const { t } = useTranslation();

  const decisionTitle = t(`story_trial.decision_selection.decisions.${decision.id}.title`);
  const decisionPrinciple = t(
    `story_trial.decision_selection.decisions.${decision.id}.principle`,
  ).toLowerCase();

  const localizedMarkdown = [
    t("story_trial.lesson_explanation.markdown.moral_integrity"),
    t("story_trial.lesson_explanation.markdown.body_1"),
    t("story_trial.lesson_explanation.markdown.quote"),
    t("story_trial.lesson_explanation.markdown.body_2"),
    t("story_trial.lesson_explanation.markdown.body_3"),
  ];

  return (
    <View style={styles.stack}>
      <Text style={styles.lessonLabel}>{t("story_trial.lesson_explanation.eyebrow")}</Text>
      <Text style={styles.heroTitle}>{t("story_trial.lesson_explanation.title")}</Text>
      <InfoCard
        icon={<CheckCircle2 color={Colors.primaryLight} size={18} />}
        title={t("story_trial.lesson_explanation.your_choice_shows")}
        body={t("story_trial.lesson_explanation.your_choice_shows_body", {
          title: decisionTitle,
          principle: decisionPrinciple,
        })}
      />

      <MarkdownBlock lines={localizedMarkdown} />

      <View style={styles.conceptPanel}>
        <Text style={styles.cardTitle}>
          {t("story_trial.lesson_explanation.concepts_mastered")}
        </Text>
        <View style={styles.conceptRow}>
          {["moral_integrity", "justice", "truth", "civic_duty"].map((conceptKey) => (
            <View key={conceptKey} style={styles.conceptChip}>
              <Text style={styles.conceptText}>
                {t(`story_trial.lesson_explanation.concepts.${conceptKey}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionGrid}>
        {["Integrity", "Safety"].map((choice) => {
          const active = quizChoice === choice;

          return (
            <Pressable
              key={choice}
              accessibilityRole="button"
              onPress={() => onQuiz(choice)}
              style={[styles.actionCard, active && styles.actionCardActive]}
            >
              <Text style={styles.actionTitle}>
                {t(
                  choice === "Integrity"
                    ? "story_trial.lesson_explanation.quiz_integrity"
                    : "story_trial.lesson_explanation.quiz_safety",
                )}
              </Text>
              <Text style={styles.actionMeta}>
                {active
                  ? choice === "Integrity"
                    ? t("story_trial.lesson_explanation.quiz_correct")
                    : t("story_trial.lesson_explanation.quiz_try_again")
                  : t("story_trial.lesson_explanation.quiz_select")}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SecondaryButton
        label={t("story_trial.lesson_explanation.cta_retry_character")}
        onPress={onRetry}
      />
      <PrimaryButton label={t("story_trial.lesson_explanation.cta_finish")} onPress={onFinish} />
    </View>
  );
}
