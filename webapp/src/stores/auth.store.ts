import type { AuthUser } from "@/types/auth";

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser | null;
};

let authState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  user: null,
};

export function getAccessToken(): string | undefined {
  return authState.accessToken;
}

export function getRefreshToken(): string | undefined {
  return authState.refreshToken;
}

export function getAuthUser(): AuthUser | null | undefined {
  return authState.user;
}

export function setAuthState(state: Partial<AuthState>) {
  authState = {
    ...authState,
    ...state,
  };
}

export function clearAuthState() {
  authState = {
    accessToken: undefined,
    refreshToken: undefined,
    user: null,
  };
}
