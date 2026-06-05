import { CheckCircle2, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { characters, Colors } from "../data";
import { InfoCard, LabelValue, PrimaryButton, styles } from "../ui";

type CharacterSelectionProps = {
  characterId: string;
  onChange: (id: string) => void;
  onNext: () => void;
};

export function CharacterSelection({ characterId, onChange, onNext }: CharacterSelectionProps) {
  const { t } = useTranslation();

  const selectedCharName = t(`story_trial.character_selection.characters.${characterId}.name`);

  return (
    <View style={styles.stack}>
      <Text style={styles.centerTitle}>{t("story_trial.character_selection.title")}</Text>
      <Text style={styles.centerSubtitle}>{t("story_trial.character_selection.subtitle")}</Text>

      {characters.map((character) => {
        const active = character.id === characterId;
        const charName = t(`story_trial.character_selection.characters.${character.id}.name`);
        const charRole = t(`story_trial.character_selection.characters.${character.id}.role`);
        const charGoal = t(`story_trial.character_selection.characters.${character.id}.goal`);
        const charCost = t(`story_trial.character_selection.characters.${character.id}.cost`);

        return (
          <Pressable
            key={character.id}
            accessibilityRole="button"
            onPress={() => onChange(character.id)}
            style={[styles.optionCard, active && styles.optionCardActive]}
          >
            <View style={styles.optionHeader}>
              <View>
                <Text style={styles.optionTitle}>{charName}</Text>
                <Text style={styles.optionMeta}>{charRole}</Text>
              </View>
              {active && <CheckCircle2 color={Colors.primaryLight} size={20} />}
            </View>
            <LabelValue label={t("story_trial.character_selection.main_goal")} value={charGoal} />
            <LabelValue label={t("story_trial.character_selection.risk")} value={charCost} />
          </Pressable>
        );
      })}

      <InfoCard
        icon={<Users color={Colors.primaryLight} size={18} />}
        title={t("story_trial.character_selection.perspective_title")}
        body={t("story_trial.character_selection.perspective_body", { name: selectedCharName })}
      />

      <PrimaryButton label={t("story_trial.character_selection.cta_next")} onPress={onNext} />
    </View>
  );
}
