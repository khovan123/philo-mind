import { jest } from "@jest/globals";
import type { Response, NextFunction } from "express";

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

// Declare mocked Prisma operations
const mockProgressFindUnique = jest.fn() as any;
const mockProgressFindMany = jest.fn() as any;
const mockProgressCount = jest.fn() as any;
const mockProgressUpsert = jest.fn() as any;

const mockLessonFindUnique = jest.fn() as any;
const mockLessonFindMany = jest.fn() as any;

const mockTopicFindUnique = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    userProgress: {
      findUnique: mockProgressFindUnique,
      findMany: mockProgressFindMany,
      count: mockProgressCount,
      upsert: mockProgressUpsert,
    },
    lesson: {
      findUnique: mockLessonFindUnique,
      findMany: mockLessonFindMany,
    },
    topic: {
      findUnique: mockTopicFindUnique,
    },
  },
}));

const {
  upsertProgressSchema,
  listProgressSchema,
  progressByLessonSchema,
  progressByTopicSchema,
} = await import("../validators/progress.validator.js");

const { ProgressController } = await import(
  "../controllers/progress.controller.js"
);

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const USER_ID = "660e8400-e29b-41d4-a716-446655440099";
const LESSON_ID = "770e8400-e29b-41d4-a716-446655440011";
const TOPIC_ID = "880e8400-e29b-41d4-a716-446655440022";

// ── T-A09: Progress Validator Unit Tests ────────────────────

