import { ArrowLeft, School } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { ProgressBar } from "./ProgressBar";
import { Colors, styles } from "./ui";

type ShortLessonHeaderProps = {
  countLabel: string;
  progress: number;
  title: string;
  onBack: () => void;
};

export function ShortLessonHeader({ countLabel, progress, title, onBack }: ShortLessonHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
          <ArrowLeft color={Colors.primaryLight} size={22} />
        </Pressable>

        <View style={styles.headerTitleBlock}>
          <ThemedText style={styles.headerTitle}>{title}</ThemedText>
          <ThemedText style={styles.headerCount}>{countLabel}</ThemedText>
        </View>

        <Pressable accessibilityRole="button" style={styles.iconButton}>
          <School color={Colors.primaryLight} size={21} />
        </Pressable>
      </View>

      <ProgressBar value={progress} />
    </View>
  );
}
