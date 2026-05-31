import { apiRequest } from "@/services/api";
import { setAuthState, clearAuthState } from "@/stores/auth.store";
import type { AuthUser } from "@/types/auth";

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
  user: AuthUser;
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

  async forgotPassword(email: string) {
    const response = await apiRequest<{ message: string }>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return response;
  },

  async verifyOtp(email: string, otp: string) {
    const response = await apiRequest<{ resetToken: string }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    return response;
  },

  async resetPassword(email: string, resetToken: string, newPassword: string) {
    const response = await apiRequest<{ message: string }>("/auth/reset", {
      method: "POST",
      body: JSON.stringify({ email, resetToken, newPassword }),
    });

    // Clear auth state to require login with new password
    clearAuthState();
    return response;
  },

  async updateProfile(payload: { fullName?: string; avatarUrl?: string | null }) {
    const response = await apiRequest<AuthUser>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    // Update local auth state with new profile data
    setAuthState({ user: response });
    return response;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await apiRequest<{ message: string }>("/auth/me/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return response;
  },

  async getMe() {
    const response = await apiRequest<AuthUser>("/auth/me", {
      method: "GET",
    });

    setAuthState({ user: response });
    return response;
  },
};
