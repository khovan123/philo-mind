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
      const result = parsed as Record<string, unknown>;

      // req.body is writable in Express — replace directly
      req.body = result.body ?? req.body;

      // req.query / req.params may be getter-only depending on platform; mutate safely
      const safeAssign = (target: any, value: any) => {
        if (!value) return;
        try {
          // Prefer copying properties into existing object to avoid setter-only issues
          if (typeof target === "object" && target && !Array.isArray(target)) {
            Object.assign(target, value);
          } else {
            // Fallback to direct assignment
            (target as any) = value;
          }
        } catch {
          // If assignment fails, ignore — validation already enforced and we keep original
        }
      };

      safeAssign(req.query, result.query);
      safeAssign(req.params, result.params);

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
