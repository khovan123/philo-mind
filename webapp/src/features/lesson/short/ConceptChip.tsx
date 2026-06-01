import { Sparkles } from "lucide-react-native";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { Colors, styles } from "./ui";

type ConceptChipProps = {
  label: string;
};

export function ConceptChip({ label }: ConceptChipProps) {
  return (
    <View style={styles.conceptChip}>
      <Sparkles color={Colors.primaryLight} size={14} />
      <ThemedText style={styles.conceptText}>{label}</ThemedText>
    </View>
  );
}
