import { jest } from "@jest/globals";

// ── Mock env ────────────────────────────────────────────────────
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

// ── Mock Prisma ─────────────────────────────────────────────────
const mockReflectionFindMany = jest.fn() as any;
const mockReflectionFindFirst = jest.fn() as any;
const mockReflectionCount = jest.fn() as any;
const mockReflectionCreate = jest.fn() as any;
const mockReflectionUpdateMany = jest.fn() as any;
const mockReflectionDeleteMany = jest.fn() as any;

const mockTopicFindUnique = jest.fn() as any;
const mockCriticalQuestionFindUnique = jest.fn() as any;
const mockActivityLogCreate = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    reflectionEntry: {
      findMany: mockReflectionFindMany,
      findFirst: mockReflectionFindFirst,
      count: mockReflectionCount,
      create: mockReflectionCreate,
      updateMany: mockReflectionUpdateMany,
      deleteMany: mockReflectionDeleteMany,
    },
    topic: {
      findUnique: mockTopicFindUnique,
    },
    criticalQuestion: {
      findUnique: mockCriticalQuestionFindUnique,
    },
    activityLog: {
      create: mockActivityLogCreate,
    },
  },
}));

// Mock activity-log service to avoid badge evaluation side effects
jest.unstable_mockModule("../services/activity-log.service.js", () => ({
  ActivityLogService: {
    logActivity: jest.fn().mockResolvedValue({ log: {}, newlyEarnedBadges: [] }),
  },
  ActivityType: {
    WRITE_REFLECTION: "WRITE_REFLECTION",
  },
}));

const {
  listReflectionsSchema,
  reflectionIdSchema,
  createReflectionSchema,
  updateReflectionSchema,
} = await import("../validators/reflection.validator.js");

