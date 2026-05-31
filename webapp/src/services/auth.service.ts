import { apiRequest } from "@/services/api";
import { setAuthState, clearAuthState } from "@/stores/auth.store";
import type { UserProfile } from "@/types/auth";

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: UserProfile;
  tokens: AuthTokens;
};

export const authService = {
  async register(payload: RegisterPayload) {
    console.log("[Auth] Register attempt:", {
      fullName: payload.fullName,
      email: payload.email,
    });

    try {
      const response = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAuthState({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        user: response.user,
      });

      console.log("[Auth] Register success:", response.user.id);
      return response;
    } catch (error) {
      console.error("[Auth] Register failed:", error);
      throw error;
    }
  },

  async deleteAccount() {
    const response = await apiRequest<{ message: string }>("/auth/me", {
      method: "DELETE",
    });

    clearAuthState();
    return response;
  },
};
