import type { Request, Response, NextFunction } from "express";
import { authService, AuthError } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { env } from "../config/env.js";

// ── T-001: Auth Controller ─────────────────────────────────

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 201);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      return sendSuccess(res, result, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      await authService.logout(userId);
      return sendSuccess(res, { message: "Đã đăng xuất thành công" }, 200);
    } catch (err) {
      return next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      return sendSuccess(res, user, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.sendPasswordReset(email);
      return sendSuccess(res, { message: "OTP đã được gửi nếu email tồn tại" }, 200);
    } catch (err) {
      return next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyPasswordReset(email, otp);
      return sendSuccess(res, result, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, resetToken, newPassword } = req.body;
      await authService.resetPassword(email, resetToken, newPassword);
      return sendSuccess(res, { message: "Mật khẩu đã được đặt lại" }, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.updateProfile(req.user!.id, req.body);
      return sendSuccess(res, user, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user!.id, currentPassword, newPassword);
      return sendSuccess(res, { message: "Mật khẩu đã được thay đổi" }, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.deleteAccount(req.user!.id);
      return sendSuccess(res, { message: "Yêu cầu xóa tài khoản đã được ghi nhận" }, 200);
    } catch (err) {
      if (err instanceof AuthError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async initiateGoogleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const redirectUri = req.query.redirect_uri;

      if (!redirectUri || typeof redirectUri !== "string") {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_REDIRECT_URI",
            message: "Missing redirect_uri query parameter",
          },
        });
      }

      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
          success: false,
          error: {
            code: "GOOGLE_AUTH_NOT_CONFIGURED",
            message: "Google OAuth is not configured",
          },
        });
      }

      const callbackUri =
        env.GOOGLE_CALLBACK_URL ||
        `${req.protocol}://${req.get("host")}/api/v1/auth/google/callback`;

      console.warn("[Google OAuth] callbackUri =", callbackUri);
      console.warn("[Google OAuth] clientId =", env.GOOGLE_CLIENT_ID);
      console.warn("[Google OAuth] secret prefix =", env.GOOGLE_CLIENT_SECRET?.slice(0, 8));
      console.warn("[Google OAuth] secret length =", env.GOOGLE_CLIENT_SECRET?.length);

      const authorizeUrl =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${encodeURIComponent(env.GOOGLE_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(callbackUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent("openid email profile")}` +
        `&state=${encodeURIComponent(redirectUri)}`;

      return res.redirect(authorizeUrl);
    } catch (err) {
      return next(err);
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state: redirectUri } = req.query;

      if (!code || typeof code !== "string" || !redirectUri || typeof redirectUri !== "string") {
        return res.status(400).send("Missing code or redirect_uri");
      }

      const callbackUri = `${req.protocol}://${req.get("host")}/api/v1/auth/google/callback`;

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID!,
          client_secret: env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: callbackUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("[Google OAuth] Token exchange failed:", errorText);
        return res.status(400).send("Failed to exchange authentication code with Google");
      }
      const tokenData = (await tokenResponse.json()) as { id_token?: string };
      const idToken = tokenData.id_token;

      if (!idToken) {
        return res.status(400).send("No id_token received from Google");
      }

      const infoResponse = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );
      if (!infoResponse.ok) {
        return res.status(400).send("Failed to verify Google token info");
      }

      const profile = (await infoResponse.json()) as {
        email?: string;
        name?: string;
        picture?: string;
      };

      const email = profile.email;
      if (!email) {
        return res.status(400).send("Email not found in Google profile");
      }

      const fullName = profile.name || "Google User";
      const avatarUrl = profile.picture || null;

      const result = await authService.googleLogin(email, fullName, avatarUrl);

      // Redirect back to app
      const separator = redirectUri.includes("?") ? "&" : "?";
      return res.redirect(
        `${redirectUri}${separator}accessToken=${result.tokens.accessToken}&refreshToken=${result.tokens.refreshToken}`,
      );
    } catch (err) {
      if (err instanceof AuthError) {
        return res.status(err.statusCode).send(err.message);
      }
      return next(err);
    }
  }
}

export const authController = new AuthController();
