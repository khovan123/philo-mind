import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { storyService, StoryError } from "../services/story.service.js";
import {
  sendSuccess,
  sendError,
  sendPaginated,
  buildPaginationMeta,
  parsePagination,
} from "../utils/response.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";

// ── Story Controller with Cache Invalidation & Pagination ─────

export class StoryController {
  /**
   * Get all story scenarios (paginated and filterable)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { topicId, difficulty, search } = req.query as Record<string, string | undefined>;
      const { page, limit } = parsePagination(req.query);

      const result = await storyService.listStories({ topicId, difficulty, search }, page, limit);

      const meta = buildPaginationMeta(result.total, page, limit);
      return sendPaginated(res, result.stories, meta, 200);
    } catch (err: unknown) {
      if (err instanceof StoryError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Get single story scenario detail with choices, consequences, analysis tabs, learn cards, and stats
   */
  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const story = await storyService.getStoryDetail(String(id));
      return sendSuccess(res, story, 200);
    } catch (err: unknown) {
      if (err instanceof StoryError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Create a new story scenario (invalidates stories + stats cache)
   */
  async create(req: Request, res: Response, next: NextFunction) {
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
      return next(err);
    }
  }
}
