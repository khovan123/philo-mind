import type { Request, Response, NextFunction } from "express";
import { authService, AuthError } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

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
}

export const authController = new AuthController();
