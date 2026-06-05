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
        <Text style={styles.verdictTitle}>Phán quyết</Text>
      </View>

      <InfoCard
        icon={<ScrollText color={Colors.danger} size={18} />}
        title="Hậu quả tức thì"
        body="Tòa án coi lập trường của bạn là bất tuân và nguy hiểm."
      />
      <InfoCard
        icon={<Sparkles color={Colors.primaryLight} size={18} />}
        title="Ý nghĩa triết học"
        body="Lựa chọn này cho thấy rằng một số người có thể coi trọng sự thật và tính nhất quán đạo đức hơn sự sống còn cá nhân."
      />

      <View style={styles.metricCard}>
        <Metric label="Niềm tin công chúng" value={45} />
        <Metric label="An toàn cá nhân" value={15} danger />
        <Metric label="Chính trực đạo đức" value={92} success />
      </View>

      <PrimaryButton label="Tiếp tục bài học" onPress={onNext} />
      <SecondaryButton label="Thử quyết định khác" onPress={onRetry} />
    </View>
  );
}
