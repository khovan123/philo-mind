import type { Request, Response, NextFunction } from "express";
import { type ZodObject, type ZodRawShape, ZodError } from "zod";
import { sendError } from "../utils/response.js";

// ── T-003: Generic Validation Middleware ────────────────────

/**
 * Validate req.body / req.query / req.params against a Zod schema.
 * Strips unknown fields from validated input.
 */
export function validate(schema: ZodObject<ZodRawShape>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace with validated (stripped) data
      // Note: req.query is a getter-only property in Express 5 and cannot be reassigned directly.
      // We use Object.defineProperty to shadow/override it safely on the request instance.
      const result = parsed as Record<string, unknown>;

      // req.body is writable in Express — replace directly
      req.body = result.body ?? req.body;

      req.params = (result.params as typeof req.params) ?? req.params;
      if (result.query) {
        Object.defineProperty(req, "query", {
          value: result.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues ?? [];
        const details = issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return sendError(res, "VALIDATION_ERROR", "Dữ liệu không hợp lệ", 400, details);
      }

      return next(error);
    }
  };
}