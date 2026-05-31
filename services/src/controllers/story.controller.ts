import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";

// ── Story Controller with Cache Invalidation ─────────────────

export class StoryController {
  /**
   * Get all story scenarios (cached)
   */
  async getAll(req: Request, res: Response) {
    try {
      const stories = await prisma.storyScenario.findMany({
        orderBy: { createdAt: "desc" },
      });
      return sendSuccess(res, stories);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "STORY_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Create a new story scenario (invalidates stories + stats cache)
   */
  async create(req: Request, res: Response) {
    try {
      const { topicId, title, description, characterRole, historicalContext, difficulty } =
        req.body;
      if (!topicId || !title || !description) {
        return sendError(
          res,
          "VALIDATION_ERROR",
          "topicId, title, and description are required",
          400,
        );
      }

      // Check if topic exists
      const topicExists = await prisma.topic.findUnique({
        where: { id: topicId },
      });
      if (!topicExists) {
        return sendError(res, "TOPIC_NOT_FOUND", "Associated topic not found", 404);
      }

      const story = await prisma.storyScenario.create({
        data: {
          topicId,
          title,
          description,
          characterRole,
          historicalContext,
          difficulty: difficulty || "EASY",
        },
      });

      // Invalidate cache
      await invalidateCachePattern("cache:api:/api/v1/stories*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, story, 201);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "STORY_CREATE_ERROR", error.message, 500);
    }
  }
}
