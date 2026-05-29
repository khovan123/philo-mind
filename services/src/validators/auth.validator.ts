import { z } from "zod";

// ── T-003: Auth Validation Schemas ─────────────────────────

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(100, "Mật khẩu tối đa 100 ký tự"),
    fullName: z.string().min(2, "Tên tối thiểu 2 ký tự").max(150, "Tên tối đa 150 ký tự"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshInput = z.infer<typeof refreshSchema>["body"];
