import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { ProgressStatus } from "../prisma/generated/client.js";
import { ActivityLogService } from "../services/activity-log.service.js";

export class LearningController {
  async dashboard(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const [shortLesson, story, totals] = await Promise.all([
        prisma.shortLesson.findFirst({
          include: { topic: { select: { title: true, category: true } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.storyScenario.findFirst({
          include: { topic: { select: { title: true, category: true } } },
          orderBy: { createdAt: "desc" },
        }),
        Promise.all([
          prisma.lesson.count(),
          prisma.badge.count(),
          prisma.quizAttempt.count({ where: userId ? { userId, completedAt: { not: null } } : {} }),
        ]),
      ]);

      const [lessonsCount, badgesCount, quizAttemptsCount] = totals;
      const progress = userId
        ? await prisma.userProgress.findMany({
            where: { userId },
            include: { lesson: { include: { topic: true } } },
            orderBy: { updatedAt: "desc" },
            take: 6,
          })
        : [];
      const fallbackLessons =
        progress.length === 0
          ? await prisma.lesson.findMany({
              include: { topic: true },
              orderBy: { createdAt: "desc" },
              take: 6,
            })
          : [];

      const streak = userId
        ? await ActivityLogService.getStreakDetails(userId)
        : { currentStreak: 0, longestStreak: 0, lastActive: null };

      const completedLessons = progress.filter(
        (item) => item.status === ProgressStatus.COMPLETED,
      ).length;
      const quizStats = userId
        ? await prisma.quizAttempt.aggregate({
            where: { userId, completedAt: { not: null } },
            _avg: { score: true },
          })
        : { _avg: { score: null } };

      return sendSuccess(res, {
        greeting: "PhiloMind",
        streak,
        points: completedLessons * 40 + quizAttemptsCount * 20 + streak.currentStreak * 5,
        dailyHook: shortLesson
          ? {
              id: shortLesson.id,
              title: shortLesson.hook,
              topic: shortLesson.topic.category ?? shortLesson.topic.title,
              primaryChoice: shortLesson.stanceA,
              secondaryChoice: shortLesson.stanceB,
            }
          : null,
        continueLearning:
          progress.length > 0
            ? progress.map((item) => ({
                lessonId: item.lessonId,
                title: item.lesson.title,
                subtitle: item.lesson.topic.category ?? item.lesson.topic.title,
                difficulty: item.lesson.topic.difficulty,
                progress: item.progressPercent,
                status: item.status,
              }))
            : fallbackLessons.map((lesson) => ({
                lessonId: lesson.id,
                title: lesson.title,
                subtitle: lesson.topic.category ?? lesson.topic.title,
                difficulty: lesson.topic.difficulty,
                progress: 0,
                status: "NOT_STARTED",
              })),
        stats: {
          learnedLessons: completedLessons,
          badges: badgesCount,
          quizAccuracy: Math.round(quizStats._avg.score ?? 0),
          totalLessons: lessonsCount,
        },
        newStory: story
          ? {
              id: story.id,
              title: story.title,
              subtitle: story.description,
              topic: story.topic.category ?? story.topic.title,
              duration: "8 phut",
            }
          : null,
      });
    } catch (err) {
      const error = err as Error;
      return sendError(res, "DASHBOARD_ERROR", error.message, 500);
    }
  }
}

export const learningController = new LearningController();
