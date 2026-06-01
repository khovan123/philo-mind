import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

const windowMs = 60 * 1000;

type Entry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, Entry>();

export function aiRateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const key: string = req.user?.id ?? req.ip ?? "anonymous";

    const now = Date.now();
    const defaultLimit = env.AI_RATE_LIMIT_PER_MIN;

    const entry = store.get(key);

    if (!entry || now - entry.windowStart >= windowMs) {
      store.set(key, {
        count: 1,
        windowStart: now,
      });

      return next();
    }

    if (entry.count >= defaultLimit) {
      return sendError(
        res,
        "RATE_LIMIT_EXCEEDED",
        `Rate limit exceeded (${defaultLimit}/min)`,
        429,
      );
    }

    entry.count++;

    store.set(key, entry);

    return next();
  } catch (err) {
    return next(err);
  }
}
