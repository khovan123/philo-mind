import type { Response } from "express";

// ── T-004: Standardized Response Format ────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Send a successful JSON response.
 */
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
  } satisfies ApiSuccessResponse<T>);
}

/**
 * Send a paginated JSON response.
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  statusCode: number = 200,
): void {
  res.status(statusCode).json({
    success: true,
    data,
    meta,
  } satisfies ApiSuccessResponse<T[]>);
}

/**
 * Send an error JSON response.
 */
export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: unknown,
): void {
  res.status(statusCode).json({
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  } satisfies ApiErrorResponse);
}

/**
 * Build pagination meta from query params.
 */
export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Parse pagination query params with defaults.
 */
export function parsePagination(query: { page?: string; limit?: string }): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.min(10000, Math.max(1, parseInt(query.page ?? "1", 10) || 1));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
