import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendSuccess, sendPaginated, sendError, buildPaginationMeta } from "../utils/response.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";

// ── T-A06: Topic Controller with Pagination, Filters, and Cache Invalidation ──

export class TopicController {
  /**
   * Get paginated topics with search and filters (cached)
   * GET /api/v1/topics
   */
  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, category, difficulty } = req.query as any;

      const parsedPage = Math.max(1, Number(page));
      const parsedLimit = Math.max(1, Number(limit));
      const skip = (parsedPage - 1) * parsedLimit;

      // Construct dynamic where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category) {
        where.category = category;
      }

      if (difficulty) {
        where.difficulty = difficulty;
      }

      // Query total record count for pagination metadata
      const total = await prisma.topic.count({ where });

      // Fetch paginated topics including count of sub-relations
      const topics = await prisma.topic.findMany({
        where,
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
        skip,
        take: parsedLimit,
      });

      const meta = buildPaginationMeta(total, parsedPage, parsedLimit);
      return sendPaginated(res, topics, meta);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Get a single topic by ID with sub-relation counts
   * GET /api/v1/topics/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const topic = await prisma.topic.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              lessons: true,
              shortLessons: true,
              storyScenarios: true,
              realLifeScenarios: true,
              criticalQuestions: true,
              mindmapNodes: true,
              miniGames: true,
              reflections: true,
              perspectives: true,
            },
          },
        },
      });

      if (!topic) {
        return sendError(res, "TOPIC_NOT_FOUND", "Chủ đề không tồn tại", 404);
      }

      return sendSuccess(res, topic);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Create a new topic (restricted to ADMIN and MODERATOR, invalidates cache)
   * POST /api/v1/topics
   */
  async create(req: Request, res: Response) {
    try {
      const { title, description, category, difficulty } = req.body;

      const topic = await prisma.topic.create({
        data: {
          title,
          description,
          category,
          difficulty: difficulty || "EASY",
        },
      });

      // Invalidate cache patterns
      await invalidateCachePattern("cache:api:/api/v1/topics*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, topic, 201);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_CREATE_ERROR", error.message, 500);
    }
  }

  /**
   * Update a topic (restricted to ADMIN and MODERATOR, invalidates cache)
   * PATCH /api/v1/topics/:id
   */
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { title, description, category, difficulty } = req.body;

      // Check if topic exists first
      const existing = await prisma.topic.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, "TOPIC_NOT_FOUND", "Chủ đề không tồn tại", 404);
      }

      const topic = await prisma.topic.update({
        where: { id },
        data: {
          title,
          description,
          category,
          difficulty,
        },
      });

      // Invalidate cache patterns
      await invalidateCachePattern("cache:api:/api/v1/topics*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, topic);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_UPDATE_ERROR", error.message, 500);
    }
  }

  /**
   * Delete a topic (restricted to ADMIN and MODERATOR, invalidates cache)
   * DELETE /api/v1/topics/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Check if topic exists first
      const existing = await prisma.topic.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, "TOPIC_NOT_FOUND", "Chủ đề không tồn tại", 404);
      }

      await prisma.topic.delete({ where: { id } });

      // Invalidate cache patterns
      await invalidateCachePattern("cache:api:/api/v1/topics*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, { message: "Xóa chủ đề thành công" });
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "TOPIC_DELETE_ERROR", error.message, 500);
    }
  }
}
