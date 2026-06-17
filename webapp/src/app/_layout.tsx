import { Stack } from "expo-router";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as WebBrowser from "expo-web-browser";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { persistor, store } from "@/stores";
import { AuthBootstrap } from "@/navigation/AuthBootstrap";
import i18n from "@/lib/i18n";
import { useAppSelector } from "@/stores/hooks";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

function AppLayout() {
  const language = useAppSelector((state) => state.settings.language);

  useEffect(() => {
    if (language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <ThemeProvider value={DarkTheme}>
      <AnimatedSplashOverlay />
      <AuthBootstrap />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="auth-callback" />
        <Stack.Screen name="(lesson)" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="mindmap" />
        <Stack.Screen name="minigames" />
        <Stack.Screen name="story" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="study-plan" />
        <Stack.Screen name="concept-comparison" />
        <Stack.Screen name="chapter/[chapter]/[muc]" />
        <Stack.Screen name="debates" />
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
