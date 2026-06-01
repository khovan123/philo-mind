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

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {},
}));

const { createActivitySchema, listActivitiesSchema } =
  await import("../validators/activity.validator.js");

// ── T-A16: Activity Validator Tests ──────────────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("createActivitySchema", () => {
  it("accepts a valid payload with minimal fields", () => {
    const result = createActivitySchema.safeParse({
      body: {
        activityType: "LEARN_LESSON",
        targetType: "LESSON",
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid payload with all fields", () => {
    const result = createActivitySchema.safeParse({
      body: {
        activityType: "WRITE_REFLECTION",
        targetType: "REFLECTION",
        targetId: VALID_UUID,
        metadata: { some: "info" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid activityType enum", () => {
    const result = createActivitySchema.safeParse({
      body: {
        activityType: "INVALID_ACTIVITY_TYPE",
        targetType: "LESSON",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid targetType enum", () => {
    const result = createActivitySchema.safeParse({
      body: {
        activityType: "LEARN_LESSON",
        targetType: "INVALID_TARGET_TYPE",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid targetId UUID", () => {
    const result = createActivitySchema.safeParse({
      body: {
        activityType: "LEARN_LESSON",
        targetType: "LESSON",
        targetId: "not-a-uuid",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("listActivitiesSchema", () => {
  it("accepts empty query parameters", () => {
    const result = listActivitiesSchema.safeParse({ query: {} });
    expect(result.success).toBe(true);
  });

  it("accepts valid page and limit numeric strings", () => {
    const result = listActivitiesSchema.safeParse({
      query: { page: "2", limit: "15" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-numeric page or limit", () => {
    const result1 = listActivitiesSchema.safeParse({
      query: { page: "abc" },
    });
    expect(result1.success).toBe(false);

    const result2 = listActivitiesSchema.safeParse({
      query: { limit: "-1" },
    });
    expect(result2.success).toBe(false);
  });
});
