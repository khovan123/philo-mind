import { jest } from "@jest/globals";
import type { Response } from "express";

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

// Declare mocked Prisma operations for short lesson models
const mockShortLessonCount = jest.fn() as any;
const mockShortLessonFindMany = jest.fn() as any;
const mockShortLessonFindUnique = jest.fn() as any;

const mockResponseGroupBy = jest.fn() as any;
const mockResponseFindUnique = jest.fn() as any;
const mockResponseUpsert = jest.fn() as any;

const mockCommentCount = jest.fn() as any;
const mockCommentFindMany = jest.fn() as any;
const mockCommentCreate = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    shortLesson: {
      count: mockShortLessonCount,
      findMany: mockShortLessonFindMany,
      findUnique: mockShortLessonFindUnique,
    },
    shortLessonResponse: {
      groupBy: mockResponseGroupBy,
      findUnique: mockResponseFindUnique,
      upsert: mockResponseUpsert,
    },
    shortLessonComment: {
      count: mockCommentCount,
      findMany: mockCommentFindMany,
      create: mockCommentCreate,
    },
  },
}));

// Mock cache middleware invalidation so it does not connect to Redis during tests
jest.unstable_mockModule("../middleware/cache.middleware.js", () => ({
  invalidateCachePattern: (jest.fn() as any).mockResolvedValue(undefined),
}));

// Dynamic imports after module mocking is set up
const {
  listShortLessonsSchema,
  shortLessonIdSchema,
  respondShortLessonSchema,
  commentShortLessonSchema,
} = await import("../validators/short-lesson.validator.js");

