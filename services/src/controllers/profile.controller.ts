import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ActivityLogService } from "../services/activity-log.service.js";
import { BadgeService } from "../services/badge.service.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { ProgressStatus } from "../prisma/generated/client.js";

export class ProfileController {
  async summary(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const [user, badges, streak, completedLessons, quizStats, activities] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, fullName: true, email: true, avatarUrl: true, createdAt: true },
        }),
        BadgeService.getAllBadgesForUser(userId),
        ActivityLogService.getStreakDetails(userId),
        prisma.userProgress.count({ where: { userId, status: ProgressStatus.COMPLETED } }),
        prisma.quizAttempt.aggregate({
          where: { userId, completedAt: { not: null } },
          _avg: { score: true },
          _count: { _all: true },
        }),
        prisma.activityLog.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 60,
        }),
      ]);

      if (!user) return sendError(res, "USER_NOT_FOUND", "Nguoi dung khong ton tai", 404);

      const heatmap = this.buildHeatmap(activities);
      const earnedBadges = badges.filter((badge: any) => badge.isEarned);

      return sendSuccess(res, {
        user,
        stats: {
          streakDays: streak.currentStreak,
          points: completedLessons * 40 + quizStats._count._all * 20 + streak.currentStreak * 5,
          stories: activities.filter((item) => item.activityType === "DECIDE_STORY").length,
          completedLessons,
          quizAccuracy: Math.round(quizStats._avg.score ?? 0),
        },
        badges,
        earnedBadges,
        activity: {
          streak,
          heatmap,
          recent: activities.slice(0, 8),
        },
      });
    } catch (err) {
      const error = err as Error;
      return sendError(res, "PROFILE_SUMMARY_ERROR", error.message, 500);
    }
  }

  private buildHeatmap(activities: { createdAt: Date }[]) {
    const counts = new Map<string, number>();
    for (const activity of activities) {
      const day = activity.createdAt.toISOString().slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }

    return Array.from({ length: 28 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (27 - index));
      const day = date.toISOString().slice(0, 10);
      return { date: day, count: counts.get(day) ?? 0 };
    });
  }
}

export const profileController = new ProfileController();
