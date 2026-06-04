import type { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";

// ── T-D02: StoryScenario Service ──────────────────────────────

export class StoryError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "StoryError";
  }
}

export interface ListStoriesFilters {
  topicId?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  search?: string;
}

export class StoryService {
  /**
   * List paginated story scenarios with filters and computed stats
   */
  async listStories(filters: ListStoriesFilters, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.StoryScenarioWhereInput = {};
    if (filters.topicId) {
      whereClause.topicId = filters.topicId;
    }
    if (filters.difficulty) {
      whereClause.difficulty = filters.difficulty;
    }
    if (filters.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [stories, total] = await prisma.$transaction([
      prisma.storyScenario.findMany({
        where: whereClause,
        include: {
          topic: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          choices: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.storyScenario.count({
        where: whereClause,
      }),
    ]);

    const enrichedStories = await this.enrichStoriesWithStats(stories);

    return {
      stories: enrichedStories,
      total,
    };
  }

  /**
   * Get single story scenario detail with nested choices, consequences, analysis tabs, learn cards, and stats
   */
  async getStoryDetail(id: string) {
    const story = await prisma.storyScenario.findUnique({
      where: { id },
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

    if (!story) {
      throw new StoryError("STORY_NOT_FOUND", "Không tìm thấy story scenario", 404);
    }

    const enriched = await this.enrichStoriesWithStats([story]);
    return enriched[0];
  }

  /**
   * Helper function to aggregate play count & choice distribution stats in bulk (optimized)
   */
  private async enrichStoriesWithStats<
    T extends { id: string; choices: { id: string; choiceText: string }[] },
  >(stories: T[]) {
    if (stories.length === 0) return [];

    const storyIds = stories.map((s) => s.id);
    const choiceIds = stories.flatMap((s) => s.choices.map((c) => c.id));

    // 1. Group story sessions by storyId & status to calculate total plays and completion rate
    const sessionCounts = (await prisma.storySession.groupBy({
      by: ["storyId", "status"] as const,
      _count: {
        _all: true,
      },
      where: {
        storyId: { in: storyIds },
      },
    } as any)) as any[];

    // 2. Group story decisions by choiceId to calculate distribution percentages
    const decisionCounts =
      choiceIds.length > 0
        ? ((await prisma.storyDecision.groupBy({
            by: ["choiceId"] as const,
            _count: {
              _all: true,
            },
            where: {
              choiceId: { in: choiceIds },
            },
          } as any)) as any[])
        : [];

    // Build lookup maps
    const sessionStatsMap: Record<string, { total: number; completed: number }> = {};
    for (const item of sessionCounts) {
      const sId = item.storyId;
      if (!sessionStatsMap[sId]) {
        sessionStatsMap[sId] = { total: 0, completed: 0 };
      }
      sessionStatsMap[sId].total += item._count._all;
      if (item.status === "COMPLETED") {
        sessionStatsMap[sId].completed += item._count._all;
      }
    }

    const decisionStatsMap: Record<string, number> = {};
    for (const item of decisionCounts) {
      decisionStatsMap[item.choiceId] = item._count._all;
    }

    // Map stats back to each story object
    return stories.map((story) => {
      const sessionStats = sessionStatsMap[story.id] || { total: 0, completed: 0 };
      const completionRate =
        sessionStats.total > 0
          ? Math.round((sessionStats.completed / sessionStats.total) * 100)
          : 0;

      const totalDecisionsForStory = story.choices.reduce((sum, choice) => {
        return sum + (decisionStatsMap[choice.id] || 0);
      }, 0);

      const choicesDistribution = story.choices.map((choice) => {
        const count = decisionStatsMap[choice.id] || 0;
        const percentage =
          totalDecisionsForStory > 0 ? Math.round((count / totalDecisionsForStory) * 100) : 0;
        return {
          choiceId: choice.id,
          choiceText: choice.choiceText,
          count,
          percentage,
        };
      });

      const stats = {
        totalPlayCount: sessionStats.total,
        completedPlayCount: sessionStats.completed,
        completionRate,
        choicesDistribution,
      };

      return {
        ...story,
        stats,
      };
    });
  }

  /**
   * Get detailed choice statistics and session completion info for a single story scenario
   */
  async getStoryStats(id: string) {
    const story = await prisma.storyScenario.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!story) {
      throw new StoryError("STORY_NOT_FOUND", "Không tìm thấy câu chuyện", 404);
    }

    // 1. Group sessions by status to count total, completed, in-progress sessions
    const sessionGroups = await prisma.storySession.groupBy({
      by: ["status"],
      where: { storyId: id },
      _count: { id: true },
    });

    let completedSessions = 0;
    let inProgressSessions = 0;
    for (const group of sessionGroups) {
      if (group.status === "COMPLETED") {
        completedSessions = group._count.id;
      } else if (group.status === "IN_PROGRESS") {
        inProgressSessions = group._count.id;
      }
    }
    const totalSessions = completedSessions + inProgressSessions;

    // 2. We also call prisma.storySession.findMany to calculate average completion time
    const completedSessionsList = await prisma.storySession.findMany({
      where: {
        storyId: id,
        status: "COMPLETED",
      },
      select: {
        startedAt: true,
        completedAt: true,
      },
    });

    let averageTime = 0;
    if (completedSessionsList.length > 0) {
      const totalTimeMs = completedSessionsList.reduce((sum, session) => {
        if (session.completedAt && session.startedAt) {
          return sum + (session.completedAt.getTime() - session.startedAt.getTime());
        }
        return sum;
      }, 0);
      averageTime = Math.round(totalTimeMs / completedSessionsList.length / 1000); // average time in seconds
    }

    // 3. Fetch choices for the story using storyId
    const choices = await prisma.storyChoice.findMany({
      where: { storyId: id },
    });

    const choiceIds = choices.map((c) => c.id);

    // 4. Group decisions by choiceId to calculate distribution
    const decisionGroups =
      choiceIds.length > 0
        ? ((await prisma.storyDecision.groupBy({
            by: ["choiceId"] as const,
            _count: {
              id: true,
            },
            where: {
              choiceId: { in: choiceIds },
            },
          } as any)) as any[])
        : [];

    const decisionStatsMap: Record<string, number> = {};
    for (const item of decisionGroups) {
      decisionStatsMap[item.choiceId] = item._count.id;
    }

    const totalDecisions = choices.reduce((sum, choice) => {
      return sum + (decisionStatsMap[choice.id] || 0);
    }, 0);

    const choiceStats = choices.map((choice) => {
      const count = decisionStatsMap[choice.id] || 0;
      const percentage = totalDecisions > 0 ? Math.round((count / totalDecisions) * 100) : 0;
      return {
        choiceId: choice.id,
        content: (choice as any).content || (choice as any).choiceText || "",
        count,
        percentage,
      };
    });

    // Build decision distribution map for visualization
    const decisionDistribution: Record<string, number> = {};
    for (const choice of choices) {
      decisionDistribution[choice.id] = decisionStatsMap[choice.id] || 0;
    }

    const completionRate =
      totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    const averageTimeMinutes = averageTime > 0 ? Math.round(averageTime / 60) : 0;

    return {
      storyId: id,
      totalSessions,
      completedSessions,
      inProgressSessions,
      totalCompletions: completedSessions,
      averageTime,
      averageTimeMinutes,
      completionRate,
      choiceStats,
      decisionDistribution,
    };
  }
}

export const storyService = new StoryService();
