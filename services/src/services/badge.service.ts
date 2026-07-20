import { prisma } from "../config/prisma.js";
import type { Prisma } from "../prisma/generated/client.js";
import { ProgressStatus } from "../prisma/generated/enums.js";

export interface BadgeDefinition {
  name: string;
  description: string;
  iconUrl: string;
  conditionType: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    name: "Khởi đầu minh triết",
    description: "Thực hiện hoạt động đầu tiên của bạn trên PhiloMind",
    iconUrl: "🌱",
    conditionType: "activity_count_1",
  },
  {
    name: "Nhà tư duy phản biện",
    description: "Viết 5 bài suy ngẫm cá nhân (reflection)",
    iconUrl: "🧠",
    conditionType: "reflection_count_5",
  },
  {
    name: "Hiền triết hiếu học",
    description: "Hoàn thành 5 bài học lý thuyết sâu sắc",
    iconUrl: "📖",
    conditionType: "lesson_count_5",
  },
  {
    name: "Nhà thông thái trẻ",
    description: "Vượt qua 3 bài trắc nghiệm tư duy (quiz)",
    iconUrl: "🏆",
    conditionType: "quiz_count_3",
  },
  {
    name: "Người kể chuyện triết học",
    description: "Tham gia quyết định kết cục cho 3 tình huống câu chuyện",
    iconUrl: "🎭",
    conditionType: "story_count_3",
  },
  {
    name: "Chiến binh bền bỉ",
    description: "Duy trì chuỗi hoạt động học tập 3 ngày liên tiếp",
    iconUrl: "🔥",
    conditionType: "streak_count_3",
  },
  {
    name: "Bậc thầy châm ngôn",
    description: "Tương tác với 10 bài học ngắn hàng ngày",
    iconUrl: "💡",
    conditionType: "short_lesson_count_10",
  },
  {
    name: "Kẻ lữ hành tò mò",
    description: "Đạt mốc 20 hoạt động bất kỳ trên hệ thống",
    iconUrl: "🧭",
    conditionType: "activity_count_20",
  },
  {
    name: "Nhà Khắc Kỷ kiên định",
    description: "Duy trì chuỗi hoạt động học tập 7 ngày liên tiếp",
    iconUrl: "🛡️",
    conditionType: "streak_count_7",
  },
];

type UserBadgeWithBadge = Prisma.UserBadgeGetPayload<{
  include: { badge: true };
}>;

export class BadgeService {
  /**
   * Ensure standard 10 badges are seeded in the database.
   */
  static async ensureBadgesSeeded(): Promise<void> {
    await prisma.badge.createMany({
      data: BADGE_DEFINITIONS,
      skipDuplicates: true,
    });
  }

