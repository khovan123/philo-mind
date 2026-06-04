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

// Declare mocked Prisma operations
const mockQuizCount = jest.fn() as any;
const mockQuizFindMany = jest.fn() as any;
const mockQuizFindFirst = jest.fn() as any;
const mockQuizFindUnique = jest.fn() as any;

const mockAttemptCreate = jest.fn() as any;
const mockAttemptFindFirst = jest.fn() as any;
const mockAttemptUpdate = jest.fn() as any;

const mockQuestionFindUnique = jest.fn() as any;

const mockAnswerFindFirst = jest.fn() as any;
const mockAnswerCreate = jest.fn() as any;
const mockAnswerUpdate = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    quiz: {
      count: mockQuizCount,
      findMany: mockQuizFindMany,
      findFirst: mockQuizFindFirst,
      findUnique: mockQuizFindUnique,
    },
    quizAttempt: {
      create: mockAttemptCreate,
      findFirst: mockAttemptFindFirst,
      update: mockAttemptUpdate,
    },
    quizQuestion: {
      findUnique: mockQuestionFindUnique,
    },
    quizAttemptAnswer: {
      findFirst: mockAnswerFindFirst,
      create: mockAnswerCreate,
      update: mockAnswerUpdate,
    },
  },
}));

// Mock activity log service so tests don't hit DB
jest.unstable_mockModule("../services/activity-log.service.js", () => ({
  ActivityLogService: {
    logActivity: (jest.fn() as any).mockResolvedValue({ newlyEarnedBadges: [] }),
  },
  ActivityType: { DO_QUIZ: "DO_QUIZ" },
}));

const {
  listQuizzesSchema,
  quizIdSchema,
  lessonQuizSchema,
  attemptIdSchema,
  submitQuizAnswerSchema,
} = await import("../validators/quiz.validator.js");

