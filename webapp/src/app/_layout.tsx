import { useEffect } from "react";
import { DarkTheme, ThemeProvider, Stack } from "expo-router";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { hydrateAuthState } from "@/stores/auth.store";

export default function RootLayout() {
  useEffect(() => {
    void hydrateAuthState();
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <AnimatedSplashOverlay />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(lesson)" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="mindmap" />
        <Stack.Screen name="minigames" />
        <Stack.Screen name="story" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
