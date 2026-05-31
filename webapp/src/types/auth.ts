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

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  resetToken: string;
};

export type ResetPasswordPayload = {
  email: string;
  resetToken: string;
  newPassword: string;
};

export type UpdateProfilePayload = {
  fullName?: string;
  avatarUrl?: string | null;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type MessageResponse = {
  message: string;
};
