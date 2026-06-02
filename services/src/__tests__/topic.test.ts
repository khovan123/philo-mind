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

const { listTopicsSchema, topicIdSchema, createTopicSchema, updateTopicSchema } =
  await import("../validators/topic.validator.js");

// ── T-A06: Topic Validator Unit Tests ──────────────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("listTopicsSchema", () => {
  it("accepts empty query parameters and applies defaults", () => {
    const result = listTopicsSchema.safeParse({ query: {} });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query.page).toBe(1);
      expect(result.data.query.limit).toBe(10);
    }
  });

  it("accepts valid page, limit, search, category, and difficulty", () => {
    const result = listTopicsSchema.safeParse({
      query: {
        page: "2",
        limit: "15",
        search: "marx",
        category: "triet-hoc-mac-lenin",
        difficulty: "HARD",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query.page).toBe(2);
      expect(result.data.query.limit).toBe(15);
      expect(result.data.query.search).toBe("marx");
      expect(result.data.query.category).toBe("triet-hoc-mac-lenin");
      expect(result.data.query.difficulty).toBe("HARD");
    }
  });

  it("rejects non-numeric page or limit", () => {
    const result1 = listTopicsSchema.safeParse({
      query: { page: "abc" },
    });
    expect(result1.success).toBe(false);

    const result2 = listTopicsSchema.safeParse({
      query: { limit: "-1" },
    });
    expect(result2.success).toBe(false);
  });

  it("rejects invalid difficulty level", () => {
    const result = listTopicsSchema.safeParse({
      query: { difficulty: "EXTREME" },
    });
    expect(result.success).toBe(false);
  });
});

describe("topicIdSchema", () => {
  it("accepts a valid uuid", () => {
    const result = topicIdSchema.safeParse({
      params: { id: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid uuid", () => {
    const result = topicIdSchema.safeParse({
      params: { id: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });
});

describe("createTopicSchema", () => {
  it("accepts a valid topic creation payload", () => {
    const result = createTopicSchema.safeParse({
      body: {
        title: "Triết học Mác - Lênin",
        description: "Chương 1: Triết học và vai trò của triết học trong đời sống xã hội",
        category: "Chương 1",
        difficulty: "MEDIUM",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing title", () => {
    const result = createTopicSchema.safeParse({
      body: {
        description: "Missing title",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title string", () => {
    const result = createTopicSchema.safeParse({
      body: {
        title: "   ",
      },
    });
    expect(result.success).toBe(false);
  });

  it("defaults difficulty to EASY if not provided", () => {
    const result = createTopicSchema.safeParse({
      body: {
        title: "Triết học cơ bản",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.difficulty).toBe("EASY");
    }
  });

  it("rejects invalid difficulty", () => {
    const result = createTopicSchema.safeParse({
      body: {
        title: "Triết học cơ bản",
        difficulty: "IMPOSSIBLE",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTopicSchema", () => {
  it("accepts a valid partial update payload with valid uuid", () => {
    const result = updateTopicSchema.safeParse({
      params: { id: VALID_UUID },
      body: {
        title: "Chương 1 sửa đổi",
        difficulty: "MEDIUM",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid uuid in params", () => {
    const result = updateTopicSchema.safeParse({
      params: { id: "not-a-uuid" },
      body: {
        title: "Chương 1 sửa đổi",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title string in body", () => {
    const result = updateTopicSchema.safeParse({
      params: { id: VALID_UUID },
      body: {
        title: "  ",
      },
    });
    expect(result.success).toBe(false);
  });
});
