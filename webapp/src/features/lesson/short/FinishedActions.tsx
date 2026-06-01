import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui";

import { styles } from "./ui";

export function FinishedActions() {
  const router = useRouter();

  return (
    <View style={styles.actionStack}>
      <Button title="Take Quiz" onPress={() => router.push("/learn")} fullWidth />
      <Button
        title="Read Full Lesson"
        variant="outline"
        onPress={() => router.push("/trial-of-socrates" as never)}
        fullWidth
      />
      <Button
        title="Explore More"
        variant="secondary"
        onPress={() => router.push("/explore")}
        fullWidth
      />
      <Button title="Back to Home" variant="ghost" onPress={() => router.push("/")} fullWidth />
    </View>
  );
}
