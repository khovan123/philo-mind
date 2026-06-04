import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import type { AuthTokens } from "@/types/auth";

const ACCESS_TOKEN_KEY = "philo_mind.access_token";
const REFRESH_TOKEN_KEY = "philo_mind.refresh_token";

function canUseWebStorage() {
  return Platform.OS === "web" && typeof window !== "undefined" && !!window.localStorage;
}

export async function setTokens(tokens: AuthTokens) {
  if (canUseWebStorage()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function getTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = canUseWebStorage()
    ? [window.localStorage.getItem(ACCESS_TOKEN_KEY), window.localStorage.getItem(REFRESH_TOKEN_KEY)]
    : await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
}

export async function clearTokens() {
  if (canUseWebStorage()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
