import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";

// ── Topic Controller with Cache Invalidation ─────────────────

export class TopicController {
  /**
   * Get all topics (cached)
   */
  async getAll(req: Request, res: Response) {
    try {
      const topics = await prisma.topic.findMany({
        include: {
          _count: {
            select: {
              lessons: true,
              shortLessons: true,
              storyScenarios: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return sendSuccess(res, topics);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Create a new topic (invalidates topics + stats cache)
   */
  async create(req: Request, res: Response) {
    try {
      const { title, description, category, difficulty } = req.body;
      if (!title) {
        return sendError(res, "VALIDATION_ERROR", "Title is required", 400);
      }

      const topic = await prisma.topic.create({
        data: {
          title,
          description,
          category,
          difficulty: difficulty || "EASY",
        },
      });

      // Invalidate cache
      await invalidateCachePattern("cache:api:/api/v1/topics*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, topic, 201);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_CREATE_ERROR", error.message, 500);
    }
  }
}
