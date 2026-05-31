import { Shield } from "lucide-react-native";
import { Text, View } from "react-native";

import type { LessonCharacter } from "../data";
import { Colors } from "../data";
import { InfoCard, PrimaryButton, StatusPill, styles } from "../ui";

type RoleplaySituationProps = {
  character: LessonCharacter;
  onNext: () => void;
};

export function RoleplaySituation({ character, onNext }: RoleplaySituationProps) {
  return (
    <View style={styles.stack}>
      <StatusPill label={`Playing as ${character.name}`} />
      <View style={styles.quotePanel}>
        <Text style={styles.dropCap}>Y</Text>
        <Text style={styles.quoteBody}>
          ou are standing before the Athenian court. The judges offer a chance to apologize and stop
          teaching philosophy. If you accept, you may live. If you refuse, you may be punished
          severely.
        </Text>
      </View>

      <View style={styles.callout}>
        <Text style={styles.calloutText}>Will you protect your life, or defend your beliefs?</Text>
      </View>

      <View style={styles.virtueGrid}>
        {["Truth", "Safety", "Justice", "Loyalty"].map((virtue) => (
          <View key={virtue} style={styles.virtueChip}>
            <Text style={styles.virtueText}>{virtue}</Text>
          </View>
        ))}
      </View>

      <InfoCard
        icon={<Shield color={Colors.primaryLight} size={18} />}
        title="What is at stake?"
        body="Your legacy, the future of Athenian philosophy, and the meaning of public courage."
      />

      <PrimaryButton label="Make a decision" onPress={onNext} />
    </View>
  );
}
