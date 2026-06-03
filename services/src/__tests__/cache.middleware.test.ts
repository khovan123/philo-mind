import { jest } from "@jest/globals";

// Mock env before any imports
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
  },
}));

const mockIsConnected = jest.fn() as any;
const mockGet = jest.fn() as any;
const mockSet = jest.fn() as any;
const mockDelPattern = jest.fn() as any;

jest.unstable_mockModule("../services/redis.service.js", () => ({
  redis: {
    isConnected: mockIsConnected,
    get: mockGet,
    set: mockSet,
    delPattern: mockDelPattern,
  },
}));

const { cacheMiddleware, invalidateCachePattern } =
  await import("../middleware/cache.middleware.js");

describe("Cache Middleware & Utilities", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      method: "GET",
      baseUrl: "/api/v1/stories",
      path: "/some-story-id/stats",
      query: {},
    };
    res = {
      headers: {} as Record<string, string>,
      statusCode: 200,
      setHeader(name: string, value: string) {
        this.headers[name] = value;
        return this;
      },
      send: jest.fn().mockImplementation(function (this: any) {
        return this;
      }),
    };
    next = jest.fn();
  });

  describe("cacheMiddleware", () => {
    it("should bypass cache if request method is not GET", async () => {
      req.method = "POST";
      const middleware = cacheMiddleware(300);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(mockIsConnected).not.toHaveBeenCalled();
    });

    it("should set X-Cache to BYPASS if redis is not connected", async () => {
      mockIsConnected.mockReturnValue(false);
      const middleware = cacheMiddleware(300);
      await middleware(req, res, next);

      expect(res.headers["X-Cache"]).toBe("BYPASS");
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should return cached data and set X-Cache to HIT on cache hit", async () => {
      mockIsConnected.mockReturnValue(true);
      const cachedPayload = JSON.stringify({ data: "cached" });
      mockGet.mockResolvedValue(cachedPayload);

      const middleware = cacheMiddleware(300);
      await middleware(req, res, next);

      expect(mockGet).toHaveBeenCalledWith("cache:api:/api/v1/stories/some-story-id/stats");
      expect(res.headers["X-Cache"]).toBe("HIT");
      expect(res.headers["Content-Type"]).toBe("application/json");
      expect(res.send).toHaveBeenCalledWith(cachedPayload);
      expect(next).not.toHaveBeenCalled();
    });

    it("should set X-Cache to MISS and cache response on successful status", async () => {
      mockIsConnected.mockReturnValue(true);
      mockGet.mockResolvedValue(null);
      mockSet.mockResolvedValue(undefined as any);

      const middleware = cacheMiddleware(300);
      await middleware(req, res, next);

      expect(res.headers["X-Cache"]).toBe("MISS");
      expect(next).toHaveBeenCalledTimes(1);

      // Simulate controller sending response
      const responseData = { success: true };
      res.send(responseData);

      // Verify original send was called
      expect(res.send).toHaveBeenCalledWith(responseData);

      // Allow microtasks to execute so set promise completes
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockSet).toHaveBeenCalledWith(
        "cache:api:/api/v1/stories/some-story-id/stats",
        JSON.stringify(responseData),
        300,
      );
    });

    it("should not cache response if status code is not 2xx", async () => {
      mockIsConnected.mockReturnValue(true);
      mockGet.mockResolvedValue(null);

      const middleware = cacheMiddleware(300);
      await middleware(req, res, next);

      expect(res.headers["X-Cache"]).toBe("MISS");
      expect(next).toHaveBeenCalledTimes(1);

      // Change status to error
      res.statusCode = 500;
      const responseData = { error: "Internal Server Error" };
      res.send(responseData);

      await new Promise((resolve) => setImmediate(resolve));

      expect(mockSet).not.toHaveBeenCalled();
    });
  });

  describe("invalidateCachePattern", () => {
    it("does nothing if redis is not connected", async () => {
      mockIsConnected.mockReturnValue(false);
      await invalidateCachePattern("pattern");
      expect(mockDelPattern).not.toHaveBeenCalled();
    });

    it("calls delPattern when redis is connected", async () => {
      mockIsConnected.mockReturnValue(true);
      mockDelPattern.mockResolvedValue(undefined);

      await invalidateCachePattern("pattern");

      expect(mockDelPattern).toHaveBeenCalledWith("pattern");
    });
  });
});
