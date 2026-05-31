import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── Stats Controller with Redis Caching ──────────────────────

export class StatsController {
  /**
   * Get application stats (cached)
   */
  async getStats(req: Request, res: Response) {
    try {
      const [topicsCount, storiesCount, lessonsCount, usersCount] = await Promise.all([
        prisma.topic.count(),
        prisma.storyScenario.count(),
        prisma.lesson.count(),
        prisma.user.count(),
      ]);

      return sendSuccess(res, {
        topicsCount,
        storiesCount,
        lessonsCount,
        usersCount,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "STATS_FETCH_ERROR", error.message, 500);
    }
  }
}
