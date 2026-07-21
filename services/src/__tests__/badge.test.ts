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

const mockBadgeCreateMany = jest.fn() as any;
const mockBadgeFindMany = jest.fn() as any;
const mockBadgeDeleteMany = jest.fn() as any;
const mockUserBadgeFindMany = jest.fn() as any;
const mockUserBadgeCreate = jest.fn() as any;
const mockNotificationCreate = jest.fn() as any;
const mockActivityLogCount = jest.fn() as any;
const mockUserProgressCount = jest.fn() as any;
const mockQuizAttemptCount = jest.fn() as any;
const mockStoryDecisionCount = jest.fn() as any;
const mockShortLessonResponseCount = jest.fn() as any;
const mockMiniGameAttemptCount = jest.fn() as any;
const mockBookmarkCount = jest.fn() as any;
const mockActivityLogFindMany = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    badge: {
      createMany: mockBadgeCreateMany,
      findMany: mockBadgeFindMany,
      deleteMany: mockBadgeDeleteMany,
    },
    userBadge: {
      findMany: mockUserBadgeFindMany,
      create: mockUserBadgeCreate,
    },
    notification: {
      create: mockNotificationCreate,
    },
    activityLog: {
      count: mockActivityLogCount,
      findMany: mockActivityLogFindMany,
    },
    userProgress: {
      count: mockUserProgressCount,
    },
    quizAttempt: {
      count: mockQuizAttemptCount,
    },
    storyDecision: {
      count: mockStoryDecisionCount,
    },
    shortLessonResponse: {
      count: mockShortLessonResponseCount,
    },
    miniGameAttempt: {
      count: mockMiniGameAttemptCount,
    },
    bookmark: {
      count: mockBookmarkCount,
    },
  },
}));

const { BadgeService, BADGE_DEFINITIONS } = await import("../services/badge.service.js");

