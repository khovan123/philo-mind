import { Shield } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { LessonCharacter } from "../data";
import { Colors } from "../data";
import { InfoCard, PrimaryButton, StatusPill, styles } from "../ui";

type RoleplaySituationProps = {
  character: LessonCharacter;
  onNext: () => void;
};

export function RoleplaySituation({ character, onNext }: RoleplaySituationProps) {
  const { t } = useTranslation();

  const characterName = t(`story_trial.character_selection.characters.${character.id}.name`);

  return (
    <View style={styles.stack}>
      <StatusPill label={t("story_trial.roleplay_situation.playing_as", { name: characterName })} />
      <View style={styles.quotePanel}>
        <Text style={styles.dropCap}>{t("story_trial.roleplay_situation.drop_cap")}</Text>
        <Text style={styles.quoteBody}>{t("story_trial.roleplay_situation.quote_body")}</Text>
      </View>

      <View style={styles.callout}>
        <Text style={styles.calloutText}>{t("story_trial.roleplay_situation.callout")}</Text>
      </View>

      <View style={styles.virtueGrid}>
        {["truth", "safety", "justice", "loyalty"].map((virtueKey) => (
          <View key={virtueKey} style={styles.virtueChip}>
            <Text style={styles.virtueText}>
              {t(`story_trial.roleplay_situation.virtues.${virtueKey}`)}
            </Text>
          </View>
        ))}
      </View>

      <InfoCard
        icon={<Shield color={Colors.primaryLight} size={18} />}
        title={t("story_trial.roleplay_situation.stake_title")}
        body={t("story_trial.roleplay_situation.stake_body")}
      />

      <PrimaryButton label={t("story_trial.roleplay_situation.cta_decision")} onPress={onNext} />
    </View>
  );
}
