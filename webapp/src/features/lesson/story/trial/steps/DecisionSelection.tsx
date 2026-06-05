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
      <Text style={styles.centerTitle}>Chọn quyết định</Text>
      <Text style={styles.centerSubtitle}>Mỗi quyết định bộc lộ một giá trị.</Text>

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
        title="Hệ quả"
        body="Lựa chọn của bạn sẽ định hình hậu quả và bài học."
      />

      <PrimaryButton label="Xác nhận quyết định" onPress={onNext} />
    </View>
  );
}
