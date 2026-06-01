import * as SecureStore from "expo-secure-store";
import type { Storage } from "redux-persist";

function normalizeSecureStoreKey(key: string) {
  return key.replace(/[^A-Za-z0-9._-]/g, "_");
}

export const securePersistStorage: Storage = {
  async getItem(key: string) {
    return SecureStore.getItemAsync(normalizeSecureStoreKey(key));
  },

  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(normalizeSecureStoreKey(key), value);
  },

  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(normalizeSecureStoreKey(key));
  },
};
