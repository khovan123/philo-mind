import type { Prisma } from "@prisma/client";
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
}

export const storyService = new StoryService();