const { ReflectionService, ReflectionError } = await import("../services/reflection.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const USER_ID = "660e8400-e29b-41d4-a716-446655440099";
const TOPIC_ID = "880e8400-e29b-41d4-a716-446655440022";
const QUESTION_ID = "990e8400-e29b-41d4-a716-446655440033";

// ── T-A11: Reflection Validator Unit Tests ──────────────────────

describe("T-A11: Reflection Validators", () => {
  describe("listReflectionsSchema", () => {
    it("accepts empty query", () => {
      const result = listReflectionsSchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
    });

    it("accepts valid topicId and questionId", () => {
      const result = listReflectionsSchema.safeParse({
        query: { topicId: VALID_UUID, questionId: VALID_UUID, page: "1", limit: "10" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid topicId", () => {
      const result = listReflectionsSchema.safeParse({
        query: { topicId: "bad-uuid" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid questionId", () => {
      const result = listReflectionsSchema.safeParse({
        query: { questionId: "not-uuid" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-numeric page", () => {
      const result = listReflectionsSchema.safeParse({
        query: { page: "abc" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("reflectionIdSchema", () => {
    it("accepts valid UUID", () => {
      const result = reflectionIdSchema.safeParse({ params: { id: VALID_UUID } });
      expect(result.success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      const result = reflectionIdSchema.safeParse({ params: { id: "bad" } });
      expect(result.success).toBe(false);
    });
  });

  describe("createReflectionSchema", () => {
    it("accepts valid content", () => {
      const result = createReflectionSchema.safeParse({
        body: { content: "My reflection on Stoicism." },
      });
      expect(result.success).toBe(true);
    });

    it("accepts content with optional topicId and questionId", () => {
      const result = createReflectionSchema.safeParse({
        body: { content: "Deep thought", topicId: VALID_UUID, questionId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty content", () => {
      const result = createReflectionSchema.safeParse({
        body: { content: "" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects content exceeding 10000 chars", () => {
      const result = createReflectionSchema.safeParse({
        body: { content: "x".repeat(10001) },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateReflectionSchema", () => {
    it("accepts partial update with content", () => {
      const result = updateReflectionSchema.safeParse({
        params: { id: VALID_UUID },
        body: { content: "Updated reflection" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty body (requires at least one field)", () => {
      const result = updateReflectionSchema.safeParse({
        params: { id: VALID_UUID },
        body: {},
      });
      expect(result.success).toBe(false);
    });
  });
});

// ── T-A11: ReflectionService Unit Tests ─────────────────────────

describe("T-A11: ReflectionService", () => {
  let service: InstanceType<typeof ReflectionService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReflectionService();
  });

  describe("listForUser", () => {
    it("returns paginated reflections for a user", async () => {
      const mockData = [{ id: "r1", content: "Test" }];
      mockReflectionFindMany.mockResolvedValue(mockData);
      mockReflectionCount.mockResolvedValue(1);

      const result = await service.listForUser(USER_ID, {});
      expect(result.reflections).toEqual(mockData);
      expect(result.meta.total).toBe(1);
    });

    it("filters by topicId when provided", async () => {
      mockReflectionFindMany.mockResolvedValue([]);
      mockReflectionCount.mockResolvedValue(0);

      await service.listForUser(USER_ID, { topicId: TOPIC_ID });

      expect(mockReflectionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ topicId: TOPIC_ID }),
        }),
      );
    });
  });

  describe("getForUser", () => {
    it("returns a reflection when it exists", async () => {
      const mockReflection = { id: VALID_UUID, userId: USER_ID, content: "Test" };
      mockReflectionFindFirst.mockResolvedValue(mockReflection);

      const result = await service.getForUser(USER_ID, VALID_UUID);
      expect(result).toEqual(mockReflection);
    });

    it("throws REFLECTION_NOT_FOUND when not found", async () => {
      mockReflectionFindFirst.mockResolvedValue(null);

      await expect(service.getForUser(USER_ID, VALID_UUID)).rejects.toThrow(ReflectionError);
    });
  });

  describe("createForUser", () => {
    it("creates a reflection with valid input", async () => {
      const mockCreated = { id: "new-id", userId: USER_ID, content: "New reflection" };
      mockReflectionCreate.mockResolvedValue(mockCreated);

      const result = await service.createForUser(USER_ID, { content: "New reflection" });
      expect(result).toEqual(mockCreated);
      expect(mockReflectionCreate).toHaveBeenCalled();
    });

    it("validates topic exists when topicId provided", async () => {
      mockTopicFindUnique.mockResolvedValue(null);

      await expect(
        service.createForUser(USER_ID, { content: "Test", topicId: TOPIC_ID }),
      ).rejects.toThrow(ReflectionError);
    });

    it("validates question exists when questionId provided", async () => {
      mockCriticalQuestionFindUnique.mockResolvedValue(null);

      await expect(
        service.createForUser(USER_ID, { content: "Test", questionId: QUESTION_ID }),
      ).rejects.toThrow(ReflectionError);
    });

    it("validates question-topic mismatch", async () => {
      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      mockCriticalQuestionFindUnique.mockResolvedValue({
        id: QUESTION_ID,
        topicId: "different-topic-id",
      });

      await expect(
        service.createForUser(USER_ID, {
          content: "Test",
          topicId: TOPIC_ID,
          questionId: QUESTION_ID,
        }),
      ).rejects.toThrow(ReflectionError);
    });
  });

  describe("updateForUser", () => {
    it("updates a reflection when it exists", async () => {
      mockReflectionUpdateMany.mockResolvedValue({ count: 1 });
      mockReflectionFindFirst.mockResolvedValue({ id: VALID_UUID, content: "Updated" });

      const result = await service.updateForUser(USER_ID, VALID_UUID, {
        content: "Updated",
      });
      expect(result.content).toBe("Updated");
    });

    it("throws REFLECTION_NOT_FOUND when update finds no match", async () => {
      mockReflectionUpdateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.updateForUser(USER_ID, VALID_UUID, { content: "Updated" }),
      ).rejects.toThrow(ReflectionError);
    });
  });

  describe("deleteForUser", () => {
    it("deletes when reflection exists", async () => {
      mockReflectionDeleteMany.mockResolvedValue({ count: 1 });
      await expect(service.deleteForUser(USER_ID, VALID_UUID)).resolves.toBeUndefined();
    });

    it("throws REFLECTION_NOT_FOUND when delete finds no match", async () => {
      mockReflectionDeleteMany.mockResolvedValue({ count: 0 });
      await expect(service.deleteForUser(USER_ID, VALID_UUID)).rejects.toThrow(ReflectionError);
    });
  });
});
