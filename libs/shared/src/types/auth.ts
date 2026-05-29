// ── Auth DTOs ──────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}