const { QuizController } = await import("../controllers/quiz.controller.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const QUIZ_ID = "660e8400-e29b-41d4-a716-446655440011";
const LESSON_ID = "770e8400-e29b-41d4-a716-446655440022";
const ATTEMPT_ID = "880e8400-e29b-41d4-a716-446655440033";
const QUESTION_ID = "990e8400-e29b-41d4-a716-446655440044";
const OPTION_ID = "aa0e8400-e29b-41d4-a716-446655440055";
const USER_ID = "bb0e8400-e29b-41d4-a716-446655440066";

// ── T-A10: Quiz Validator Unit Tests ────────────────────────

describe("T-A10: Quiz Validators", () => {
  describe("listQuizzesSchema", () => {
    it("accepts empty query params", () => {
      const result = listQuizzesSchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
    });

    it("accepts valid page, limit, search, topicId, and status", () => {
      const result = listQuizzesSchema.safeParse({
        query: {
          page: "2",
          limit: "15",
          search: "mau thuan",
          topicId: VALID_UUID,
          status: "completed",
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects non-numeric page", () => {
      const result = listQuizzesSchema.safeParse({
        query: { page: "abc" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status value", () => {
      const result = listQuizzesSchema.safeParse({
        query: { status: "deleted" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid topicId UUID", () => {
      const result = listQuizzesSchema.safeParse({
        query: { topicId: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid lessonId UUID", () => {
      const result = listQuizzesSchema.safeParse({
        query: { lessonId: "bad" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("quizIdSchema", () => {
    it("accepts valid quizId UUID", () => {
      const result = quizIdSchema.safeParse({
        params: { quizId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid quizId", () => {
      const result = quizIdSchema.safeParse({
        params: { quizId: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("lessonQuizSchema", () => {
    it("accepts valid lessonId UUID", () => {
      const result = lessonQuizSchema.safeParse({
        params: { lessonId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid lessonId", () => {
      const result = lessonQuizSchema.safeParse({
        params: { lessonId: "abc" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("attemptIdSchema", () => {
    it("accepts valid attemptId UUID", () => {
      const result = attemptIdSchema.safeParse({
        params: { attemptId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid attemptId", () => {
      const result = attemptIdSchema.safeParse({
        params: { attemptId: "nope" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("submitQuizAnswerSchema", () => {
    it("accepts valid answer with selectedOptionId", () => {
      const result = submitQuizAnswerSchema.safeParse({
        params: { attemptId: VALID_UUID },
        body: {
          questionId: QUESTION_ID,
          selectedOptionId: OPTION_ID,
        },
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid answer with textAnswer", () => {
      const result = submitQuizAnswerSchema.safeParse({
        params: { attemptId: VALID_UUID },
        body: {
          questionId: QUESTION_ID,
          textAnswer: "My essay answer here",
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects answer without questionId", () => {
      const result = submitQuizAnswerSchema.safeParse({
        params: { attemptId: VALID_UUID },
        body: {
          selectedOptionId: OPTION_ID,
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects textAnswer exceeding 2000 characters", () => {
      const longText = "a".repeat(2001);
      const result = submitQuizAnswerSchema.safeParse({
        params: { attemptId: VALID_UUID },
        body: {
          questionId: QUESTION_ID,
          textAnswer: longText,
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid attemptId UUID", () => {
      const result = submitQuizAnswerSchema.safeParse({
        params: { attemptId: "bad" },
        body: {
          questionId: QUESTION_ID,
          selectedOptionId: OPTION_ID,
        },
      });
      expect(result.success).toBe(false);
    });
  });
});

// ── T-A10: Quiz Controller Unit Tests ───────────────────────

describe("T-A10: QuizController", () => {
  let controller: InstanceType<typeof QuizController>;
  let mockStatus: any;
  let mockJson: any;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new QuizController();
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();
    res = {
      status: mockStatus,
      json: mockJson,
    } as unknown as Response;
  });

  describe("getByLesson", () => {
    it("returns quiz detail for a lesson", async () => {
      const req = {
        params: { lessonId: LESSON_ID },
      } as any;

      const mockQuiz = {
        id: QUIZ_ID,
        lessonId: LESSON_ID,
        title: "Quiz 1",
        lesson: {
          id: LESSON_ID,
          title: "Lesson Title",
          estimatedMinutes: 5,
          topic: { title: "Topic", category: "Cat", difficulty: "MEDIUM" },
        },
        questions: [
          {
            id: QUESTION_ID,
            question: "What is X?",
            options: [
              { id: OPTION_ID, optionText: "Option A", isCorrect: true },
              { id: "o2", optionText: "Option B", isCorrect: false },
            ],
          },
        ],
      };

      mockQuizFindFirst.mockResolvedValue(mockQuiz);

      await controller.getByLesson(req, res);

      expect(mockQuizFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { lessonId: LESSON_ID },
        }),
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: QUIZ_ID,
            questions: expect.arrayContaining([
              expect.objectContaining({
                id: QUESTION_ID,
                correctOptionId: OPTION_ID,
              }),
            ]),
          }),
        }),
      );
    });

    it("returns 404 if quiz not found for lesson", async () => {
      const req = { params: { lessonId: LESSON_ID } } as any;

      mockQuizFindFirst.mockResolvedValue(null);

      await controller.getByLesson(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: "QUIZ_NOT_FOUND" }),
        }),
      );
    });
  });

  describe("startAttempt", () => {
    it("creates a new quiz attempt", async () => {
      const req = {
        params: { quizId: QUIZ_ID },
        user: { id: USER_ID },
      } as any;

      mockQuizFindUnique.mockResolvedValue({
        id: QUIZ_ID,
        questions: [{ id: "q1" }, { id: "q2" }],
      });
      mockAttemptCreate.mockResolvedValue({
        id: ATTEMPT_ID,
        quizId: QUIZ_ID,
        userId: USER_ID,
        score: 0,
        createdAt: new Date(),
      });

      await controller.startAttempt(req, res);

      expect(mockAttemptCreate).toHaveBeenCalledWith({
        data: { quizId: QUIZ_ID, userId: USER_ID, score: 0 },
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            attemptId: ATTEMPT_ID,
            totalQuestions: 2,
          }),
        }),
      );
    });

    it("returns 404 if quiz does not exist", async () => {
      const req = {
        params: { quizId: QUIZ_ID },
        user: { id: USER_ID },
      } as any;

      mockQuizFindUnique.mockResolvedValue(null);

      await controller.startAttempt(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });
  });

  describe("submitAnswer", () => {
    it("submits a correct answer and returns feedback", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
        body: {
          questionId: QUESTION_ID,
          selectedOptionId: OPTION_ID,
        },
      } as any;

      mockAttemptFindFirst.mockResolvedValue({
        id: ATTEMPT_ID,
        userId: USER_ID,
        quizId: QUIZ_ID,
        completedAt: null,
      });
      mockQuestionFindUnique.mockResolvedValue({
        id: QUESTION_ID,
        question: "What is X?",
        quizId: QUIZ_ID,
        options: [
          { id: OPTION_ID, optionText: "Correct", isCorrect: true },
          { id: "o2", optionText: "Wrong", isCorrect: false },
        ],
      });
      mockAnswerFindFirst.mockResolvedValue(null);
      mockAnswerCreate.mockResolvedValue({
        id: "ans1",
        attemptId: ATTEMPT_ID,
        questionId: QUESTION_ID,
        selectedOptionId: OPTION_ID,
        isCorrect: true,
      });

      await controller.submitAnswer(req, res);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            isCorrect: true,
            correctOptionId: OPTION_ID,
          }),
        }),
      );
    });

    it("returns 404 if attempt not found", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
        body: { questionId: QUESTION_ID, selectedOptionId: OPTION_ID },
      } as any;

      mockAttemptFindFirst.mockResolvedValue(null);

      await controller.submitAnswer(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it("returns 409 if attempt is already completed", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
        body: { questionId: QUESTION_ID, selectedOptionId: OPTION_ID },
      } as any;

      mockAttemptFindFirst.mockResolvedValue({
        id: ATTEMPT_ID,
        userId: USER_ID,
        completedAt: new Date(),
      });

      await controller.submitAnswer(req, res);

      expect(mockStatus).toHaveBeenCalledWith(409);
    });

    it("returns 404 if question does not belong to quiz", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
        body: { questionId: QUESTION_ID, selectedOptionId: OPTION_ID },
      } as any;

      mockAttemptFindFirst.mockResolvedValue({
        id: ATTEMPT_ID,
        userId: USER_ID,
        quizId: QUIZ_ID,
        completedAt: null,
      });
      mockQuestionFindUnique.mockResolvedValue({
        id: QUESTION_ID,
        quizId: "different-quiz-id", // not same quiz
        options: [],
      });

      await controller.submitAnswer(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it("updates existing answer instead of creating new one", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
        body: { questionId: QUESTION_ID, selectedOptionId: OPTION_ID },
      } as any;

      mockAttemptFindFirst.mockResolvedValue({
        id: ATTEMPT_ID,
        userId: USER_ID,
        quizId: QUIZ_ID,
        completedAt: null,
      });
      mockQuestionFindUnique.mockResolvedValue({
        id: QUESTION_ID,
        question: "What?",
        quizId: QUIZ_ID,
        options: [{ id: OPTION_ID, isCorrect: true }],
      });
      mockAnswerFindFirst.mockResolvedValue({ id: "existing-ans" });
      mockAnswerUpdate.mockResolvedValue({
        id: "existing-ans",
        selectedOptionId: OPTION_ID,
        isCorrect: true,
      });

      await controller.submitAnswer(req, res);

      expect(mockAnswerUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "existing-ans" },
        }),
      );
      expect(mockAnswerCreate).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

  describe("completeAttempt", () => {
    it("calculates score and completes the attempt", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
      } as any;

      mockAttemptFindFirst.mockResolvedValue({
        id: ATTEMPT_ID,
        userId: USER_ID,
        quizId: QUIZ_ID,
        quiz: { questions: [{ id: "q1" }, { id: "q2" }, { id: "q3" }] },
        answers: [{ isCorrect: true }, { isCorrect: false }, { isCorrect: true }],
      });
      mockAttemptUpdate.mockResolvedValue({
        id: ATTEMPT_ID,
        score: 67,
        completedAt: new Date(),
      });

      await controller.completeAttempt(req, res);

      expect(mockAttemptUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: ATTEMPT_ID },
          data: expect.objectContaining({
            score: 67, // Math.round((2/3)*100)
          }),
        }),
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            score: 67,
            correctCount: 2,
            totalQuestions: 3,
          }),
        }),
      );
    });

    it("returns 404 if attempt not found", async () => {
      const req = {
        params: { attemptId: ATTEMPT_ID },
        user: { id: USER_ID },
      } as any;

      mockAttemptFindFirst.mockResolvedValue(null);

      await controller.completeAttempt(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });
  });

  describe("list", () => {
    it("returns paginated quiz list", async () => {
      const req = {
        query: { page: "1", limit: "10" },
        user: { id: USER_ID },
      } as any;

      mockQuizCount.mockResolvedValue(2);
      mockQuizFindMany.mockResolvedValue([
        {
          id: "q1",
          lessonId: "l1",
          title: "Quiz 1",
          lesson: { topic: { category: "Cat", difficulty: "EASY" }, estimatedMinutes: 5 },
          questions: [{ id: "q1" }],
          attempts: [],
        },
      ]);

      await controller.list(req, res);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
          meta: expect.objectContaining({
            page: 1,
            limit: 10,
            total: 2,
          }),
        }),
      );
    });

    it("handles errors gracefully", async () => {
      const req = { query: {}, user: null } as any;

      mockQuizCount.mockRejectedValue(new Error("Database failure"));

      await controller.list(req, res);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: "QUIZ_LIST_ERROR" }),
        }),
      );
    });
  });
});
