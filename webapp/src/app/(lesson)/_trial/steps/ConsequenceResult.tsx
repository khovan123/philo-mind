import { Image } from "expo-image";
import { ScrollText, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import type { LessonDecision } from "../data";
import { Colors, sceneImage } from "../data";
import { InfoCard, Metric, PrimaryButton, SecondaryButton, StatusPill, styles } from "../ui";

type ConsequenceResultProps = {
  decision: LessonDecision;
  onRetry: () => void;
  onNext: () => void;
};

export function ConsequenceResult({ decision, onRetry, onNext }: ConsequenceResultProps) {
  return (
    <View style={styles.stack}>
      <StatusPill label={`Decision · ${decision.title}`} />
      <View style={styles.imageCard}>
        <Image source={sceneImage} contentFit="cover" style={styles.sceneImage} />
        <View style={styles.imageShade} />
        <Text style={styles.verdictTitle}>The Verdict</Text>
      </View>

      <InfoCard
        icon={<ScrollText color={Colors.danger} size={18} />}
        title="Immediate consequence"
        body="The court sees your stance as defiant and dangerous."
      />
      <InfoCard
        icon={<Sparkles color={Colors.primaryLight} size={18} />}
        title="Philosophical meaning"
        body="This choice shows that some people may value truth and moral consistency more than personal survival."
      />

      <View style={styles.metricCard}>
        <Metric label="Public trust" value={45} />
        <Metric label="Personal safety" value={15} danger />
        <Metric label="Moral integrity" value={92} success />
      </View>

      <PrimaryButton label="Continue to lesson" onPress={onNext} />
      <SecondaryButton label="Try another decision" onPress={onRetry} />
    </View>
  );
}
