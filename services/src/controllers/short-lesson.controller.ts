import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendSuccess, sendPaginated, sendError, buildPaginationMeta } from "../utils/response.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";

// ── T-A08: Short Lesson Controller ───────────────────────────────────

export class ShortLessonController {
  /**
   * Get paginated short lessons with stance counts
   * GET /api/v1/short-lessons
   */
  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, topicId } = req.query as any;

      const parsedPage = Math.max(1, Number(page));
      const parsedLimit = Math.max(1, Number(limit));
      const skip = (parsedPage - 1) * parsedLimit;

      const where: any = {};
      if (topicId) {
        where.topicId = topicId;
      }

      // Query total record count for pagination metadata
      const total = await prisma.shortLesson.count({ where });

      // Fetch paginated short lessons
      const shortLessons = await prisma.shortLesson.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parsedLimit,
      });

      const ids = shortLessons.map((l) => l.id);

      // Fetch stance counts in bulk using groupBy for optimal performance
      const counts = await prisma.shortLessonResponse.groupBy({
        by: ["shortLessonId", "selectedStance"],
        where: {
          shortLessonId: { in: ids },
        },
        _count: {
          _all: true,
        },
      });

      const countMap = ids.reduce(
        (acc, id) => {
          acc[id] = { stanceACount: 0, stanceBCount: 0 };
          return acc;
        },
        {} as Record<string, { stanceACount: number; stanceBCount: number }>,
      );

      for (const c of counts) {
        if (c.selectedStance === "STANCE_A") {
          countMap[c.shortLessonId].stanceACount = c._count._all;
        } else if (c.selectedStance === "STANCE_B") {
          countMap[c.shortLessonId].stanceBCount = c._count._all;
        }
      }

      const lessonsWithStats = shortLessons.map((lesson) => ({
        ...lesson,
        stats: countMap[lesson.id],
      }));

      const meta = buildPaginationMeta(total, parsedPage, parsedLimit);
      return sendPaginated(res, lessonsWithStats, meta);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "SHORT_LESSON_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Get a single short lesson with community stats, current user response, and comments
   * GET /api/v1/short-lessons/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user?.id;

      const shortLesson = await prisma.shortLesson.findUnique({
        where: { id },
      });

      if (!shortLesson) {
        return sendError(res, "SHORT_LESSON_NOT_FOUND", "Bài học ngắn không tồn tại", 404);
      }

      // Fetch community stance counts
      const counts = await prisma.shortLessonResponse.groupBy({
        by: ["selectedStance"],
        where: { shortLessonId: id },
        _count: {
          _all: true,
        },
      });

      const stanceACount = counts.find((c) => c.selectedStance === "STANCE_A")?._count._all ?? 0;
      const stanceBCount = counts.find((c) => c.selectedStance === "STANCE_B")?._count._all ?? 0;

      // Fetch user's own response if authenticated
      let myResponse = null;
      if (userId) {
        myResponse = await prisma.shortLessonResponse.findUnique({
          where: {
            userId_shortLessonId: {
              userId,
              shortLessonId: id,
            },
          },
        });
      }

      // Fetch recent 20 comments with author info
      const comments = await prisma.shortLessonComment.findMany({
        where: { shortLessonId: id },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      return sendSuccess(res, {
        ...shortLesson,
        stats: {
          stanceACount,
          stanceBCount,
        },
        myResponse,
        comments,
      });
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "SHORT_LESSON_DETAIL_ERROR", error.message, 500);
    }
  }

  /**
   * Submit/upsert response to a short lesson dilemma
   * POST /api/v1/short-lessons/:id/respond
   */
  async respond(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user?.id;
      const { stance, reason } = req.body;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Người dùng chưa xác thực", 401);
      }

      // Check if the short lesson exists
      const shortLesson = await prisma.shortLesson.findUnique({
        where: { id },
      });

      if (!shortLesson) {
        return sendError(res, "SHORT_LESSON_NOT_FOUND", "Bài học ngắn không tồn tại", 404);
      }

      // Upsert stance choice cleanly and safely
      const response = await prisma.shortLessonResponse.upsert({
        where: {
          userId_shortLessonId: {
            userId,
            shortLessonId: id,
          },
        },
        update: {
          selectedStance: stance,
          comment: reason || null,
        },
        create: {
          userId,
          shortLessonId: id,
          selectedStance: stance,
          comment: reason || null,
        },
      });

      // Recalculate community stance counts
      const counts = await prisma.shortLessonResponse.groupBy({
        by: ["selectedStance"],
        where: { shortLessonId: id },
        _count: {
          _all: true,
        },
      });

      const stanceACount = counts.find((c) => c.selectedStance === "STANCE_A")?._count._all ?? 0;
      const stanceBCount = counts.find((c) => c.selectedStance === "STANCE_B")?._count._all ?? 0;

      // Invalidate cache
      await invalidateCachePattern("cache:api:/api/v1/short-lessons*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, {
        response,
        stats: {
          stanceACount,
          stanceBCount,
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "SHORT_LESSON_RESPOND_ERROR", error.message, 500);
    }
  }

  /**
   * Post a new comment to a short lesson
   * POST /api/v1/short-lessons/:id/comments
   */
  async comment(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user?.id;
      const { commentText } = req.body;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Người dùng chưa xác thực", 401);
      }

      // Check if the short lesson exists
      const shortLesson = await prisma.shortLesson.findUnique({
        where: { id },
      });

      if (!shortLesson) {
        return sendError(res, "SHORT_LESSON_NOT_FOUND", "Bài học ngắn không tồn tại", 404);
      }

      const comment = await prisma.shortLessonComment.create({
        data: {
          shortLessonId: id,
          userId,
          commentText,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      });

      // Invalidate cache
      await invalidateCachePattern("cache:api:/api/v1/short-lessons*");

      return sendSuccess(res, comment, 201);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "SHORT_LESSON_COMMENT_ERROR", error.message, 500);
    }
  }

  /**
   * Get all comments of a short lesson (paginated)
   * GET /api/v1/short-lessons/:id/comments
   */
  async getComments(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { page = 1, limit = 10 } = req.query as any;

      const parsedPage = Math.max(1, Number(page));
      const parsedLimit = Math.max(1, Number(limit));
      const skip = (parsedPage - 1) * parsedLimit;

      // Check if the short lesson exists
      const shortLesson = await prisma.shortLesson.findUnique({
        where: { id },
      });

      if (!shortLesson) {
        return sendError(res, "SHORT_LESSON_NOT_FOUND", "Bài học ngắn không tồn tại", 404);
      }

      const total = await prisma.shortLessonComment.count({
        where: { shortLessonId: id },
      });

      const comments = await prisma.shortLessonComment.findMany({
        where: { shortLessonId: id },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parsedLimit,
      });

      const meta = buildPaginationMeta(total, parsedPage, parsedLimit);
      return sendPaginated(res, comments, meta);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "SHORT_LESSON_COMMENTS_FETCH_ERROR", error.message, 500);
    }
  }
}
