import { DarkTheme, ThemeProvider, Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { persistor, store } from "@/stores";
import { AuthBootstrap } from "@/navigation/AuthBootstrap";

function AppLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AnimatedSplashOverlay />
      <AuthBootstrap />

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

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLayout />
      </PersistGate>
    </Provider>
  );
}
