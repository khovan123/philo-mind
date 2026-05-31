import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors, steps } from "./data";
import { styles } from "./ui";

type LessonTopBarProps = {
  stepIndex: number;
  onBack: () => void;
};

export function LessonTopBar({ stepIndex, onBack }: LessonTopBarProps) {
  return (
    <View style={styles.topBar}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
        <ArrowLeft color={Colors.primaryLight} size={20} />
      </Pressable>

      <View style={styles.topTitleBlock}>
        <Text style={styles.lessonEyebrow}>The Trial of Socrates</Text>
        <Text style={styles.stepText}>
          Step {stepIndex + 1} of {steps.length} · {steps[stepIndex]}
        </Text>
      </View>

      <View style={styles.menuDots}>
        <View style={styles.dotSmall} />
        <View style={styles.dotSmall} />
        <View style={styles.dotSmall} />
      </View>
    </View>
  );
}
