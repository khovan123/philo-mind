/**
 * T-E01: Rate limit middleware tests
 * Closes #83
 */
import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

// Mock env
jest.unstable_mockModule("../config/env.js", () => ({
  env: { AI_RATE_LIMIT_PER_MIN: 3 },
}));

const { aiRateLimit } = await import("../middleware/ai-rate-limit.js");

function createMockReq(userId?: string, ip?: string): Partial<Request> {
  return {
    user: userId ? ({ id: userId } as Request["user"]) : undefined,
    ip: ip ?? "127.0.0.1",
  };
}

function createMockRes(): Partial<Response> {
  const json = jest.fn();
  return {
    status: jest.fn().mockReturnValue({ json }),
    json,
  } as unknown as Partial<Response>;
}

describe("AI Rate Limit Middleware", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows first request", () => {
    const req = createMockReq("user-fresh-1");
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    aiRateLimit(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("allows requests under the limit", () => {
    const req = createMockReq("user-under-limit");
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    aiRateLimit(req as Request, res as Response, next);
    aiRateLimit(req as Request, res as Response, next);
    aiRateLimit(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(3);
  });

  it("blocks requests exceeding the limit", () => {
    const userId = "user-over-limit-" + Date.now();
    const next: NextFunction = jest.fn();

    // Hit limit (3 allowed)
    for (let i = 0; i < 3; i++) {
      const req = createMockReq(userId);
      const res = createMockRes();
      aiRateLimit(req as Request, res as Response, next);
    }

    expect(next).toHaveBeenCalledTimes(3);

    // 4th request should be blocked
    const req = createMockReq(userId);
    const res = createMockRes();
    aiRateLimit(req as Request, res as Response, next);

    // next should NOT be called a 4th time
    expect(next).toHaveBeenCalledTimes(3);
  });

  it("resets limit after window expires", () => {
    const userId = "user-reset-" + Date.now();
    const next: NextFunction = jest.fn();

    // Use up all 3 requests
    for (let i = 0; i < 3; i++) {
      const req = createMockReq(userId);
      const res = createMockRes();
      aiRateLimit(req as Request, res as Response, next);
    }

    expect(next).toHaveBeenCalledTimes(3);

    // Advance time past the 60-second window
    jest.advanceTimersByTime(61_000);

    // Should be allowed again
    const req = createMockReq(userId);
    const res = createMockRes();
    aiRateLimit(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(4);
  });

  it("uses IP for anonymous users", () => {
    const next: NextFunction = jest.fn();
    const req = createMockReq(undefined, "192.168.1.1");
    const res = createMockRes();

    aiRateLimit(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
