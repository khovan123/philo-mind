/* eslint-disable @typescript-eslint/no-explicit-any */
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
const mockUserBadgeFindMany = jest.fn() as any;
const mockUserBadgeCreate = jest.fn() as any;
const mockNotificationCreate = jest.fn() as any;
const mockActivityLogCount = jest.fn() as any;
const mockReflectionEntryCount = jest.fn() as any;
const mockUserProgressCount = jest.fn() as any;
const mockQuizAttemptCount = jest.fn() as any;
const mockDebateArgumentCount = jest.fn() as any;
const mockStorySessionCount = jest.fn() as any;
const mockShortLessonResponseCount = jest.fn() as any;
const mockActivityLogFindMany = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    badge: {
      createMany: mockBadgeCreateMany,
      findMany: mockBadgeFindMany,
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
    reflectionEntry: {
      count: mockReflectionEntryCount,
    },
    userProgress: {
      count: mockUserProgressCount,
    },
    quizAttempt: {
      count: mockQuizAttemptCount,
    },
    debateArgument: {
      count: mockDebateArgumentCount,
    },
    storySession: {
      count: mockStorySessionCount,
    },
    shortLessonResponse: {
      count: mockShortLessonResponseCount,
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
      await BadgeService.ensureBadgesSeeded();
      expect(mockBadgeCreateMany).toHaveBeenCalledWith({
        data: BADGE_DEFINITIONS,
        skipDuplicates: true,
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

      // Mock user metrics: 1 activity, 5 reflections, 5 lessons, 3 quizzes, 5 debates, 3 stories, 3 streak, 10 short lessons
      mockActivityLogCount.mockResolvedValue(1);
      mockReflectionEntryCount.mockResolvedValue(5);
      mockUserProgressCount.mockResolvedValue(5);
      mockQuizAttemptCount.mockResolvedValue(3);
      mockDebateArgumentCount.mockResolvedValue(5);
      mockStorySessionCount.mockResolvedValue(3);
      mockShortLessonResponseCount.mockResolvedValue(10);

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

      // First badge: activity_count_1 (Earned)
      expect(result[0].isEarned).toBe(true);
      expect(result[0].progress).toBe(1);
      expect(result[0].target).toBe(1);

      // Second badge: reflection_count_5 (Unearned, but has 5 progress)
      expect(result[1].isEarned).toBe(false);
      expect(result[1].progress).toBe(5);
      expect(result[1].target).toBe(5);

      // Seventh badge: streak_count_3 (Unearned, but has 3 streak progress)
      const streakBadge = result.find((b) => b.conditionType === "streak_count_3");
      expect(streakBadge?.progress).toBe(3);
      expect(streakBadge?.target).toBe(3);
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
      mockReflectionEntryCount.mockResolvedValue(0);
      mockUserProgressCount.mockResolvedValue(0);
      mockQuizAttemptCount.mockResolvedValue(0);
      mockDebateArgumentCount.mockResolvedValue(0);
      mockStorySessionCount.mockResolvedValue(0);
      mockShortLessonResponseCount.mockResolvedValue(0);
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
      mockReflectionEntryCount.mockResolvedValue(100);
      mockUserProgressCount.mockResolvedValue(100);
      mockQuizAttemptCount.mockResolvedValue(100);
      mockDebateArgumentCount.mockResolvedValue(100);
      mockStorySessionCount.mockResolvedValue(100);
      mockShortLessonResponseCount.mockResolvedValue(100);
      mockActivityLogFindMany.mockResolvedValue([{ createdAt: new Date() }]);

      const newlyEarned = await BadgeService.evaluateUserBadges(userId);

      // Nothing should be newly awarded
      expect(newlyEarned).toHaveLength(0);
      expect(mockUserBadgeCreate).not.toHaveBeenCalled();
    });
  });
});
