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

// Mock Prisma client methods
const mockScenarioFindUnique = jest.fn() as any;
const mockSessionFindFirst = jest.fn() as any;
const mockSessionCreate = jest.fn() as any;
const mockSessionFindUnique = jest.fn() as any;
const mockChoiceFindUnique = jest.fn() as any;
const mockDecisionFindFirst = jest.fn() as any;
const mockDecisionCreate = jest.fn() as any;
const mockSessionUpdate = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    storyScenario: {
      findUnique: mockScenarioFindUnique,
    },
    storySession: {
      findFirst: mockSessionFindFirst,
      create: mockSessionCreate,
      findUnique: mockSessionFindUnique,
      update: mockSessionUpdate,
    },
    storyChoice: {
      findUnique: mockChoiceFindUnique,
    },
    storyDecision: {
      findFirst: mockDecisionFindFirst,
      create: mockDecisionCreate,
    },
  },
}));

// Mock ActivityLogService and cache invalidator
const mockLogActivity = jest.fn() as any;
jest.unstable_mockModule("../services/activity-log.service.js", () => ({
  ActivityLogService: {
    logActivity: mockLogActivity,
  },
  ActivityType: {
    DECIDE_STORY: "DECIDE_STORY",
  },
}));

const mockInvalidateCache = jest.fn() as any;
jest.unstable_mockModule("../middleware/cache.middleware.js", () => ({
  invalidateCachePattern: mockInvalidateCache,
}));

const { StorySessionService, StorySessionError } =
  await import("../services/story-session.service.js");