describe("BadgeService", () => {
  const userId = "test-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ensureBadgesSeeded", () => {
    it("should call prisma.badge.createMany with BADGE_DEFINITIONS", async () => {
      mockBadgeCreateMany.mockResolvedValue({ count: 10 } as any);
      mockBadgeDeleteMany.mockResolvedValue({ count: 0 } as any);
      await BadgeService.ensureBadgesSeeded();
      expect(mockBadgeCreateMany).toHaveBeenCalledWith({
        data: BADGE_DEFINITIONS,
        skipDuplicates: true,
      });
      expect(mockBadgeDeleteMany).toHaveBeenCalledWith({
        where: {
          conditionType: {
            notIn: BADGE_DEFINITIONS.map((badge: any) => badge.conditionType),
          },
        },
      });
    });
  });

  describe("getAllBadgesForUser", () => {
    it("should return all badges with correct progress and earned status", async () => {
      mockBadgeCreateMany.mockResolvedValue({ count: 10 } as any);
      mockBadgeFindMany.mockResolvedValue(
        BADGE_DEFINITIONS.map((def, idx) => ({
          id: `badge-${idx}`,
          ...def,
          userBadges: idx === 0 ? [{ earnedAt: new Date() }] : [], // First one is earned
        })),
      );

      // Mock user metrics across retained learning modules.
      mockActivityLogCount.mockResolvedValue(1);
      mockUserProgressCount.mockResolvedValue(3);
      mockQuizAttemptCount.mockResolvedValue(5);
      mockStoryDecisionCount.mockResolvedValue(3);
      mockShortLessonResponseCount.mockResolvedValue(7);
      mockMiniGameAttemptCount.mockResolvedValue(5);
      mockBookmarkCount.mockResolvedValue(3);

      // Mocking 3-day streak logs
      const today = new Date();
      const yesterday = new Date(Date.now() - 86400000);
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
      mockActivityLogFindMany.mockResolvedValue([
        { createdAt: today },
        { createdAt: yesterday },
        { createdAt: twoDaysAgo },
      ]);

      const result = await BadgeService.getAllBadgesForUser(userId);

      expect(result).toHaveLength(10);

      // First badge: first_learning_day (Earned)
      expect(result[0].isEarned).toBe(true);
      expect(result[0].progress).toBe(1);
      expect(result[0].target).toBe(1);

      // Second badge: lesson_finish_3 (Unearned, but has full progress)
      expect(result[1].isEarned).toBe(false);
      expect(result[1].progress).toBe(3);
      expect(result[1].target).toBe(3);

      // Streak badge uses the new meaningful-learning-day streak.
      const streakBadge = result.find((b) => b.conditionType === "learning_streak_3");
      expect(streakBadge?.progress).toBe(3);
      expect(streakBadge?.target).toBe(3);

      const balancedBadge = result.find((b) => b.conditionType === "balanced_core_5");
      expect(balancedBadge?.progress).toBe(5);
      expect(balancedBadge?.target).toBe(5);
    });
  });

  describe("evaluateUserBadges", () => {
    it("should award eligible badges and send notifications", async () => {
      mockBadgeCreateMany.mockResolvedValue({ count: 10 } as any);

      // Mock all badges as unearned initially
      const mockBadges = BADGE_DEFINITIONS.map((def, idx) => ({
        id: `badge-${idx}`,
        ...def,
        userBadges: [],
      }));
      mockBadgeFindMany.mockResolvedValue(mockBadges);

      // User has 1 activity log -> eligible for first badge only
      mockActivityLogCount.mockResolvedValue(1);
      mockUserProgressCount.mockResolvedValue(0);
      mockQuizAttemptCount.mockResolvedValue(0);
      mockStoryDecisionCount.mockResolvedValue(0);
      mockShortLessonResponseCount.mockResolvedValue(0);
      mockMiniGameAttemptCount.mockResolvedValue(0);
      mockBookmarkCount.mockResolvedValue(0);
      mockActivityLogFindMany.mockResolvedValue([{ createdAt: new Date() }]);

      // Mock userBadge creation and notification creation
      const createdUserBadge = { id: "ub-1", userId, badgeId: "badge-0", badge: mockBadges[0] };
      mockUserBadgeCreate.mockResolvedValue(createdUserBadge);
      mockNotificationCreate.mockResolvedValue({} as any);

      const newlyEarned = await BadgeService.evaluateUserBadges(userId);

      // First badge should be awarded
      expect(newlyEarned).toHaveLength(1);
      expect(newlyEarned[0]).toEqual(createdUserBadge);

      expect(mockUserBadgeCreate).toHaveBeenCalledTimes(1);
      expect(mockUserBadgeCreate).toHaveBeenCalledWith({
        data: {
          userId,
          badgeId: "badge-0",
        },
        include: {
          badge: true,
        },
      });

      expect(mockNotificationCreate).toHaveBeenCalledTimes(1);
      expect(mockNotificationCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          type: "BADGE_EARNED",
          content: expect.stringContaining(mockBadges[0].name),
        }),
      });
    });

    it("should not award badges that are already earned", async () => {
      mockBadgeCreateMany.mockResolvedValue({ count: 10 } as any);

      // Mock all badges as already earned
      const mockBadges = BADGE_DEFINITIONS.map((def, idx) => ({
        id: `badge-${idx}`,
        ...def,
        userBadges: [{ id: `ub-${idx}` }],
      }));
      mockBadgeFindMany.mockResolvedValue(mockBadges);

      // User is eligible for everything
      mockActivityLogCount.mockResolvedValue(100);
      mockUserProgressCount.mockResolvedValue(100);
      mockQuizAttemptCount.mockResolvedValue(100);
      mockStoryDecisionCount.mockResolvedValue(100);
      mockShortLessonResponseCount.mockResolvedValue(100);
      mockMiniGameAttemptCount.mockResolvedValue(100);
      mockBookmarkCount.mockResolvedValue(100);
      mockActivityLogFindMany.mockResolvedValue([{ createdAt: new Date() }]);

      const newlyEarned = await BadgeService.evaluateUserBadges(userId);

      // Nothing should be newly awarded
      expect(newlyEarned).toHaveLength(0);
      expect(mockUserBadgeCreate).not.toHaveBeenCalled();
    });
  });
});
