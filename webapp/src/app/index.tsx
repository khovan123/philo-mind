import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppSelector } from "@/stores/hooks";

export default function IndexScreen() {
  const { status, accessToken, refreshToken } = useAppSelector((state) => state.auth);

  if (status === "idle" || status === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (accessToken && refreshToken) {
    return <Redirect href="/(tabs)" />;
  }

  // Cast to any because generated route union types may not include dynamic group paths
  return <Redirect href={"/(auth)/login" as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
