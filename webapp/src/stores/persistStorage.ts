import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { Storage } from "redux-persist";

function normalizeSecureStoreKey(key: string) {
  return key.replace(/[^A-Za-z0-9._-]/g, "_");
}

export const securePersistStorage: Storage = {
  async getItem(key: string) {
    const safeKey = normalizeSecureStoreKey(key);
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(safeKey);
      }
      return null;
    }
    return SecureStore.getItemAsync(safeKey);
  },

  async setItem(key: string, value: string) {
    const safeKey = normalizeSecureStoreKey(key);
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(safeKey, value);
      }
      return;
    }
    await SecureStore.setItemAsync(safeKey, value);
  },

  async removeItem(key: string) {
    const safeKey = normalizeSecureStoreKey(key);
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(safeKey);
      }
      return;
    }
    await SecureStore.deleteItemAsync(safeKey);
  },
};
