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
      <Text style={styles.centerTitle}>Chọn vai trò</Text>
      <Text style={styles.centerSubtitle}>
        Vai trò của bạn thay đổi cách bạn trải nghiệm xung đột.
      </Text>

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
            <LabelValue label="Mục tiêu chính" value={character.goal} />
            <LabelValue label="Rủi ro" value={character.cost} />
          </Pressable>
        );
      })}

      <InfoCard
        icon={<Users color={Colors.primaryLight} size={18} />}
        title="Góc nhìn"
        body={`Bạn sẽ trải nghiệm kịch bản với tư cách ${
          characters.find((item) => item.id === characterId)?.name
        }.`}
      />

      <PrimaryButton label="Tiếp tục" onPress={onNext} />
    </View>
  );
}
