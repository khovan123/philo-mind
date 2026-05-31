import type { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

// Rate limiter for forgot password flow. Uses Redis when REDIS_URL is set,
// otherwise falls back to a local in-memory limiter (single-node dev only).

const WINDOW_SECONDS = 60 * 60; // 1 hour
const MAX_ATTEMPTS = 5;

let redis: Redis | null = null;
function getRedisClient() {
  if (redis) return redis;
  const url = process.env.REDIS_URL || process.env.REDIS_HOST;
  if (!url) return null;
  redis = new Redis(url);
  redis.on("error", (err) => console.error("Redis error in rateLimit middleware:", err));
  return redis;
}

// simple in-memory fallback
const store = new Map<string, { count: number; firstAt: number }>();

export async function emailRateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.body && req.body.email) || req.query.email || req.ip;
    if (!email) return next();

    const key = `rl:forgot:${String(email).toLowerCase()}`;
    const r = getRedisClient();
    if (r) {
      // Redis flow: INCR + EXPIRE atomically when new
      const attempts = await r.incr(key);
      if (attempts === 1) {
        await r.expire(key, WINDOW_SECONDS);
      }
      if (attempts > MAX_ATTEMPTS) {
        return res.status(429).json({ success: false, message: "Quá nhiều yêu cầu. Vui lòng thử lại sau." });
      }
      return next();
    }

    // fallback: in-memory
    const now = Date.now();
    const entry = store.get(key);
    if (!entry) {
      store.set(key, { count: 1, firstAt: now });
      return next();
    }
    if (now - entry.firstAt > WINDOW_SECONDS * 1000) {
      store.set(key, { count: 1, firstAt: now });
      return next();
    }
    if (entry.count >= MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: "Quá nhiều yêu cầu. Vui lòng thử lại sau." });
    }
    entry.count += 1;
    store.set(key, entry);
    return next();
  } catch (err) {
    // On error, fallback to allowing request so functionality isn't blocked
    console.error("emailRateLimit error:", err);
    return next();
  }
}
