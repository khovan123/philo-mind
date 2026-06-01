import { useRouter } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { QuizColors, quizStyles as styles } from "./ui";

type QuizHeaderProps = {
  timer: string;
  title: string;
};

export function QuizHeader({ timer, title }: QuizHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color={QuizColors.primaryLight} size={20} />
        </Pressable>
      </View>
      <ThemedText numberOfLines={1} style={styles.brand}>
        {title}
      </ThemedText>
      <View style={[styles.headerSide, { justifyContent: "flex-end" }]}>
        <View style={styles.timerPill}>
          <Clock color={QuizColors.primaryLight} size={14} />
          <ThemedText style={styles.timerText}>{timer}</ThemedText>
        </View>
      </View>
    </View>
  );
}
