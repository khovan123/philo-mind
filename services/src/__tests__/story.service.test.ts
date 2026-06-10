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

const mockStoryScenarioFindUnique = jest.fn() as any;
const mockStoryScenarioFindMany = jest.fn() as any;
const mockStoryScenarioCount = jest.fn() as any;
const mockStorySessionGroupBy = jest.fn() as any;
const mockStorySessionFindMany = jest.fn() as any;
const mockStoryDecisionGroupBy = jest.fn() as any;
const mockStoryChoiceFindMany = jest.fn() as any;
const mockTransaction = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    $transaction: mockTransaction,
    storyScenario: {
      findUnique: mockStoryScenarioFindUnique,
      findMany: mockStoryScenarioFindMany,
      count: mockStoryScenarioCount,
    },
    storySession: {
      groupBy: mockStorySessionGroupBy,
      findMany: mockStorySessionFindMany,
    },
    storyDecision: {
      groupBy: mockStoryDecisionGroupBy,
    },
    storyChoice: {
      findMany: mockStoryChoiceFindMany,
    },
  },
}));

const { StoryService, StoryError } = await import("../services/story.service.js");

describe("StoryService", () => {
  const storyId = "550e8400-e29b-41d4-a716-446655440000";
  const service = new StoryService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listStories", () => {
    it("returns paginated and enriched stories based on filters", async () => {
      const mockStories = [
        {
          id: storyId,
          title: "Socrates' Trial",
          description: "A trial about truth",
          topic: { id: "topic-1", title: "Ethics" },
          choices: [{ id: "choice-1", choiceText: "Defend himself" }],
        },
      ];
      const mockTotal = 1;

      mockTransaction.mockResolvedValue([mockStories, mockTotal]);
      mockStorySessionGroupBy.mockResolvedValue([
        { storyId, status: "COMPLETED", _count: { _all: 5 } },
        { storyId, status: "IN_PROGRESS", _count: { _all: 3 } },
      ]);
      mockStoryDecisionGroupBy.mockResolvedValue([{ choiceId: "choice-1", _count: { _all: 4 } }]);

      const filters = { topicId: "topic-1", difficulty: "EASY" as const, search: "Socrates" };
      const result = await service.listStories(filters, 1, 10);

      expect(mockTransaction).toHaveBeenCalled();
      expect(result.total).toBe(1);
      expect(result.stories[0].stats).toEqual({
        totalPlayCount: 8,
        completedPlayCount: 5,
        completionRate: 63,
        choicesDistribution: [
          {
            choiceId: "choice-1",
            choiceText: "Defend himself",
            count: 4,
            percentage: 100,
          },
        ],
      });
    });

    it("handles listStories with empty search filters", async () => {
      mockTransaction.mockResolvedValue([[], 0]);
      const result = await service.listStories({});
      expect(result.stories).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getStoryDetail", () => {
    it("throws STORY_NOT_FOUND when story scenario does not exist", async () => {
      mockStoryScenarioFindUnique.mockResolvedValue(null);

      await expect(service.getStoryDetail(storyId)).rejects.toThrow(
        new StoryError("STORY_NOT_FOUND", "Không tìm thấy story scenario", 404),
      );
    });

    it("returns enriched story detail when story scenario exists", async () => {
      const mockStory = {
        id: storyId,
        title: "Socrates' Trial",
        choices: [{ id: "choice-1", choiceText: "Defend himself" }],
      };
      mockStoryScenarioFindUnique.mockResolvedValue(mockStory);
      mockStorySessionGroupBy.mockResolvedValue([]);
      mockStoryDecisionGroupBy.mockResolvedValue([]);

      const result = await service.getStoryDetail(storyId);

      expect(mockStoryScenarioFindUnique).toHaveBeenCalledWith({
        where: { id: storyId },
        include: {
          topic: true,
          choices: {
            include: {
              consequences: {
                include: {
                  analysisTabs: {
                    orderBy: { order: "asc" },
                  },
                },
              },
            },
          },
          learnCards: {
            include: {
              tags: {
                include: {
                  tag: true,
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });
      expect(result.id).toBe(storyId);
      expect(result.stats).toBeDefined();
    });
  });

  describe("getStoryStats", () => {
    it("throws STORY_NOT_FOUND when story scenario does not exist", async () => {
      mockStoryScenarioFindUnique.mockResolvedValue(null);

      await expect(service.getStoryStats(storyId)).rejects.toThrow(
        new StoryError("STORY_NOT_FOUND", "Không tìm thấy câu chuyện", 404),
      );

      expect(mockStoryScenarioFindUnique).toHaveBeenCalledWith({
        where: { id: storyId },
        select: { id: true },
      });
    });

    it("returns correct stats when story exists", async () => {
      mockStoryScenarioFindUnique.mockResolvedValue({ id: storyId });

      mockStorySessionGroupBy.mockResolvedValue([
        { status: "COMPLETED", _count: { id: 10 } },
        { status: "IN_PROGRESS", _count: { id: 5 } },
      ]);

      mockStorySessionFindMany.mockResolvedValue([
        { startedAt: new Date(0), completedAt: new Date(60 * 1000) },
        { startedAt: new Date(0), completedAt: new Date(120 * 1000) },
      ]);

      mockStoryDecisionGroupBy.mockResolvedValue([
        { choiceId: "choice-1", _count: { id: 8 } },
        { choiceId: "choice-2", _count: { id: 2 } },
      ]);

      mockStoryChoiceFindMany.mockResolvedValue([
        { id: "choice-1", content: "Lựa chọn 1" },
        { id: "choice-2", content: "Lựa chọn 2" },
      ]);

      const stats = await service.getStoryStats(storyId);

      expect(stats).toEqual({
        storyId,
        totalSessions: 15,
        completedSessions: 10,
        inProgressSessions: 5,
        totalCompletions: 10,
        averageTime: 90,
        averageTimeMinutes: 2,
        completionRate: 67,
        decisionDistribution: {
          "choice-1": 8,
          "choice-2": 2,
        },
        choiceStats: [
          {
            choiceId: "choice-1",
            content: "Lựa chọn 1",
            count: 8,
            percentage: 80,
          },
          {
            choiceId: "choice-2",
            content: "Lựa chọn 2",
            count: 2,
            percentage: 20,
          },
        ],
      });

      expect(mockStoryScenarioFindUnique).toHaveBeenCalledTimes(1);
      expect(mockStorySessionGroupBy).toHaveBeenCalledTimes(1);
      expect(mockStorySessionFindMany).toHaveBeenCalledTimes(1);
      expect(mockStoryDecisionGroupBy).toHaveBeenCalledTimes(1);
      expect(mockStoryChoiceFindMany).toHaveBeenCalledTimes(1);
    });

    it("calculates percentage correctly when total decisions is zero", async () => {
      mockStoryScenarioFindUnique.mockResolvedValue({ id: storyId });

      mockStorySessionGroupBy.mockResolvedValue([]);
      mockStorySessionFindMany.mockResolvedValue([]);
      mockStoryDecisionGroupBy.mockResolvedValue([]);
      mockStoryChoiceFindMany.mockResolvedValue([{ id: "choice-1", content: "Lựa chọn 1" }]);

      const stats = await service.getStoryStats(storyId);

      expect(stats).toEqual({
        storyId,
        totalSessions: 0,
        completedSessions: 0,
        inProgressSessions: 0,
        totalCompletions: 0,
        averageTime: 0,
        averageTimeMinutes: 0,
        completionRate: 0,
        decisionDistribution: {
          "choice-1": 0,
        },
        choiceStats: [
          {
            choiceId: "choice-1",
            content: "Lựa chọn 1",
            count: 0,
            percentage: 0,
          },
        ],
      });
    });
  });
});
