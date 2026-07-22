import { prisma } from "../config/prisma.js";
import { TargetType } from "../prisma/generated/client.js";
import { RETAINED_ACTIVITY_TYPES, ActivityType } from "../types/activity.js";
import { BadgeService } from "./badge.service.js";

export { ActivityType, RETAINED_ACTIVITY_TYPES } from "../types/activity.js";

export class ActivityLogService {
  /**
   * Log a new activity for a user and trigger the badge award evaluation.
   */
  static async logActivity(
    userId: string,
    activityType: ActivityType | string,
    targetType: TargetType,
    targetId?: string,
    metadata?: any,
  ) {
    // 1. Create the activity log in the database
    const log = await prisma.activityLog.create({
      data: {
        userId,
        activityType,
        targetType,
        targetId: targetId || null,
        metadata: metadata || null,
      },
    });

    // 2. Trigger the badge evaluation asynchronously (or synchronously for instant feedback)
    let newlyEarnedBadges: any[] = [];
    try {
      newlyEarnedBadges = await BadgeService.evaluateUserBadges(userId);
    } catch (error) {
      console.error("Error evaluating badges during activity logging:", error);
    }

    return {
      log,
      newlyEarnedBadges,
    };
  }

  /**
   * Record daily login for a user, update user.lastActiveAt, and log LOGIN activity if not present today.
   */
  static async recordDailyLogin(userId: string) {
    const now = new Date();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveAt: now },
      });
    } catch (err) {
      // Ignore if user not found
    }

    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const existingTodayLog = await prisma.activityLog.findFirst({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
    });

    if (!existingTodayLog) {
      await this.logActivity(userId, ActivityType.LOGIN, TargetType.LESSON);
    }
  }

  /**
   * Retrieve the paginated activity history for a specific user.
   */
  static async getActivityHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const retainedActivityWhere = {
      userId,
      activityType: { in: RETAINED_ACTIVITY_TYPES },
    };

    const [logs, total] = await prisma.$transaction([
      prisma.activityLog.findMany({
        where: retainedActivityWhere,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({
        where: retainedActivityWhere,
      }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Dynamically calculate consecutive daily streaks and longest streak for a user.
   */
  static async getStreakDetails(userId: string) {
    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
        activityType: { in: RETAINED_ACTIVITY_TYPES },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    if (logs.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActive: null,
      };
    }

    // Extract unique dates in YYYY-MM-DD format (UTC/system-agnostic)
    const uniqueDates = Array.from(
      new Set(logs.map((log) => log.createdAt.toISOString().split("T")[0])),
    );

    // Sort descending for current streak calculation
    const sortedDesc = [...uniqueDates].sort((a, b) => b.localeCompare(a));
    // Sort ascending for longest streak calculation
    const sortedAsc = [...uniqueDates].sort((a, b) => a.localeCompare(b));

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let currentStreak = 0;
    const lastActiveDateStr = sortedDesc[0];

    // Check if the user is active today or yesterday to continue the current streak
    if (lastActiveDateStr === todayStr || lastActiveDateStr === yesterdayStr) {
      currentStreak = 1;
      const expectedDate = new Date(lastActiveDateStr);

      for (let i = 1; i < sortedDesc.length; i++) {
        expectedDate.setDate(expectedDate.getDate() - 1);
        const expectedDateStr = expectedDate.toISOString().split("T")[0];

        if (sortedDesc[i] === expectedDateStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dateStr of sortedAsc) {
      const currentDate = new Date(dateStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
      prevDate = currentDate;
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return {
      currentStreak,
      longestStreak,
      lastActive: logs[0].createdAt,
    };
  }
}
