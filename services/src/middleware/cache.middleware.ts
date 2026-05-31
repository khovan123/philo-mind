import type { Request, Response, NextFunction } from "express";
import { redis } from "../services/redis.service.js";
import { buildCacheKey } from "../utils/cache-key.js";

// ── T-A20: Redis Caching Middleware ──────────────────────────

export const HOT_ENDPOINT_CACHE_TTL_SECONDS = 300;

export function cacheMiddleware(ttlSeconds: number = HOT_ENDPOINT_CACHE_TTL_SECONDS) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    if (!redis.isConnected()) {
      res.setHeader("X-Cache", "BYPASS");
      return next();
    }

    const cacheKey = buildCacheKey(req.baseUrl || "", req.path, req.query);

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Content-Type", "application/json");
        return res.send(cachedData);
      }

      // Cache miss: intercept response body
      res.setHeader("X-Cache", "MISS");

      const originalSend = res.send;
      res.send = function (body: unknown): Response {
        // Restore original send to actually send the response
        res.send = originalSend;

        // Cache only successful JSON responses (status 200-299)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (typeof body === "string") {
            redis.set(cacheKey, body, ttlSeconds).catch((err) => {
              console.error(`❌ Failed to set cache for key ${cacheKey}:`, err);
            });
          } else if (typeof body === "object" && body !== null) {
            try {
              const stringified = JSON.stringify(body);
              redis.set(cacheKey, stringified, ttlSeconds).catch((err) => {
                console.error(`❌ Failed to set cache for key ${cacheKey}:`, err);
              });
            } catch (err) {
              console.error("❌ Failed to stringify object for Redis caching:", err);
            }
          }
        }

        return originalSend.call(this, body);
      };

      next();
    } catch (err) {
      console.error(`❌ Cache middleware error for key ${cacheKey}:`, err);
      next();
    }
  };
}

/**
 * Utility to invalidate caches by matching pattern.
 * E.g., invalidateCachePattern("cache:api:/api/v1/topics*")
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (!redis.isConnected()) return;
  try {
    await redis.delPattern(pattern);
    console.warn(`🧹 Cache invalidated for pattern: ${pattern}`);
  } catch (err) {
    console.error(`❌ Failed to invalidate cache pattern ${pattern}:`, err);
  }
}
