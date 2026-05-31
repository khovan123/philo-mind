import { Image } from "expo-image";
import { BookOpen, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors, sceneImage } from "../data";
import { InfoCard, PrimaryButton, StatusPill, styles } from "../ui";

export function ScenarioContext({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.stack}>
      <StatusPill label="399 BC" />
      <Text style={styles.heroTitle}>The Trial of Socrates</Text>
      <Text style={styles.heroSubtitle}>
        Athens accuses Socrates of corrupting the youth and disrespecting the gods.
      </Text>

      <View style={styles.imageCard}>
        <Image source={sceneImage} contentFit="cover" style={styles.sceneImage} />
        <View style={styles.imageShade} />
        <Text style={styles.imageCaption}>
          The city is divided between fear of disorder and loyalty to truth.
        </Text>
      </View>

      <InfoCard
        icon={<Sparkles color={Colors.primaryLight} size={18} />}
        title="The central conflict"
        body="Should Socrates compromise to survive, or remain loyal to philosophy even when the city demands silence?"
      />
      <InfoCard
        icon={<BookOpen color={Colors.primaryLight} size={18} />}
        title="Learning goal"
        body="Understand moral integrity, justice, and the conflict between personal safety and truth."
      />

      <PrimaryButton label="Begin role-play" onPress={onNext} />
    </View>
  );
}
