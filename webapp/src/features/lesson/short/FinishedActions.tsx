import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button } from "@/components/ui";

import { styles } from "./ui";

export function FinishedActions() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.actionStack}>
      <Button
        title={t("short_lesson.take_quiz")}
        onPress={() => router.push("/(tabs)/learn")}
        fullWidth
      />
      <Button
        title={t("short_lesson.read_full_lesson")}
        variant="outline"
        onPress={() => router.push("/trial-of-socrates" as never)}
        fullWidth
      />
      <Button
        title={t("short_lesson.explore_more")}
        variant="secondary"
        onPress={() => router.push("/(tabs)/explore")}
        fullWidth
      />
      <Button
        title={t("short_lesson.back_to_home")}
        variant="ghost"
        onPress={() => router.push("/(tabs)")}
        fullWidth
      />
    </View>
  );
}
