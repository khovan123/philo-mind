import type React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuizHeader } from "./QuizHeader";
import { quizStyles as styles } from "./ui";

type QuizStateProps = {
  children: React.ReactNode;
  title: string;
};

export function QuizState({ children, title }: QuizStateProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <QuizHeader title={title} timer="05:00" />
        <View style={styles.stateBody}>
          <View style={styles.stateCard}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}