describe("T-A09: Progress Validators", () => {
  describe("upsertProgressSchema", () => {
    it("accepts valid lessonId and body with status", () => {
      const result = upsertProgressSchema.safeParse({
        params: { lessonId: VALID_UUID },
        body: { status: "IN_PROGRESS", progressPercent: 50 },
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty body (no updates)", () => {
      const result = upsertProgressSchema.safeParse({
        params: { lessonId: VALID_UUID },
        body: {},
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid lessonId UUID", () => {
      const result = upsertProgressSchema.safeParse({
        params: { lessonId: "not-a-uuid" },
        body: { status: "IN_PROGRESS" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status value", () => {
      const result = upsertProgressSchema.safeParse({
        params: { lessonId: VALID_UUID },
        body: { status: "PAUSED" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects progressPercent outside 0-100 range", () => {
      const resultNeg = upsertProgressSchema.safeParse({
        params: { lessonId: VALID_UUID },
        body: { progressPercent: -5 },
      });
      expect(resultNeg.success).toBe(false);

      const resultOver = upsertProgressSchema.safeParse({
        params: { lessonId: VALID_UUID },
        body: { progressPercent: 150 },
      });
      expect(resultOver.success).toBe(false);
    });

    it("rejects non-integer progressPercent", () => {
      const result = upsertProgressSchema.safeParse({
        params: { lessonId: VALID_UUID },
        body: { progressPercent: 33.5 },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("listProgressSchema", () => {
    it("accepts empty query params", () => {
      const result = listProgressSchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
    });

    it("accepts valid page, limit, status, and topicId", () => {
      const result = listProgressSchema.safeParse({
        query: {
          page: "2",
          limit: "10",
          status: "COMPLETED",
          topicId: VALID_UUID,
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects non-numeric page", () => {
      const result = listProgressSchema.safeParse({
        query: { page: "abc" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = listProgressSchema.safeParse({
        query: { status: "DELETED" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid topicId UUID", () => {
      const result = listProgressSchema.safeParse({
        query: { topicId: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("progressByLessonSchema", () => {
    it("accepts valid lessonId UUID", () => {
      const result = progressByLessonSchema.safeParse({
        params: { lessonId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid lessonId UUID", () => {
      const result = progressByLessonSchema.safeParse({
        params: { lessonId: "bad" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("progressByTopicSchema", () => {
    it("accepts valid topicId UUID", () => {
      const result = progressByTopicSchema.safeParse({
        params: { topicId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid topicId UUID", () => {
      const result = progressByTopicSchema.safeParse({
        params: { topicId: "123" },
      });
      expect(result.success).toBe(false);
    });
  });
});

// ── T-A09: Progress Controller Unit Tests ───────────────────

describe("T-A09: ProgressController", () => {
  let controller: InstanceType<typeof ProgressController>;
  let mockStatus: any;
  let mockJson: any;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProgressController();
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();
    res = { status: mockStatus, json: mockJson, locals: {} } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
  });

  describe("upsert", () => {
    it("creates or updates progress for a lesson", async () => {
      const req = {
        params: { lessonId: LESSON_ID },
        body: { status: "IN_PROGRESS", progressPercent: 60 },
        user: { id: USER_ID },
      } as any;

      mockLessonFindUnique.mockResolvedValue({ id: LESSON_ID });
      mockProgressUpsert.mockResolvedValue({
        userId: USER_ID,
        lessonId: LESSON_ID,
        status: "IN_PROGRESS",
        progressPercent: 60,
        completedAt: null,
      });

      await controller.upsert(req, res, next);

      expect(mockLessonFindUnique).toHaveBeenCalledWith({
        where: { id: LESSON_ID },
        select: { id: true },
      });
      expect(mockProgressUpsert).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("auto-completes when progressPercent reaches 100", async () => {
      const req = {
        params: { lessonId: LESSON_ID },
        body: { progressPercent: 100 },
        user: { id: USER_ID },
      } as any;

      mockLessonFindUnique.mockResolvedValue({ id: LESSON_ID });
      mockProgressUpsert.mockResolvedValue({
        userId: USER_ID,
        lessonId: LESSON_ID,
        status: "COMPLETED",
        progressPercent: 100,
        completedAt: new Date(),
      });

      await controller.upsert(req, res, next);

      // Verify the upsert was called with COMPLETED status
      const upsertCall = mockProgressUpsert.mock.calls[0][0];
      expect(upsertCall.create.status).toBe("COMPLETED");
      expect(upsertCall.create.completedAt).not.toBeNull();
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("returns 404 when lesson does not exist", async () => {
      const req = {
        params: { lessonId: LESSON_ID },
        body: { status: "IN_PROGRESS" },
        user: { id: USER_ID },
      } as any;

      mockLessonFindUnique.mockResolvedValue(null);

      await controller.upsert(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: "LESSON_NOT_FOUND" }),
        }),
      );
    });
  });

  describe("getByLesson", () => {
    it("returns progress record for a lesson", async () => {
      const req = {
        params: { lessonId: LESSON_ID },
        user: { id: USER_ID },
      } as any;

      const mockProgress = {
        userId: USER_ID,
        lessonId: LESSON_ID,
        status: "IN_PROGRESS",
        progressPercent: 40,
      };

      mockLessonFindUnique.mockResolvedValue({ id: LESSON_ID });
      mockProgressFindUnique.mockResolvedValue(mockProgress);

      await controller.getByLesson(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockProgress,
        }),
      );
    });

    it("returns default NOT_STARTED when no progress exists", async () => {
      const req = {
        params: { lessonId: LESSON_ID },
        user: { id: USER_ID },
      } as any;

      mockLessonFindUnique.mockResolvedValue({ id: LESSON_ID });
      mockProgressFindUnique.mockResolvedValue(null);

      await controller.getByLesson(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: "NOT_STARTED",
            progressPercent: 0,
            completedAt: null,
          }),
        }),
      );
    });
  });

  describe("statsByTopic", () => {
    it("returns aggregated stats for a topic", async () => {
      const req = {
        params: { topicId: TOPIC_ID },
        user: { id: USER_ID },
      } as any;

      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      mockLessonFindMany.mockResolvedValue([
        { id: "l1" },
        { id: "l2" },
        { id: "l3" },
      ]);
      mockProgressFindMany.mockResolvedValue([
        { status: "COMPLETED", progressPercent: 100 },
        { status: "IN_PROGRESS", progressPercent: 50 },
      ]);

      await controller.statsByTopic(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            topicId: TOPIC_ID,
            totalLessons: 3,
            completedLessons: 1,
            inProgressLessons: 1,
            notStartedLessons: 1,
            averageProgress: 50, // (100+50)/3 = 50
          }),
        }),
      );
    });

    it("returns zero stats for topic with no lessons", async () => {
      const req = {
        params: { topicId: TOPIC_ID },
        user: { id: USER_ID },
      } as any;

      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      mockLessonFindMany.mockResolvedValue([]);

      await controller.statsByTopic(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            totalLessons: 0,
            completedLessons: 0,
            averageProgress: 0,
          }),
        }),
      );
    });

    it("returns 404 when topic does not exist", async () => {
      const req = {
        params: { topicId: TOPIC_ID },
        user: { id: USER_ID },
      } as any;

      mockTopicFindUnique.mockResolvedValue(null);

      await controller.statsByTopic(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: "TOPIC_NOT_FOUND" }),
        }),
      );
    });
  });
});
