import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendSuccess, sendPaginated, sendError, buildPaginationMeta } from "../utils/response.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";
import { ActivityLogService, ActivityType } from "../services/activity-log.service.js";
import { TargetType, ProgressStatus, ContentStatus } from "../prisma/generated/client.js";

// ── T-A07: Lesson Controller ───────────────────────────────────

export class LessonController {
  /**
   * Get paginated lessons with search, filters, and role-based access control.
   * GET /api/v1/lessons
   */
  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, topicId, status } = req.query as any;

      const parsedPage = Math.max(1, Number(page));
      const parsedLimit = Math.max(1, Number(limit));
      const skip = (parsedPage - 1) * parsedLimit;

      const where: any = {};

      // Filter by topicId if provided
      if (topicId) {
        where.topicId = topicId;
      }

      // Filter by search query in title or content
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      // Role-based status filtering
      const isAdminOrModerator = req.user && ["ADMIN", "MODERATOR"].includes(req.user.role);

      if (!isAdminOrModerator) {
        // Standard users can only view PUBLISHED lessons
        where.status = ContentStatus.PUBLISHED;
      } else if (status) {
        // Admin/Mod can specify status in query parameters
        where.status = status;
      }

      // Count total matches
      const total = await prisma.lesson.count({ where });

      // Fetch paginated lessons
      const lessons = await prisma.lesson.findMany({
        where,
        include: {
          topic: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parsedLimit,
      });

      const meta = buildPaginationMeta(total, parsedPage, parsedLimit);
      return sendPaginated(res, lessons, meta);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "LESSON_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Get a single lesson by ID with nested questions.
   * GET /api/v1/lessons/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: {
          topic: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          questions: {
            include: {
              answers: userId
                ? {
                    where: { userId },
                    select: {
                      id: true,
                      answerText: true,
                      createdAt: true,
                    },
                  }
                : false,
            },
          },
        },
      });

      if (!lesson) {
        return sendError(res, "LESSON_NOT_FOUND", "Bài học không tồn tại", 404);
      }

      // Enforce published-only check for standard users
      const isAdminOrModerator = req.user && ["ADMIN", "MODERATOR"].includes(req.user.role);
      if (!isAdminOrModerator && lesson.status !== ContentStatus.PUBLISHED) {
        return sendError(res, "LESSON_NOT_FOUND", "Bài học không tồn tại", 404);
      }

      return sendSuccess(res, lesson);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "LESSON_FETCH_ERROR", error.message, 500);
    }
  }

  /**
   * Create a new lesson (restricted to ADMIN/MODERATOR).
   * POST /api/v1/lessons
   */
  async create(req: Request, res: Response) {
    try {
      const {
        topicId,
        title,
        content,
        realLifeExample,
        conflict,
        estimatedMinutes,
        status,
        questions,
      } = req.body;

      // Verify that Topic exists
      const topicExists = await prisma.topic.findUnique({ where: { id: topicId } });
      if (!topicExists) {
        return sendError(res, "TOPIC_NOT_FOUND", "Chủ đề không tồn tại", 400);
      }

      // Create lesson
      const lesson = await prisma.lesson.create({
        data: {
          topicId,
          title,
          content,
          realLifeExample: realLifeExample || null,
          conflict: conflict || null,
          estimatedMinutes: estimatedMinutes || null,
          status: status || ContentStatus.DRAFT,
          questions:
            questions && questions.length > 0
              ? {
                  create: questions.map((q: any) => ({
                    question: q.question,
                    questionType: q.questionType || "OPEN_TEXT",
                  })),
                }
              : undefined,
        },
        include: {
          questions: true,
        },
      });

      // Invalidate caches
      await invalidateCachePattern("cache:api:/api/v1/lessons*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, lesson, 201);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "LESSON_CREATE_ERROR", error.message, 500);
    }
  }

  /**
   * Update an existing lesson (restricted to ADMIN/MODERATOR).
   * PATCH /api/v1/lessons/:id
   */
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { topicId, title, content, realLifeExample, conflict, estimatedMinutes, status } =
        req.body;

      // Check if lesson exists
      const existing = await prisma.lesson.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, "LESSON_NOT_FOUND", "Bài học không tồn tại", 404);
      }

      // If topicId is changing, verify topic exists
      if (topicId && topicId !== existing.topicId) {
        const topicExists = await prisma.topic.findUnique({ where: { id: topicId } });
        if (!topicExists) {
          return sendError(res, "TOPIC_NOT_FOUND", "Chủ đề không tồn tại", 400);
        }
      }

      // Update lesson
      const updated = await prisma.lesson.update({
        where: { id },
        data: {
          topicId,
          title,
          content,
          realLifeExample,
          conflict,
          estimatedMinutes,
          status,
        },
      });

      // Invalidate caches
      await invalidateCachePattern("cache:api:/api/v1/lessons*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, updated);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "LESSON_UPDATE_ERROR", error.message, 500);
    }
  }

  /**
   * Delete an existing lesson (restricted to ADMIN/MODERATOR).
   * DELETE /api/v1/lessons/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Check if lesson exists
      const existing = await prisma.lesson.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, "LESSON_NOT_FOUND", "Bài học không tồn tại", 404);
      }

      // Delete lesson (Prisma relations should handle cascade on questions/answers/progress)
      await prisma.lesson.delete({ where: { id } });

      // Invalidate caches
      await invalidateCachePattern("cache:api:/api/v1/lessons*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");

      return sendSuccess(res, { message: "Bài học đã được xóa thành công" });
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "LESSON_DELETE_ERROR", error.message, 500);
    }
  }

  /**
   * Submit an answer to a review question.
   * POST /api/v1/lessons/questions/:questionId/answers
   */
  async submitQuestionAnswer(req: Request, res: Response) {
    try {
      const questionId = req.params.questionId as string;
      const { answerText } = req.body;
      const userId = req.user!.id;

      // Verify question exists
      const question = await prisma.lessonQuestion.findUnique({
        where: { id: questionId },
        include: { lesson: true },
      });

      if (!question) {
        return sendError(res, "QUESTION_NOT_FOUND", "Câu hỏi không tồn tại", 404);
      }

      // Upsert answer (standard unique search in model is not enforced, so we do it via query)
      const existingAnswer = await prisma.lessonAnswer.findFirst({
        where: { userId, questionId },
      });

      let answer;
      if (existingAnswer) {
        answer = await prisma.lessonAnswer.update({
          where: { id: existingAnswer.id },
          data: { answerText },
        });
      } else {
        answer = await prisma.lessonAnswer.create({
          data: {
            userId,
            questionId,
            answerText,
          },
        });
      }

      return sendSuccess(res, answer);
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "ANSWER_SUBMIT_ERROR", error.message, 500);
    }
  }

  /**
   * Update or complete progress for a lesson.
   * POST /api/v1/lessons/:id/progress
   */
  async updateProgress(req: Request, res: Response) {
    try {
      const lessonId = req.params.id as string;
      const { status = ProgressStatus.IN_PROGRESS, progressPercent = 0 } = req.body;
      const userId = req.user!.id;

      // Verify lesson exists
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) {
        return sendError(res, "LESSON_NOT_FOUND", "Bài học không tồn tại", 404);
      }

      const isCompleted = status === ProgressStatus.COMPLETED || progressPercent >= 100;
      const resolvedStatus = isCompleted ? ProgressStatus.COMPLETED : status;
      const resolvedPercent = isCompleted
        ? 100
        : Math.min(100, Math.max(0, Number(progressPercent)));

      // Upsert progress
      const progress = await prisma.userProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        update: {
          status: resolvedStatus,
          progressPercent: resolvedPercent,
          completedAt: isCompleted ? new Date() : undefined,
        },
        create: {
          userId,
          lessonId,
          status: resolvedStatus,
          progressPercent: resolvedPercent,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      // Log activity and evaluate badges if newly completed
      let newlyEarnedBadges: any[] = [];
      if (isCompleted) {
        const activityResult = await ActivityLogService.logActivity(
          userId,
          ActivityType.LEARN_LESSON,
          TargetType.LESSON,
          lessonId,
        );
        newlyEarnedBadges = activityResult.newlyEarnedBadges;
      }

      return sendSuccess(res, {
        progress,
        newlyEarnedBadges,
      });
    } catch (err: unknown) {
      const error = err as Error;
      return sendError(res, "PROGRESS_UPDATE_ERROR", error.message, 500);
    }
  }
}