const { ShortLessonController } = await import("../controllers/short-lesson.controller.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("T-A08: Short Lesson Validators", () => {
  describe("listShortLessonsSchema", () => {
    it("accepts empty query params and applies defaults", () => {
      const result = listShortLessonsSchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query.page).toBe(1);
        expect(result.data.query.limit).toBe(10);
        expect(result.data.query.topicId).toBeUndefined();
      }
    });

    it("accepts valid topicId, page, and limit", () => {
      const result = listShortLessonsSchema.safeParse({
        query: {
          page: "3",
          limit: "20",
          topicId: VALID_UUID,
        },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query.page).toBe(3);
        expect(result.data.query.limit).toBe(20);
        expect(result.data.query.topicId).toBe(VALID_UUID);
      }
    });

    it("rejects non-numeric string for page or limit", () => {
      const resultPage = listShortLessonsSchema.safeParse({
        query: { page: "abc" },
      });
      expect(resultPage.success).toBe(false);

      const resultLimit = listShortLessonsSchema.safeParse({
        query: { limit: "-1" },
      });
      expect(resultLimit.success).toBe(false);
    });

    it("rejects invalid topicId UUID", () => {
      const result = listShortLessonsSchema.safeParse({
        query: { topicId: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("shortLessonIdSchema", () => {
    it("accepts valid UUID in params", () => {
      const result = shortLessonIdSchema.safeParse({
        params: { id: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid UUID in params", () => {
      const result = shortLessonIdSchema.safeParse({
        params: { id: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("respondShortLessonSchema", () => {
    it("accepts valid stance choice and optional reason", () => {
      const resultA = respondShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { stance: "STANCE_A", reason: "Good reason" },
      });
      expect(resultA.success).toBe(true);

      const resultB = respondShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { stance: "STANCE_B" },
      });
      expect(resultB.success).toBe(true);
    });

    it("rejects invalid stance choice", () => {
      const result = respondShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { stance: "STANCE_C" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects reason longer than 1000 characters", () => {
      const longReason = "a".repeat(1001);
      const result = respondShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { stance: "STANCE_A", reason: longReason },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("commentShortLessonSchema", () => {
    it("accepts non-empty comment text within limit", () => {
      const result = commentShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { commentText: "Totally agree with this dilemma view!" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty or whitespace comment", () => {
      const resultEmpty = commentShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { commentText: "" },
      });
      expect(resultEmpty.success).toBe(false);

      const resultWhitespace = commentShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { commentText: "   " },
      });
      expect(resultWhitespace.success).toBe(false);
    });

    it("rejects comment longer than 2000 characters", () => {
      const longComment = "a".repeat(2001);
      const result = commentShortLessonSchema.safeParse({
        params: { id: VALID_UUID },
        body: { commentText: longComment },
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("T-A08: Short Lesson Controller", () => {
  let controller: any;
  let mockStatus: any;
  let mockJson: any;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ShortLessonController();
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();
    res = {
      status: mockStatus,
      json: mockJson,
    } as unknown as Response;
  });

  describe("getAll", () => {
    it("returns paginated list of short lessons with stance counts", async () => {
      const req = {
        query: { page: "1", limit: "10" },
      } as any;

      const mockLessons = [
        { id: "l1", title: "Lesson 1", dilemma: "D1", stanceA: "SA", stanceB: "SB" },
        { id: "l2", title: "Lesson 2", dilemma: "D2", stanceA: "SA", stanceB: "SB" },
      ];

      mockShortLessonCount.mockResolvedValue(2);
      mockShortLessonFindMany.mockResolvedValue(mockLessons);
      mockResponseGroupBy.mockResolvedValue([
        { shortLessonId: "l1", selectedStance: "STANCE_A", _count: { _all: 3 } },
        { shortLessonId: "l1", selectedStance: "STANCE_B", _count: { _all: 5 } },
        { shortLessonId: "l2", selectedStance: "STANCE_A", _count: { _all: 1 } },
      ]);

      await controller.getAll(req, res);

      expect(mockShortLessonCount).toHaveBeenCalled();
      expect(mockShortLessonFindMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            id: "l1",
            title: "Lesson 1",
            dilemma: "D1",
            stanceA: "SA",
            stanceB: "SB",
            stats: { stanceACount: 3, stanceBCount: 5 },
          },
          {
            id: "l2",
            title: "Lesson 2",
            dilemma: "D2",
            stanceA: "SA",
            stanceB: "SB",
            stats: { stanceACount: 1, stanceBCount: 0 },
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it("filters short lessons by topicId if provided", async () => {
      const req = {
        query: { topicId: VALID_UUID },
      } as any;

      mockShortLessonCount.mockResolvedValue(0);
      mockShortLessonFindMany.mockResolvedValue([]);
      mockResponseGroupBy.mockResolvedValue([]);

      await controller.getAll(req, res);

      expect(mockShortLessonFindMany).toHaveBeenCalledWith({
        where: { topicId: VALID_UUID },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
    });

    it("handles errors gracefully", async () => {
      const req = { query: {} } as any;
      mockShortLessonCount.mockRejectedValue(new Error("Database failure"));

      await controller.getAll(req, res);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "SHORT_LESSON_FETCH_ERROR",
          message: "Database failure",
        },
      });
    });
  });

  describe("getById", () => {
    it("returns 404 if short lesson does not exist", async () => {
      const req = {
        params: { id: "non-existent" },
      } as any;

      mockShortLessonFindUnique.mockResolvedValue(null);

      await controller.getById(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "SHORT_LESSON_NOT_FOUND",
          message: "Bài học ngắn không tồn tại",
        },
      });
    });

    it("returns details of lesson along with stats, user response, and comments", async () => {
      const req = {
        params: { id: "l1" },
        user: { id: "user123" },
      } as any;

      const mockLesson = { id: "l1", title: "Lesson 1" };
      const mockMyResponse = { selectedStance: "STANCE_A", comment: "Reason" };
      const mockComments = [
        { id: "c1", commentText: "Comment 1", user: { id: "user2", fullName: "Alice" } },
      ];

      mockShortLessonFindUnique.mockResolvedValue(mockLesson);
      mockResponseGroupBy.mockResolvedValue([
        { selectedStance: "STANCE_A", _count: { _all: 10 } },
        { selectedStance: "STANCE_B", _count: { _all: 20 } },
      ]);
      mockResponseFindUnique.mockResolvedValue(mockMyResponse);
      mockCommentFindMany.mockResolvedValue(mockComments);

      await controller.getById(req, res);

      expect(mockShortLessonFindUnique).toHaveBeenCalledWith({ where: { id: "l1" } });
      expect(mockResponseFindUnique).toHaveBeenCalledWith({
        where: {
          userId_shortLessonId: {
            userId: "user123",
            shortLessonId: "l1",
          },
        },
      });
      expect(mockCommentFindMany).toHaveBeenCalledWith({
        where: { shortLessonId: "l1" },
        include: {
          user: {
            select: { id: true, fullName: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          id: "l1",
          title: "Lesson 1",
          stats: { stanceACount: 10, stanceBCount: 20 },
          myResponse: mockMyResponse,
          comments: mockComments,
        },
      });
    });
  });

  describe("respond", () => {
    it("returns 401 if user is not authenticated", async () => {
      const req = {
        params: { id: "l1" },
        body: { stance: "STANCE_A" },
      } as any;

      await controller.respond(req, res);

      expect(mockStatus).toHaveBeenCalledWith(401);
    });

    it("returns 404 if lesson does not exist", async () => {
      const req = {
        params: { id: "l1" },
        body: { stance: "STANCE_A" },
        user: { id: "user123" },
      } as any;

      mockShortLessonFindUnique.mockResolvedValue(null);

      await controller.respond(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it("upserts response and returns updated counts", async () => {
      const req = {
        params: { id: "l1" },
        body: { stance: "STANCE_A", reason: "My reason" },
        user: { id: "user123" },
      } as any;

      mockShortLessonFindUnique.mockResolvedValue({ id: "l1" });
      mockResponseUpsert.mockResolvedValue({
        id: "r1",
        userId: "user123",
        shortLessonId: "l1",
        selectedStance: "STANCE_A",
        comment: "My reason",
      });
      mockResponseGroupBy.mockResolvedValue([
        { selectedStance: "STANCE_A", _count: { _all: 4 } },
        { selectedStance: "STANCE_B", _count: { _all: 2 } },
      ]);

      await controller.respond(req, res);

      expect(mockResponseUpsert).toHaveBeenCalledWith({
        where: {
          userId_shortLessonId: {
            userId: "user123",
            shortLessonId: "l1",
          },
        },
        update: {
          selectedStance: "STANCE_A",
          comment: "My reason",
        },
        create: {
          userId: "user123",
          shortLessonId: "l1",
          selectedStance: "STANCE_A",
          comment: "My reason",
        },
      });

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          response: {
            id: "r1",
            userId: "user123",
            shortLessonId: "l1",
            selectedStance: "STANCE_A",
            comment: "My reason",
          },
          stats: {
            stanceACount: 4,
            stanceBCount: 2,
          },
        },
      });
    });
  });

  describe("comment", () => {
    it("creates comment successfully and invalidates cache", async () => {
      const req = {
        params: { id: "l1" },
        body: { commentText: "Insightful!" },
        user: { id: "user123" },
      } as any;

      const mockComment = {
        id: "c1",
        commentText: "Insightful!",
        user: { id: "user123", fullName: "User Name" },
      };

      mockShortLessonFindUnique.mockResolvedValue({ id: "l1" });
      mockCommentCreate.mockResolvedValue(mockComment);

      await controller.comment(req, res);

      expect(mockCommentCreate).toHaveBeenCalledWith({
        data: {
          shortLessonId: "l1",
          userId: "user123",
          commentText: "Insightful!",
        },
        include: {
          user: {
            select: { id: true, fullName: true, role: true },
          },
        },
      });

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockComment,
      });
    });
  });

  describe("getComments", () => {
    it("returns paginated comments of short lesson", async () => {
      const req = {
        params: { id: "l1" },
        query: { page: "2", limit: "5" },
      } as any;

      const mockComments = [{ id: "c1", commentText: "C1", user: { id: "u1", fullName: "John" } }];

      mockShortLessonFindUnique.mockResolvedValue({ id: "l1" });
      mockCommentCount.mockResolvedValue(12);
      mockCommentFindMany.mockResolvedValue(mockComments);

      await controller.getComments(req, res);

      expect(mockCommentCount).toHaveBeenCalledWith({ where: { shortLessonId: "l1" } });
      expect(mockCommentFindMany).toHaveBeenCalledWith({
        where: { shortLessonId: "l1" },
        include: {
          user: {
            select: { id: true, fullName: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: 5,
        take: 5,
      });

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockComments,
        meta: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });
    });
  });
});
