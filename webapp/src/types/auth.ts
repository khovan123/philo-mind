export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  createdAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type RefreshResponse = {
  tokens: AuthTokens;
};
