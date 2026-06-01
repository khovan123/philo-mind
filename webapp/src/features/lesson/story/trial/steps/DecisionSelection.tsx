import { Clock3 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors, decisions } from "../data";
import { InfoCard, PrimaryButton, styles } from "../ui";

type DecisionSelectionProps = {
  decisionId: string;
  onChange: (id: string) => void;
  onNext: () => void;
};

export function DecisionSelection({ decisionId, onChange, onNext }: DecisionSelectionProps) {
  return (
    <View style={styles.stack}>
      <Text style={styles.centerTitle}>Choose Your Decision</Text>
      <Text style={styles.centerSubtitle}>Every decision reveals a value.</Text>

      {decisions.map((decision) => {
        const active = decision.id === decisionId;

        return (
          <Pressable
            key={decision.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            onPress={() => onChange(decision.id)}
            style={[styles.decisionCard, active && styles.decisionCardActive]}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>{decision.title}</Text>
              <View style={[styles.radio, active && styles.radioActive]} />
            </View>
            <Text style={styles.decisionBody}>{decision.principle}</Text>
            <Text style={styles.decisionTag}>{decision.tag}</Text>
          </Pressable>
        );
      })}

      <InfoCard
        icon={<Clock3 color={Colors.primaryLight} size={18} />}
        title="Consequence"
        body="Your choice will shape the consequence and lesson."
      />

      <PrimaryButton label="Confirm decision" onPress={onNext} />
    </View>
  );
}
