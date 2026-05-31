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
      const result = parsed as Record<string, any>;
      req.body = result.body ?? req.body;

      if (result.query) {
        Object.defineProperty(req, "query", {
          value: result.query,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }

      if (result.params) {
        Object.defineProperty(req, "params", {
          value: result.params,
          writable: true,
          enumerable: true,
          configurable: true,
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
