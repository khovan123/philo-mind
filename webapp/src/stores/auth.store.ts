import { create } from "zustand";

import { clearTokens, getTokens, setTokens } from "@/services/auth/tokenStorage";
import type { AuthTokens, AuthUser } from "@/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

type SetAuthStatePayload = {
  user?: AuthUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;

  hydrateAuthState: () => Promise<void>;
  setAuthState: (payload: SetAuthStatePayload) => Promise<void>;
  clearAuthState: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,

  hydrateAuthState: async () => {
    set({ status: "loading", error: null });

    try {
      const tokens = await getTokens();

      if (!tokens) {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          status: "unauthenticated",
          error: null,
        });
        return;
      }

      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        status: "authenticated",
        error: null,
      });
    } catch (error) {
      set({
        status: "error",
        error: error instanceof Error ? error.message : "Không thể đọc token",
      });
    }
  },

  setAuthState: async (payload) => {
    const current = get();

    const nextAccessToken =
      payload.accessToken !== undefined ? payload.accessToken : current.accessToken;

    const nextRefreshToken =
      payload.refreshToken !== undefined ? payload.refreshToken : current.refreshToken;

    const nextUser = payload.user !== undefined ? payload.user : current.user;

    if (nextAccessToken && nextRefreshToken) {
      const tokens: AuthTokens = {
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
      };

      await setTokens(tokens);
    }

    set({
      user: nextUser,
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      status: nextAccessToken && nextRefreshToken ? "authenticated" : current.status,
      error: null,
    });
  },

  clearAuthState: async () => {
    await clearTokens();

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: "unauthenticated",
      error: null,
    });
  },
}));

export function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

export function getRefreshToken() {
  return useAuthStore.getState().refreshToken;
}

export function getAuthUser() {
  return useAuthStore.getState().user;
}

export async function setAuthState(payload: SetAuthStatePayload) {
  return useAuthStore.getState().setAuthState(payload);
}

export async function clearAuthState() {
  return useAuthStore.getState().clearAuthState();
}

export async function hydrateAuthState() {
  return useAuthStore.getState().hydrateAuthState();
}
