import { Image } from "expo-image";
import { BookOpen, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors, sceneImage } from "../data";
import { InfoCard, PrimaryButton, StatusPill, styles } from "../ui";

export function ScenarioContext({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.stack}>
      <StatusPill label="399 BC" />
      <Text style={styles.heroTitle}>Phiên tòa xử Socrates</Text>
      <Text style={styles.heroSubtitle}>
        Athens buộc tội Socrates vì làm hư hỏng giới trẻ và xúc phạm các vị thần.
      </Text>

      <View style={styles.imageCard}>
        <Image source={sceneImage} contentFit="cover" style={styles.sceneImage} />
        <View style={styles.imageShade} />
        <Text style={styles.imageCaption}>
          Thành phố bị chia rẽ giữa nỗi sợ hỗn loạn và lòng trung thành với sự thật.
        </Text>
      </View>

      <InfoCard
        icon={<Sparkles color={Colors.primaryLight} size={18} />}
        title="Xung đột trung tâm"
        body="Socrates nên thỏa hiệp để sống sót, hay trung thành với triết học ngay cả khi thành phố đòi im lặng?"
      />
      <InfoCard
        icon={<BookOpen color={Colors.primaryLight} size={18} />}
        title="Mục tiêu học tập"
        body="Hiểu về tính chính trực đạo đức, công lý, và xung đột giữa an toàn cá nhân và sự thật."
      />

      <PrimaryButton label="Bắt đầu nhập vai" onPress={onNext} />
    </View>
  );
}
