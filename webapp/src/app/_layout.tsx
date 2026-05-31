import { DarkTheme, ThemeProvider, Stack } from "expo-router";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AnimatedSplashOverlay />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(lesson)" />
        <Stack.Screen name="story" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
