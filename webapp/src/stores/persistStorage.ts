import * as SecureStore from "expo-secure-store";
import type { Storage } from "redux-persist";

export const securePersistStorage: Storage = {
  async getItem(key: string) {
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};
