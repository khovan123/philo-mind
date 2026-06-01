import { baseApi } from "@/services/rtk-api/baseApi";

import type { RootState } from ".";
import { store } from ".";
import {
  authFailed,
  authStateSet,
  hydrateStarted,
  loggedOut,
  type SetAuthStatePayload,
} from "./slices/auth.slice";

export const selectAuth = (state: RootState) => state.auth;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.refreshToken);

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
