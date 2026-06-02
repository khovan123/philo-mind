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

const {
  listLessonsSchema,
  lessonIdSchema,
  createLessonSchema,
  updateLessonSchema,
  submitAnswerSchema,
} = await import("../validators/lesson.validator.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const OTHER_VALID_UUID = "350e8400-e29b-41d4-a716-446655440001";

describe("listLessonsSchema", () => {
  it("accepts empty query parameters", () => {
    const result = listLessonsSchema.safeParse({ query: {} });
    expect(result.success).toBe(true);
  });

  it("accepts valid optional query params", () => {
    const result = listLessonsSchema.safeParse({
      query: {
        page: "2",
        limit: "15",
        topicId: VALID_UUID,
        status: "PUBLISHED",
        search: "biện chứng",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-numeric string for page or limit", () => {
    const resultPage = listLessonsSchema.safeParse({
      query: { page: "abc" },
    });
    expect(resultPage.success).toBe(false);

    const resultLimit = listLessonsSchema.safeParse({
      query: { limit: "-1" },
    });
    expect(resultLimit.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = listLessonsSchema.safeParse({
      query: { status: "DELETED" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid topicId uuid", () => {
    const result = listLessonsSchema.safeParse({
      query: { topicId: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });
});

describe("lessonIdSchema", () => {
  it("accepts a valid uuid", () => {
    const result = lessonIdSchema.safeParse({
      params: { id: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid uuid", () => {
    const result = lessonIdSchema.safeParse({
      params: { id: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });
});

describe("createLessonSchema", () => {
  it("accepts a valid lesson payload", () => {
    const result = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Triết học Marx-Lenin",
        content: "Nội dung bài học lý thuyết chi tiết...",
        realLifeExample: "Một ví dụ thực tiễn...",
        conflict: "Mâu thuẫn biện chứng...",
        estimatedMinutes: 10,
        status: "PUBLISHED",
        questions: [
          {
            question: "Mâu thuẫn là gì?",
            questionType: "OPEN_TEXT",
          },
          {
            question: "Quy luật lượng chất nói về cái gì?",
            questionType: "SINGLE_CHOICE",
          },
        ],
      },
    });
    expect(result.success).toBe(true);
  });

  it("defaults estimatedMinutes and status correctly if omitted", () => {
    const result = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Triết học cơ bản",
        content: "Nội dung...",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.status).toBe("DRAFT");
      expect(result.data.body.estimatedMinutes).toBeUndefined();
    }
  });

  it("rejects empty title or content", () => {
    const resultTitle = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "   ",
        content: "Có nội dung",
      },
    });
    expect(resultTitle.success).toBe(false);

    const resultContent = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Có tiêu đề",
        content: "  ",
      },
    });
    expect(resultContent.success).toBe(false);
  });

  it("rejects invalid topicId UUID", () => {
    const result = createLessonSchema.safeParse({
      body: {
        topicId: "invalid-uuid",
        title: "Tiêu đề",
        content: "Nội dung",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative or decimal estimatedMinutes", () => {
    const resultNegative = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Tiêu đề",
        content: "Nội dung",
        estimatedMinutes: -5,
      },
    });
    expect(resultNegative.success).toBe(false);

    const resultDecimal = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Tiêu đề",
        content: "Nội dung",
        estimatedMinutes: 5.5,
      },
    });
    expect(resultDecimal.success).toBe(false);
  });

  it("rejects empty questions or invalid question types", () => {
    const resultEmptyQuestion = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Tiêu đề",
        content: "Nội dung",
        questions: [{ question: "  ", questionType: "OPEN_TEXT" }],
      },
    });
    expect(resultEmptyQuestion.success).toBe(false);

    const resultInvalidType = createLessonSchema.safeParse({
      body: {
        topicId: VALID_UUID,
        title: "Tiêu đề",
        content: "Nội dung",
        questions: [{ question: "Hỏi", questionType: "UNKNOWN" }],
      },
    });
    expect(resultInvalidType.success).toBe(false);
  });
});

describe("updateLessonSchema", () => {
  it("accepts a valid partial update payload", () => {
    const result = updateLessonSchema.safeParse({
      params: { id: VALID_UUID },
      body: {
        title: "Tiêu đề mới",
        status: "ARCHIVED",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body update", () => {
    const result = updateLessonSchema.safeParse({
      params: { id: VALID_UUID },
      body: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid field values in body", () => {
    const result = updateLessonSchema.safeParse({
      params: { id: VALID_UUID },
      body: {
        estimatedMinutes: -1,
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID in params", () => {
    const result = updateLessonSchema.safeParse({
      params: { id: "not-a-uuid" },
      body: {
        title: "Tiêu đề mới",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("submitAnswerSchema", () => {
  it("accepts a valid answer payload", () => {
    const result = submitAnswerSchema.safeParse({
      params: { questionId: VALID_UUID },
      body: {
        answerText: "Đây là câu trả lời của tôi cho câu hỏi lý thuyết.",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty answer text", () => {
    const result = submitAnswerSchema.safeParse({
      params: { questionId: VALID_UUID },
      body: {
        answerText: "   ",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid questionId UUID in params", () => {
    const result = submitAnswerSchema.safeParse({
      params: { questionId: "not-a-uuid" },
      body: {
        answerText: "Trả lời",
      },
    });
    expect(result.success).toBe(false);
  });
});
