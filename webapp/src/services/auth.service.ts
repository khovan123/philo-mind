import { apiRequest } from "@/services/api";

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
    createdAt?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export const authService = {
  async register(payload: RegisterPayload) {
    console.log("[Auth] Register attempt:", {
      fullName: payload.fullName,
      email: payload.email,
    });

    try {
      const response = await apiRequest<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("[Auth] Register success:", response.user.id);

      return response;
    } catch (error) {
      console.error("[Auth] Register failed:", error);
      throw error;
    }
  },
};
