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
const mockCriticalQuestionFindMany = jest.fn() as any;
const mockCriticalQuestionFindFirst = jest.fn() as any;
const mockCriticalQuestionFindUnique = jest.fn() as any;
const mockCriticalQuestionCount = jest.fn() as any;
const mockCriticalQuestionCreate = jest.fn() as any;
const mockCriticalQuestionUpdate = jest.fn() as any;
const mockCriticalQuestionDeleteMany = jest.fn() as any;

const mockTopicFindUnique = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    criticalQuestion: {
      findMany: mockCriticalQuestionFindMany,
      findFirst: mockCriticalQuestionFindFirst,
      findUnique: mockCriticalQuestionFindUnique,
      count: mockCriticalQuestionCount,
      create: mockCriticalQuestionCreate,
      update: mockCriticalQuestionUpdate,
      deleteMany: mockCriticalQuestionDeleteMany,
    },
    topic: {
      findUnique: mockTopicFindUnique,
    },
  },
}));

const {
  listCriticalQuestionsSchema,
  randomCriticalQuestionSchema,
  criticalQuestionIdSchema,
  createCriticalQuestionSchema,
  updateCriticalQuestionSchema,
} = await import("../validators/critical-question.validator.js");

const { CriticalQuestionService, CriticalQuestionError } =
  await import("../services/critical-question.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const TOPIC_ID = "880e8400-e29b-41d4-a716-446655440022";

// ── T-A12: Critical Question Validator Tests ────────────────────

describe("T-A12: Critical Question Validators", () => {
  describe("listCriticalQuestionsSchema", () => {
    it("accepts empty query", () => {
      expect(listCriticalQuestionsSchema.safeParse({ query: {} }).success).toBe(true);
    });

    it("accepts valid topicId and questionType", () => {
      const result = listCriticalQuestionsSchema.safeParse({
        query: { topicId: VALID_UUID, questionType: "OPEN_TEXT" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid questionType", () => {
      const result = listCriticalQuestionsSchema.safeParse({
        query: { questionType: "INVALID_TYPE" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid topicId UUID", () => {
      const result = listCriticalQuestionsSchema.safeParse({
        query: { topicId: "not-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("randomCriticalQuestionSchema", () => {
    it("accepts empty query for random selection", () => {
      expect(randomCriticalQuestionSchema.safeParse({ query: {} }).success).toBe(true);
    });

    it("accepts filter by MORAL_DILEMMA type", () => {
      const result = randomCriticalQuestionSchema.safeParse({
        query: { questionType: "MORAL_DILEMMA" },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("criticalQuestionIdSchema", () => {
    it("accepts valid UUID", () => {
      expect(criticalQuestionIdSchema.safeParse({ params: { id: VALID_UUID } }).success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      expect(criticalQuestionIdSchema.safeParse({ params: { id: "bad" } }).success).toBe(false);
    });
  });

  describe("createCriticalQuestionSchema", () => {
    it("accepts valid input", () => {
      const result = createCriticalQuestionSchema.safeParse({
        body: {
          topicId: VALID_UUID,
          question: "What is justice?",
          questionType: "OPEN_TEXT",
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty question", () => {
      const result = createCriticalQuestionSchema.safeParse({
        body: {
          topicId: VALID_UUID,
          question: "",
          questionType: "LOGIC",
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects question exceeding 2000 chars", () => {
      const result = createCriticalQuestionSchema.safeParse({
        body: {
          topicId: VALID_UUID,
          question: "x".repeat(2001),
          questionType: "LOGIC",
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing topicId", () => {
      const result = createCriticalQuestionSchema.safeParse({
        body: { question: "Test?", questionType: "OPEN_TEXT" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateCriticalQuestionSchema", () => {
    it("accepts partial update", () => {
      const result = updateCriticalQuestionSchema.safeParse({
        params: { id: VALID_UUID },
        body: { question: "Updated question?" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty body", () => {
      const result = updateCriticalQuestionSchema.safeParse({
        params: { id: VALID_UUID },
        body: {},
      });
      expect(result.success).toBe(false);
    });
  });
});

// ── T-A12: CriticalQuestionService Unit Tests ───────────────────

describe("T-A12: CriticalQuestionService", () => {
  let service: InstanceType<typeof CriticalQuestionService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CriticalQuestionService();
  });

  describe("list", () => {
    it("returns paginated questions", async () => {
      const mockData = [{ id: "q1", question: "What is ethics?" }];
      mockCriticalQuestionFindMany.mockResolvedValue(mockData);
      mockCriticalQuestionCount.mockResolvedValue(1);

      const result = await service.list({});
      expect(result.questions).toEqual(mockData);
      expect(result.meta.total).toBe(1);
    });

    it("filters by topicId", async () => {
      mockCriticalQuestionFindMany.mockResolvedValue([]);
      mockCriticalQuestionCount.mockResolvedValue(0);

      await service.list({ topicId: TOPIC_ID });
      expect(mockCriticalQuestionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ topicId: TOPIC_ID }),
        }),
      );
    });
  });

  describe("getById", () => {
    it("returns question when found", async () => {
      const mockQ = { id: VALID_UUID, question: "Test?" };
      mockCriticalQuestionFindUnique.mockResolvedValue(mockQ);

      const result = await service.getById(VALID_UUID);
      expect(result).toEqual(mockQ);
    });

    it("throws CRITICAL_QUESTION_NOT_FOUND when not found", async () => {
      mockCriticalQuestionFindUnique.mockResolvedValue(null);
      await expect(service.getById(VALID_UUID)).rejects.toThrow(CriticalQuestionError);
    });
  });

  describe("getRandom", () => {
    it("returns a random question", async () => {
      const mockQ = { id: "q1", question: "Random?" };
      mockCriticalQuestionCount.mockResolvedValue(5);
      mockCriticalQuestionFindFirst.mockResolvedValue(mockQ);

      const result = await service.getRandom({});
      expect(result).toEqual(mockQ);
    });

    it("throws when no questions exist", async () => {
      mockCriticalQuestionCount.mockResolvedValue(0);
      await expect(service.getRandom({})).rejects.toThrow(CriticalQuestionError);
    });
  });

  describe("getDailyRandom", () => {
    it("returns a deterministic daily question with date", async () => {
      const fixedDate = new Date("2026-01-15");
      const dailyService = new CriticalQuestionService(() => fixedDate);

      const mockQ = { id: "q2", question: "Daily?" };
      mockCriticalQuestionCount.mockResolvedValue(10);
      mockCriticalQuestionFindFirst.mockResolvedValue(mockQ);

      const result = await dailyService.getDailyRandom({});
      expect(result.date).toBe("2026-01-15");
      expect(result.question).toEqual(mockQ);
    });

    it("returns same result for same date and params", async () => {
      const fixedDate = new Date("2026-06-01");
      const svc = new CriticalQuestionService(() => fixedDate);

      mockCriticalQuestionCount.mockResolvedValue(20);
      mockCriticalQuestionFindFirst.mockResolvedValue({ id: "q3" });

      await svc.getDailyRandom({ topicId: TOPIC_ID });
      const firstSkip = mockCriticalQuestionFindFirst.mock.calls[0][0].skip;

      mockCriticalQuestionFindFirst.mockClear();
      await svc.getDailyRandom({ topicId: TOPIC_ID });
      const secondSkip = mockCriticalQuestionFindFirst.mock.calls[0][0].skip;

      expect(firstSkip).toBe(secondSkip);
    });
  });

  describe("create", () => {
    it("creates a question when topic exists", async () => {
      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      const created = { id: "new", topicId: TOPIC_ID, question: "New?" };
      mockCriticalQuestionCreate.mockResolvedValue(created);

      const result = await service.create({
        topicId: TOPIC_ID,
        question: "New?",
        questionType: "OPEN_TEXT",
      });
      expect(result).toEqual(created);
    });

    it("throws TOPIC_NOT_FOUND when topic doesn't exist", async () => {
      mockTopicFindUnique.mockResolvedValue(null);
      await expect(
        service.create({ topicId: TOPIC_ID, question: "Test?", questionType: "LOGIC" }),
      ).rejects.toThrow(CriticalQuestionError);
    });
  });

  describe("update", () => {
    it("updates when question exists", async () => {
      mockCriticalQuestionFindUnique.mockResolvedValue({ id: VALID_UUID });
      const updated = { id: VALID_UUID, question: "Updated?" };
      mockCriticalQuestionUpdate.mockResolvedValue(updated);

      const result = await service.update(VALID_UUID, { question: "Updated?" });
      expect(result.question).toBe("Updated?");
    });

    it("throws when question doesn't exist", async () => {
      mockCriticalQuestionFindUnique.mockResolvedValue(null);
      await expect(service.update(VALID_UUID, { question: "Updated?" })).rejects.toThrow(
        CriticalQuestionError,
      );
    });
  });

  describe("delete", () => {
    it("deletes when question exists", async () => {
      mockCriticalQuestionDeleteMany.mockResolvedValue({ count: 1 });
      await expect(service.delete(VALID_UUID)).resolves.toBeUndefined();
    });

    it("throws when question doesn't exist", async () => {
      mockCriticalQuestionDeleteMany.mockResolvedValue({ count: 0 });
      await expect(service.delete(VALID_UUID)).rejects.toThrow(CriticalQuestionError);
    });
  });
});
