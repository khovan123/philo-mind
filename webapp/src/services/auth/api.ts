import { baseApi } from "@/services/rtk-api/baseApi";
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    checkAuth: builder.query<AuthUser, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordPayload>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpPayload>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordPayload>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    updateProfile: builder.mutation<AuthUser, UpdateProfilePayload>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    changePassword: builder.mutation<MessageResponse, ChangePasswordPayload>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useCheckAuthQuery,
  useLazyCheckAuthQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
