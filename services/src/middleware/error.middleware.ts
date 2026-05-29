import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

// ── T-006: Global Error Handler ────────────────────────────

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req: Request, res: Response) {
  sendError(res, "NOT_FOUND", `Route ${req.method} ${req.originalUrl} không tồn tại`, 404);
}

/**
 * Global error handler — catches all unhandled errors.
 */
export function errorHandler(
  err: Error & { statusCode?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("❌ Unhandled error:", err.stack || err.message);

  const statusCode = err.statusCode ?? 500;
  const code = err.code ?? "INTERNAL_SERVER_ERROR";
  const message =
    process.env.NODE_ENV === "production" ? "Đã xảy ra lỗi, vui lòng thử lại sau" : err.message;

  sendError(res, code, message, statusCode);
}
