import Redis from "ioredis";
import { env } from "../config/env.js";

// ── T-A20: Redis Connection Service ─────────────────────────

let redisClient: Redis | null = null;
let isConnected = false;

const redisUrl = env.REDIS_URL || "redis://localhost:6379";

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 3) {
        console.error("❌ Redis connection failed permanently after 3 attempts.");
        return null;
      }
      return Math.min(times * 200, 1000);
    },
  });

  redisClient.on("connect", () => {
    isConnected = true;
    console.warn("🚀 Connected to Redis successfully.");
  });

  redisClient.on("error", (err: Error) => {
    isConnected = false;
    console.error("❌ Redis Error:", err.message);
  });

  redisClient.on("close", () => {
    isConnected = false;
    console.warn("⚠️ Redis connection closed.");
  });
} catch (err) {
  console.error("❌ Failed to initialize Redis client:", err);
}

export const redis = {
  getClient(): Redis | null {
    return redisClient;
  },

  async get(key: string): Promise<string | null> {
    if (!redisClient || !isConnected) return null;
    try {
      return await redisClient.get(key);
    } catch (err) {
      console.error(`❌ Redis GET Error for key ${key}:`, err);
      return null;
    }
  },

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!redisClient || !isConnected) return;
    try {
      await redisClient.set(key, value, "EX", ttlSeconds);
    } catch (err) {
      console.error(`❌ Redis SET Error for key ${key}:`, err);
    }
  },

  async del(key: string): Promise<void> {
    if (!redisClient || !isConnected) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error(`❌ Redis DEL Error for key ${key}:`, err);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!redisClient || !isConnected) return;
    try {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } while (cursor !== "0");
    } catch (err) {
      console.error(`❌ Redis delPattern Error for pattern ${pattern}:`, err);
    }
  },

  isConnected(): boolean {
    return isConnected;
  },
};
