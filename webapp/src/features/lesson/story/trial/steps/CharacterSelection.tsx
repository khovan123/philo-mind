import { CheckCircle2, Users } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { characters, Colors } from "../data";
import { InfoCard, LabelValue, PrimaryButton, styles } from "../ui";

type CharacterSelectionProps = {
  characterId: string;
  onChange: (id: string) => void;
  onNext: () => void;
};

export function CharacterSelection({ characterId, onChange, onNext }: CharacterSelectionProps) {
  return (
    <View style={styles.stack}>
      <Text style={styles.centerTitle}>Choose Your Role</Text>
      <Text style={styles.centerSubtitle}>Your role changes how you experience the conflict.</Text>

      {characters.map((character) => {
        const active = character.id === characterId;

        return (
          <Pressable
            key={character.id}
            accessibilityRole="button"
            onPress={() => onChange(character.id)}
            style={[styles.optionCard, active && styles.optionCardActive]}
          >
            <View style={styles.optionHeader}>
              <View>
                <Text style={styles.optionTitle}>{character.name}</Text>
                <Text style={styles.optionMeta}>{character.role}</Text>
              </View>
              {active && <CheckCircle2 color={Colors.primaryLight} size={20} />}
            </View>
            <LabelValue label="Primary goal" value={character.goal} />
            <LabelValue label="Cost/risk" value={character.cost} />
          </Pressable>
        );
      })}

      <InfoCard
        icon={<Users color={Colors.primaryLight} size={18} />}
        title="Perspective"
        body={`You will experience the scenario as ${
          characters.find((item) => item.id === characterId)?.name
        }.`}
      />

      <PrimaryButton label="Continue" onPress={onNext} />
    </View>
  );
}
