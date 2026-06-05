import { Image } from "expo-image";
import { ScrollText, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { LessonDecision } from "../data";
import { Colors, sceneImage } from "../data";
import { InfoCard, Metric, PrimaryButton, SecondaryButton, StatusPill, styles } from "../ui";

type ConsequenceResultProps = {
  decision: LessonDecision;
  onRetry: () => void;
  onNext: () => void;
};

export function ConsequenceResult({ decision, onRetry, onNext }: ConsequenceResultProps) {
  const { t } = useTranslation();

  const decisionTitle = t(`story_trial.decision_selection.decisions.${decision.id}.title`);

  return (
    <View style={styles.stack}>
      <StatusPill
        label={t("story_trial.consequence_result.decision_pill", { title: decisionTitle })}
      />
      <View style={styles.imageCard}>
        <Image source={sceneImage} contentFit="cover" style={styles.sceneImage} />
        <View style={styles.imageShade} />
        <Text style={styles.verdictTitle}>{t("story_trial.consequence_result.verdict")}</Text>
      </View>

      <InfoCard
        icon={<ScrollText color={Colors.danger} size={18} />}
        title={t("story_trial.consequence_result.immediate_consequence")}
        body={t("story_trial.consequence_result.immediate_consequence_body")}
      />
      <InfoCard
        icon={<Sparkles color={Colors.primaryLight} size={18} />}
        title={t("story_trial.consequence_result.philosophical_meaning")}
        body={t("story_trial.consequence_result.philosophical_meaning_body")}
      />

      <View style={styles.metricCard}>
        <Metric label={t("story_trial.consequence_result.metrics.public_trust")} value={45} />
        <Metric
          label={t("story_trial.consequence_result.metrics.personal_safety")}
          value={15}
          danger
        />
        <Metric
          label={t("story_trial.consequence_result.metrics.moral_integrity")}
          value={92}
          success
        />
      </View>

      <PrimaryButton label={t("story_trial.consequence_result.cta_continue")} onPress={onNext} />
      <SecondaryButton label={t("story_trial.consequence_result.cta_retry")} onPress={onRetry} />
    </View>
  );
}
