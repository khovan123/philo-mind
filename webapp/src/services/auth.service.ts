import { apiRequest } from "@/services/api";
import { clearAuthState, getRefreshToken, setAuthState } from "@/stores/auth.helpers";
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RefreshResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: payload.fullName.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });

    await setAuthState({
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      user: response.user,
    });

    return response;
  },

  async login(payload: LoginPayload) {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });

    await setAuthState({
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      user: response.user,
    });

    return response;
  },

  async refreshToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("Không có refresh token");
    }

    const response = await apiRequest<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    await setAuthState({
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
    });

    return response;
  },

  async logout() {
    try {
      const response = await apiRequest<MessageResponse>("/auth/logout", {
        method: "POST",
      });

      return response;
    } finally {
      await clearAuthState();
    }
  },

  async deleteAccount() {
    const response = await apiRequest<MessageResponse>("/auth/me", {
      method: "DELETE",
    });

    await clearAuthState();
    return response;
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    return apiRequest<MessageResponse>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
      }),
    });
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    return apiRequest<VerifyOtpResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        otp: payload.otp.trim(),
      }),
    });
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await apiRequest<MessageResponse>("/auth/reset", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        resetToken: payload.resetToken,
        newPassword: payload.newPassword,
      }),
    });

    await clearAuthState();
    return response;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const response = await apiRequest<AuthUser>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    await setAuthState({ user: response });
    return response;
  },

  async changePassword(payload: ChangePasswordPayload) {
    return apiRequest<MessageResponse>("/auth/me/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMe() {
    const response = await apiRequest<AuthUser>("/auth/me", {
      method: "GET",
    });

    await setAuthState({ user: response });
    return response;
  },
};
