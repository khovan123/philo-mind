import { Clock3 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Colors, decisions } from "../data";
import { InfoCard, PrimaryButton, styles } from "../ui";

type DecisionSelectionProps = {
  decisionId: string;
  onChange: (id: string) => void;
  onNext: () => void;
};

export function DecisionSelection({ decisionId, onChange, onNext }: DecisionSelectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stack}>
      <Text style={styles.centerTitle}>{t("story_trial.decision_selection.title")}</Text>
      <Text style={styles.centerSubtitle}>{t("story_trial.decision_selection.subtitle")}</Text>

      {decisions.map((decision) => {
        const active = decision.id === decisionId;
        const decisionTitle = t(`story_trial.decision_selection.decisions.${decision.id}.title`);
        const decisionPrinciple = t(
          `story_trial.decision_selection.decisions.${decision.id}.principle`,
        );
        const decisionTag = t(`story_trial.decision_selection.decisions.${decision.id}.tag`);

        return (
          <Pressable
            key={decision.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            onPress={() => onChange(decision.id)}
            style={[styles.decisionCard, active && styles.decisionCardActive]}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>{decisionTitle}</Text>
              <View style={[styles.radio, active && styles.radioActive]} />
            </View>
            <Text style={styles.decisionBody}>{decisionPrinciple}</Text>
            <Text style={styles.decisionTag}>{decisionTag}</Text>
          </Pressable>
        );
      })}

      <InfoCard
        icon={<Clock3 color={Colors.primaryLight} size={18} />}
        title={t("story_trial.decision_selection.consequence_title")}
        body={t("story_trial.decision_selection.consequence_body")}
      />

      <PrimaryButton label={t("story_trial.decision_selection.cta_confirm")} onPress={onNext} />
    </View>
  );
}
