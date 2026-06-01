import { useRouter } from "expo-router";
import type React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ShortLessonHeader } from "./ShortLessonHeader";
import { styles } from "./ui";

type StateScaffoldProps = {
  children: React.ReactNode;
  title: string;
};

export function StateScaffold({ children, title }: StateScaffoldProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <ShortLessonHeader title={title} countLabel="-" progress={0} onBack={() => router.back()} />
        <View style={styles.stateBody}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
