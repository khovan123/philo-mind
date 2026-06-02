import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

// ── T-002: Auth Middleware ─────────────────────────────────

// Extend Express Request to include authenticated user
// Using module augmentation (declaration merging)
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      fullName: string;
      role: string;
    };
    tokenPayload?: JwtPayload;
  }
}

/**
 * JWT authentication guard.
 * Extracts Bearer token, verifies it, and attaches user to req.
 */
export async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, "UNAUTHORIZED", "Token không được cung cấp", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendError(res, "UNAUTHORIZED", "Token không hợp lệ", 401);
    }

    let payload: JwtPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (err: unknown) {
      const errorName = err instanceof Error ? err.name : "UnknownError";
      if (errorName === "TokenExpiredError") {
        return sendError(res, "TOKEN_EXPIRED", "Token đã hết hạn", 401);
      }
      return sendError(res, "INVALID_TOKEN", "Token không hợp lệ", 401);
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return sendError(res, "USER_NOT_FOUND", "Người dùng không tồn tại", 401);
    }

    req.user = user;
    req.tokenPayload = payload;

    return next();
  } catch {
    return sendError(res, "AUTH_ERROR", "Lỗi xác thực", 500);
  }
}

/**
 * Role-based access guard. Must be used after authGuard.
 */
export function roleGuard(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "UNAUTHORIZED", "Chưa xác thực", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "FORBIDDEN", "Bạn không có quyền truy cập tài nguyên này", 403);
    }

    return next();
  };
}

/**
 * Optional JWT authentication middleware.
 * If token is provided, verifies it and attaches user to req.
 * If not provided or invalid, continues without blocking.
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next();
    }

    let payload: JwtPayload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return next();
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (user && user.isActive) {
      req.user = user;
      req.tokenPayload = payload;
    }

    return next();
  } catch {
    return next();
  }
}