describe("StorySessionService", () => {
  const service = new StorySessionService();
  const userId = "user-1111-1111-1111-111111111111";
  const storyId = "story-2222-2222-2222-222222222222";
  const sessionId = "session-3333-3333-3333-333333333333";
  const choiceId = "choice-4444-4444-4444-444444444444";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("startSession", () => {
    it("throws STORY_NOT_FOUND when story scenario does not exist", async () => {
      mockScenarioFindUnique.mockResolvedValue(null);

      await expect(service.startSession(userId, storyId)).rejects.toThrow(
        new StorySessionError("STORY_NOT_FOUND", "Không tìm thấy story scenario", 404),
      );
      expect(mockScenarioFindUnique).toHaveBeenCalledWith({
        where: { id: storyId },
        select: { id: true },
      });
    });

    it("resumes an active session if it exists", async () => {
      mockScenarioFindUnique.mockResolvedValue({ id: storyId });
      const activeSession = { id: sessionId, userId, storyId, status: "IN_PROGRESS" };
      mockSessionFindFirst.mockResolvedValue(activeSession);

      const result = await service.startSession(userId, storyId);

      expect(mockSessionFindFirst).toHaveBeenCalledWith({
        where: { userId, storyId, status: "IN_PROGRESS" },
        include: expect.any(Object),
      });
      expect(mockSessionCreate).not.toHaveBeenCalled();
      expect(result).toEqual(activeSession);
    });

    it("creates a new session if no active session exists", async () => {
      mockScenarioFindUnique.mockResolvedValue({ id: storyId });
      mockSessionFindFirst.mockResolvedValue(null);
      const newSession = { id: sessionId, userId, storyId, status: "IN_PROGRESS" };
      mockSessionCreate.mockResolvedValue(newSession);

      const result = await service.startSession(userId, storyId);

      expect(mockSessionFindFirst).toHaveBeenCalled();
      expect(mockSessionCreate).toHaveBeenCalledWith({
        data: { userId, storyId, status: "IN_PROGRESS" },
        include: expect.any(Object),
      });
      expect(mockInvalidateCache).toHaveBeenCalledTimes(2);
      expect(result).toEqual(newSession);
    });
  });

  describe("makeDecision", () => {
    it("throws SESSION_NOT_FOUND when session does not exist", async () => {
      mockSessionFindUnique.mockResolvedValue(null);

      await expect(service.makeDecision(userId, sessionId, choiceId)).rejects.toThrow(
        new StorySessionError("SESSION_NOT_FOUND", "Không tìm thấy session", 404),
      );
    });

    it("throws SESSION_FORBIDDEN when session belongs to a different user", async () => {
      mockSessionFindUnique.mockResolvedValue({
        id: sessionId,
        userId: "other-user",
        status: "IN_PROGRESS",
      });

      await expect(service.makeDecision(userId, sessionId, choiceId)).rejects.toThrow(
        new StorySessionError(
          "SESSION_FORBIDDEN",
          "Bạn không có quyền thao tác trên session này",
          403,
        ),
      );
    });

    it("throws SESSION_NOT_ACTIVE when session is not in progress", async () => {
      mockSessionFindUnique.mockResolvedValue({ id: sessionId, userId, status: "COMPLETED" });

      await expect(service.makeDecision(userId, sessionId, choiceId)).rejects.toThrow(
        new StorySessionError("SESSION_NOT_ACTIVE", "Session này đã kết thúc", 400),
      );
    });

    it("throws CHOICE_NOT_FOUND when choice does not exist", async () => {
      mockSessionFindUnique.mockResolvedValue({
        id: sessionId,
        userId,
        storyId,
        status: "IN_PROGRESS",
      });
      mockChoiceFindUnique.mockResolvedValue(null);

      await expect(service.makeDecision(userId, sessionId, choiceId)).rejects.toThrow(
        new StorySessionError("CHOICE_NOT_FOUND", "Lựa chọn không tồn tại", 404),
      );
    });

    it("throws CHOICE_STORY_MISMATCH when choice does not belong to the correct story", async () => {
      mockSessionFindUnique.mockResolvedValue({
        id: sessionId,
        userId,
        storyId,
        status: "IN_PROGRESS",
      });
      mockChoiceFindUnique.mockResolvedValue({ id: choiceId, storyId: "different-story-id" });

      await expect(service.makeDecision(userId, sessionId, choiceId)).rejects.toThrow(
        new StorySessionError("CHOICE_STORY_MISMATCH", "Lựa chọn không thuộc câu chuyện này", 400),
      );
    });

    it("returns existing decision if choice has already been made (idempotency)", async () => {
      mockSessionFindUnique.mockResolvedValue({
        id: sessionId,
        userId,
        storyId,
        status: "IN_PROGRESS",
      });
      mockChoiceFindUnique.mockResolvedValue({ id: choiceId, storyId });
      const existingDecision = { id: "dec-1", sessionId, choiceId };
      mockDecisionFindFirst.mockResolvedValue(existingDecision);

      const result = await service.makeDecision(userId, sessionId, choiceId);

      expect(mockDecisionFindFirst).toHaveBeenCalledWith({
        where: { sessionId, choiceId },
        include: expect.any(Object),
      });
      expect(mockDecisionCreate).not.toHaveBeenCalled();
      expect(result).toEqual(existingDecision);
    });

    it("creates decision, logs activity, invalidates cache and returns the new decision", async () => {
      mockSessionFindUnique.mockResolvedValue({
        id: sessionId,
        userId,
        storyId,
        status: "IN_PROGRESS",
      });
      mockChoiceFindUnique.mockResolvedValue({ id: choiceId, storyId });
      mockDecisionFindFirst.mockResolvedValue(null);
      const newDecision = { id: "dec-2", sessionId, choiceId, userReason: "Stoic reason" };
      mockDecisionCreate.mockResolvedValue(newDecision);
      mockLogActivity.mockResolvedValue({ newlyEarnedBadges: [] });

      const result = await service.makeDecision(userId, sessionId, choiceId, "Stoic reason");

      expect(mockDecisionCreate).toHaveBeenCalledWith({
        data: { sessionId, userId, choiceId, userReason: "Stoic reason" },
        include: expect.any(Object),
      });
      expect(mockLogActivity).toHaveBeenCalledWith(userId, "DECIDE_STORY", "STORY", storyId, {
        choiceId,
        sessionId,
      });
      expect(mockInvalidateCache).toHaveBeenCalledTimes(2);
      expect(result).toEqual(newDecision);
    });
  });

  describe("completeSession", () => {
    it("throws SESSION_NOT_FOUND when session does not exist", async () => {
      mockSessionFindUnique.mockResolvedValue(null);

      await expect(service.completeSession(userId, sessionId)).rejects.toThrow(
        new StorySessionError("SESSION_NOT_FOUND", "Không tìm thấy session", 404),
      );
    });

    it("throws SESSION_FORBIDDEN when session belongs to a different user", async () => {
      mockSessionFindUnique.mockResolvedValue({
        id: sessionId,
        userId: "other-user",
        status: "IN_PROGRESS",
      });

      await expect(service.completeSession(userId, sessionId)).rejects.toThrow(
        new StorySessionError(
          "SESSION_FORBIDDEN",
          "Bạn không có quyền thao tác trên session này",
          403,
        ),
      );
    });

    it("throws SESSION_NOT_ACTIVE when session is not in progress", async () => {
      mockSessionFindUnique.mockResolvedValue({ id: sessionId, userId, status: "COMPLETED" });

      await expect(service.completeSession(userId, sessionId)).rejects.toThrow(
        new StorySessionError("SESSION_NOT_ACTIVE", "Session này đã kết thúc", 400),
      );
    });

    it("updates session status to COMPLETED, invalidates cache and returns the updated session", async () => {
      mockSessionFindUnique.mockResolvedValue({ id: sessionId, userId, status: "IN_PROGRESS" });
      const completedSession = {
        id: sessionId,
        userId,
        status: "COMPLETED",
        completedAt: new Date(),
      };
      mockSessionUpdate.mockResolvedValue(completedSession);

      const result = await service.completeSession(userId, sessionId);

      expect(mockSessionUpdate).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: {
          status: "COMPLETED",
          completedAt: expect.any(Date),
        },
      });
      expect(mockInvalidateCache).toHaveBeenCalledTimes(2);
      expect(result).toEqual(completedSession);
    });
  });
});
