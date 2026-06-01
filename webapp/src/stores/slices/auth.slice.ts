import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthTokens, AuthUser } from "@/types/auth";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

export type SetAuthStatePayload = {
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
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "unauthenticated",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateStarted: (state) => {
      state.status = "loading";
      state.error = null;
    },

    authStateSet: (state, action: PayloadAction<SetAuthStatePayload>) => {
      const nextUser = action.payload.user !== undefined ? action.payload.user : state.user;

      const nextAccessToken =
        action.payload.accessToken !== undefined ? action.payload.accessToken : state.accessToken;

      const nextRefreshToken =
        action.payload.refreshToken !== undefined
          ? action.payload.refreshToken
          : state.refreshToken;

      state.user = nextUser;
      state.accessToken = nextAccessToken;
      state.refreshToken = nextRefreshToken;
      state.status = nextAccessToken && nextRefreshToken ? "authenticated" : "unauthenticated";
      state.error = null;
    },

    tokenReceived: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.status = "authenticated";
      state.error = null;
    },

    authFailed: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },

    authErrorCleared: (state) => {
      state.error = null;

      if (state.status === "error") {
        state.status =
          state.accessToken && state.refreshToken ? "authenticated" : "unauthenticated";
      }
    },
    loggedOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "unauthenticated";
      state.error = null;
    },
  },
});
feat/T-B08-auth-redux-toolkit-slice-redux-persist-loginregisterlogoutcheckauth
export const {
  hydrateStarted,
  authStateSet,
  tokenReceived,
  authFailed,
  authErrorCleared,
  loggedOut,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
