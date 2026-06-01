import { baseApi } from "@/services/rtk-api/baseApi";

import { store } from ".";
import {
  authFailed,
  authStateSet,
  hydrateStarted,
  loggedOut,
  type SetAuthStatePayload,
} from "./slices/auth.slice";

export function getAccessToken() {
  return store.getState().auth.accessToken;
}

export function getRefreshToken() {
  return store.getState().auth.refreshToken;
}

export function getAuthUser() {
  return store.getState().auth.user;
}

export async function hydrateAuthState() {
  store.dispatch(hydrateStarted());
}

export async function setAuthState(payload: SetAuthStatePayload) {
  try {
    store.dispatch(authStateSet(payload));
  } catch (error) {
    store.dispatch(
      authFailed(error instanceof Error ? error.message : "Không thể cập nhật auth state"),
    );
  }
}

export async function clearAuthState() {
  store.dispatch(loggedOut());
  store.dispatch(baseApi.util.resetApiState());
}
