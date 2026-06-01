import { BarChart3 } from "lucide-react-native";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Badge, Card } from "@/components/ui";

import { ConceptChip } from "./ConceptChip";
import { ProgressBar } from "./ProgressBar";
import type { VoteOption } from "./data";
import { Colors, styles } from "./ui";

type VoteResultProps = {
  option: VoteOption;
};

export function VoteResult({ option }: VoteResultProps) {
  return (
    <Card style={styles.inlineResult}>
      <View style={styles.resultHeader}>
        <Badge label="RESULT" style={styles.primaryBadge} />
        <ThemedText style={styles.inlineResultPercent}>{option.percent}%</ThemedText>
      </View>
      <ThemedText style={styles.inlineResultTitle}>Your vote: {option.label}</ThemedText>
      <ProgressBar value={option.percent / 100} />
      <ThemedText style={styles.explanationText}>{option.explanation}</ThemedText>
    </Card>
  );
}

type FinishedResultProps = {
  option: VoteOption;
};

export function FinishedResult({ option }: FinishedResultProps) {
  return (
    <Card style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Badge label="RESULT" style={styles.primaryBadge} />
        <BarChart3 color={Colors.mutedText} size={28} />
      </View>

      <ThemedText style={styles.resultTitle}>
        Most users chose: {option.label} ({option.percent}%)
      </ThemedText>

      <ProgressBar value={option.percent / 100} />

      <View style={styles.explanationBox}>
        <ThemedText style={styles.explanationText}>{option.explanation}</ThemedText>
      </View>

      <View style={styles.conceptBlock}>
        <ThemedText style={styles.metaLabel}>RELATED CONCEPT</ThemedText>
        <ConceptChip label="Virtue Ethics" />
      </View>
    </Card>
  );
}
