import { Image } from "expo-image";
import { BookOpen, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Colors, sceneImage } from "../data";
import { InfoCard, PrimaryButton, StatusPill, styles } from "../ui";

export function ScenarioContext({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();

  return (
    <View style={styles.stack}>
      <StatusPill label="399 BC" />
      <Text style={styles.heroTitle}>{t("story_trial.scenario_context.title")}</Text>
      <Text style={styles.heroSubtitle}>{t("story_trial.scenario_context.subtitle")}</Text>

      <View style={styles.imageCard}>
        <Image source={sceneImage} contentFit="cover" style={styles.sceneImage} />
        <View style={styles.imageShade} />
        <Text style={styles.imageCaption}>{t("story_trial.scenario_context.image_caption")}</Text>
      </View>

      <InfoCard
        icon={<Sparkles color={Colors.primaryLight} size={18} />}
        title={t("story_trial.scenario_context.central_conflict_title")}
        body={t("story_trial.scenario_context.central_conflict_body")}
      />
      <InfoCard
        icon={<BookOpen color={Colors.primaryLight} size={18} />}
        title={t("story_trial.scenario_context.learning_goal_title")}
        body={t("story_trial.scenario_context.learning_goal_body")}
      />

      <PrimaryButton label={t("story_trial.scenario_context.cta_start")} onPress={onNext} />
    </View>
  );
}
