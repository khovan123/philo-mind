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

const mockChapterFindUnique = jest.fn() as any;
const mockChapterNodeFindUnique = jest.fn() as any;
const mockUserChapterProgressFindUnique = jest.fn() as any;
const mockUserChapterProgressCreate = jest.fn() as any;
const mockUserChapterProgressUpdate = jest.fn() as any;
const mockActivityLogCreate = jest.fn() as any;
const mockBadgeFindMany = jest.fn() as any;
const mockBadgeCreateMany = jest.fn() as any;
const mockBadgeDeleteMany = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    chapter: {
      findUnique: mockChapterFindUnique,
    },
    chapterNode: {
      findUnique: mockChapterNodeFindUnique,
    },
    userChapterProgress: {
      findUnique: mockUserChapterProgressFindUnique,
      create: mockUserChapterProgressCreate,
      update: mockUserChapterProgressUpdate,
      count: (jest.fn() as any).mockResolvedValue(0),
    },
    activityLog: {
      create: mockActivityLogCreate,
      count: (jest.fn() as any).mockResolvedValue(0),
      findMany: (jest.fn() as any).mockResolvedValue([]),
    },
    badge: {
      findMany: (jest.fn() as any).mockResolvedValue([]),
      createMany: (jest.fn() as any).mockResolvedValue({ count: 0 }),
      deleteMany: (jest.fn() as any).mockResolvedValue({ count: 0 }),
    },
    userBadge: {
      findMany: (jest.fn() as any).mockResolvedValue([]),
      create: (jest.fn() as any).mockResolvedValue({}),
    },
    notification: {
      create: (jest.fn() as any).mockResolvedValue({}),
    },
    userProgress: {
      count: (jest.fn() as any).mockResolvedValue(0),
    },
    quizAttempt: {
      count: (jest.fn() as any).mockResolvedValue(0),
    },
    storyDecision: {
      count: (jest.fn() as any).mockResolvedValue(0),
    },
    shortLessonResponse: {
      count: (jest.fn() as any).mockResolvedValue(0),
    },
    miniGameAttempt: {
      count: (jest.fn() as any).mockResolvedValue(0),
    },
    bookmark: {
      count: (jest.fn() as any).mockResolvedValue(0),
    },
  },
}));

const { ChapterContentService } = await import("../services/chapter-content.service.js");

describe("ChapterContentService.upsertChapterProgress", () => {
  const userId = "user-123";
  const chapterCode = "1";
  const muc = "I.1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create userChapterProgress and log activity when status is done", async () => {
    mockChapterFindUnique.mockResolvedValue({ id: "chap-1", code: "1" });
    mockChapterNodeFindUnique.mockResolvedValue({ id: "node-1", chapterId: "chap-1", muc: "I.1" });
    mockUserChapterProgressFindUnique.mockResolvedValue(null);
    mockUserChapterProgressCreate.mockResolvedValue({
      id: "ucp-1",
      userId,
      chapterId: "chap-1",
      chapterNodeId: "node-1",
      muc: "I.1",
      status: "done",
    });
    mockActivityLogCreate.mockResolvedValue({ id: "log-1" });

    const result = await ChapterContentService.upsertChapterProgress(userId, chapterCode, muc, {
      status: "done",
    });

    expect(result).toBeDefined();
    expect(mockUserChapterProgressCreate).toHaveBeenCalledTimes(1);
    expect(mockActivityLogCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        activityType: "LEARN_LESSON",
        targetType: "LESSON",
        targetId: "node-1",
      }),
    });
  });

  it("should not log activity if status is available", async () => {
    mockChapterFindUnique.mockResolvedValue({ id: "chap-1", code: "1" });
    mockChapterNodeFindUnique.mockResolvedValue({ id: "node-1", chapterId: "chap-1", muc: "I.1" });
    mockUserChapterProgressFindUnique.mockResolvedValue(null);
    mockUserChapterProgressCreate.mockResolvedValue({
      id: "ucp-1",
      userId,
      chapterId: "chap-1",
      chapterNodeId: "node-1",
      muc: "I.1",
      status: "available",
    });

    await ChapterContentService.upsertChapterProgress(userId, chapterCode, muc, {
      status: "available",
    });

    expect(mockUserChapterProgressCreate).toHaveBeenCalledTimes(1);
    expect(mockActivityLogCreate).not.toHaveBeenCalled();
  });
});
