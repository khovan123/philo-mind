import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Colors } from "./data";
import { styles } from "./ui";

type LessonTopBarProps = {
  stepIndex: number;
  onBack: () => void;
};

const STEP_KEYS = [
  "context",
  "character",
  "situation",
  "decision",
  "consequence",
  "lesson",
] as const;

export function LessonTopBar({ stepIndex, onBack }: LessonTopBarProps) {
  const { t } = useTranslation();

  const currentStepKey = STEP_KEYS[stepIndex];
  const stepName = currentStepKey ? t(`story_trial.steps.${currentStepKey}`) : "";

  return (
    <View style={styles.topBar}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
        <ArrowLeft color={Colors.primaryLight} size={20} />
      </Pressable>

      <View style={styles.topTitleBlock}>
        <Text style={styles.lessonEyebrow}>{t("story_trial.title")}</Text>
        <Text style={styles.stepText}>
          {t("story_trial.step_progress", {
            current: stepIndex + 1,
            total: STEP_KEYS.length,
            stepName,
          })}
        </Text>
      </View>

      <View style={styles.menuDots}>
        <View style={styles.dotSmall} />
        <View style={styles.dotSmall} />
        <View style={styles.dotSmall} />
      </View>
    </View>
  );
}