  /**
   * Retrieve all badges and their earning status for a specific user.
   */
  static async getAllBadgesForUser(userId: string) {
    await this.ensureBadgesSeeded();

    const allBadges = await prisma.badge.findMany({
      include: {
        userBadges: {
          where: { userId },
          select: { earnedAt: true },
        },
      },
    });

    // Calculate current metrics for progress details
    const metrics = await this.getUserMetrics(userId);

    return allBadges.map((badge) => {
      const earnedAt = badge.userBadges[0]?.earnedAt ?? null;

      // Calculate current progress towards this badge
      let progress = 0;
      let target = 0;

      switch (badge.conditionType) {
        case "activity_count_1":
          progress = metrics.totalActivities;
          target = 1;
          break;
        case "reflection_count_5":
          progress = metrics.reflectionCount;
          target = 5;
          break;
        case "lesson_count_5":
          progress = metrics.completedLessonsCount;
          target = 5;
          break;
        case "quiz_count_3":
          progress = metrics.quizCount;
          target = 3;
          break;
        case "story_count_3":
          progress = metrics.storyCount;
          target = 3;
          break;
        case "streak_count_3":
          progress = metrics.currentStreak;
          target = 3;
          break;
        case "short_lesson_count_10":
          progress = metrics.shortLessonCount;
          target = 10;
          break;
        case "activity_count_20":
          progress = metrics.totalActivities;
          target = 20;
          break;
        case "streak_count_7":
          progress = metrics.currentStreak;
          target = 7;
          break;
      }

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        conditionType: badge.conditionType,
        isEarned: earnedAt !== null,
        earnedAt,
        progress: Math.min(progress, target),
        target,
      };
    });
  }

  /**
   * Retrieve only earned badges of the user
   */
  static async getEarnedBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: "desc" },
    });
  }

  /**
   * Auto-award engine to evaluate and grant badges to a user.
   * Typically called on relevant user activity.
   */
  static async evaluateUserBadges(userId: string): Promise<UserBadgeWithBadge[]> {
    await this.ensureBadgesSeeded();

    const metrics = await this.getUserMetrics(userId);
    const allBadges = await prisma.badge.findMany({
      include: {
        userBadges: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    const newlyEarnedBadges: UserBadgeWithBadge[] = [];

    for (const badge of allBadges) {
      if (badge.userBadges.length > 0) {
        continue;
      }

      let isEligible = false;

      switch (badge.conditionType) {
        case "activity_count_1":
          isEligible = metrics.totalActivities >= 1;
          break;
        case "reflection_count_5":
          isEligible = metrics.reflectionCount >= 5;
          break;
        case "lesson_count_5":
          isEligible = metrics.completedLessonsCount >= 5;
          break;
        case "quiz_count_3":
          isEligible = metrics.quizCount >= 3;
          break;
        case "story_count_3":
          isEligible = metrics.storyCount >= 3;
          break;
        case "streak_count_3":
          isEligible = metrics.currentStreak >= 3;
          break;
        case "short_lesson_count_10":
          isEligible = metrics.shortLessonCount >= 10;
          break;
        case "activity_count_20":
          isEligible = metrics.totalActivities >= 20;
          break;
        case "streak_count_7":
          isEligible = metrics.currentStreak >= 7;
          break;
      }

      if (isEligible) {
        // Award the badge!
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
          include: {
            badge: true,
          },
        });

        // Send a badge earned notification
        await prisma.notification.create({
          data: {
            userId,
            content: `🏆 Nhận Huy Hiệu Mới: ${badge.name}\n\nChúc mừng! Bạn đã đạt điều kiện và nhận được huy hiệu "${badge.name}": ${badge.description}`,
            type: "BADGE_EARNED",
            metadata: {
              badgeId: badge.id,
              badgeName: badge.name,
              badgeIcon: badge.iconUrl,
            },
          },
        });

        newlyEarnedBadges.push(userBadge);
      }
    }

    return newlyEarnedBadges;
  }

  /**
   * Fetch all counts and streak metrics for the user to evaluate badge eligibility.
   */
  private static async getUserMetrics(userId: string) {
    const [
      totalActivities,
      reflectionCount,
      completedLessonsCount,
      quizCount,
      storyCount,
      shortLessonCount,
      streakResult,
    ] = await Promise.all([
      prisma.activityLog.count({ where: { userId } }),
      prisma.reflectionEntry.count({ where: { userId } }),
      prisma.userProgress.count({
        where: { userId, status: ProgressStatus.COMPLETED },
      }),
      prisma.quizAttempt.count({ where: { userId } }),
      prisma.storySession.count({ where: { userId } }),
      prisma.shortLessonResponse.count({ where: { userId } }),
      prisma.activityLog.findMany({
        where: { userId },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    let currentStreak = 0;
    if (streakResult.length > 0) {
      const uniqueDates = Array.from(
        new Set(
          streakResult.map((log: { createdAt: Date }) => log.createdAt.toISOString().split("T")[0]),
        ),
      ).sort((a: string, b: string) => b.localeCompare(a));

      const todayStr = new Date().toISOString().split("T")[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        currentStreak = 1;
        const expectedDate = new Date(uniqueDates[0]);
        for (let i = 1; i < uniqueDates.length; i++) {
          expectedDate.setDate(expectedDate.getDate() - 1);
          const expectedDateStr = expectedDate.toISOString().split("T")[0];
          if (uniqueDates[i] === expectedDateStr) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalActivities,
      reflectionCount,
      completedLessonsCount,
      quizCount,
      storyCount,
      shortLessonCount,
      currentStreak,
    };
  }
}
