import { prisma } from "../config/prisma.js";
import { TargetType, ProgressStatus } from "../prisma/generated/enums.js";

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
    name: "Nhà lập thuyết",
    description: "Đóng góp 5 lập luận sắc bén trong các cuộc tranh luận",
    iconUrl: "🗣️",
    conditionType: "debate_count_5",
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

export class BadgeService {
  /**
   * Ensure standard 10 badges are seeded in the database.
   */
  static async ensureBadgesSeeded(): Promise<void> {
    for (const def of BADGE_DEFINITIONS) {
      const existing = await prisma.badge.findFirst({
        where: { conditionType: def.conditionType },
      });
      if (!existing) {
        await prisma.badge.create({
          data: {
            name: def.name,
            description: def.description,
            iconUrl: def.iconUrl,
            conditionType: def.conditionType,
          },
        });
      }
    }
  }

  /**
   * Retrieve all badges and their earning status for a specific user.
   */
  static async getAllBadgesForUser(userId: string) {
    await this.ensureBadgesSeeded();

    const allBadges = await prisma.badge.findMany();
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
    });

    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

    // Calculate current metrics for progress details
    const metrics = await this.getUserMetrics(userId);

    return allBadges.map((badge) => {
      const isEarned = earnedBadgeIds.has(badge.id);
      const earnedAt = userBadges.find((ub) => ub.badgeId === badge.id)?.earnedAt || null;

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
        case "debate_count_5":
          progress = metrics.debateArgumentCount;
          target = 5;
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
        isEarned,
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
  static async evaluateUserBadges(userId: string): Promise<any[]> {
    await this.ensureBadgesSeeded();

    const metrics = await this.getUserMetrics(userId);
    const allBadges = await prisma.badge.findMany();
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
    });

    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));
    const newlyEarnedBadges: any[] = [];

    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) {
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
        case "debate_count_5":
          isEligible = metrics.debateArgumentCount >= 5;
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
    const totalActivities = await prisma.activityLog.count({ where: { userId } });
    const reflectionCount = await prisma.reflectionEntry.count({ where: { userId } });
    const completedLessonsCount = await prisma.userProgress.count({
      where: { userId, status: ProgressStatus.COMPLETED },
    });
    const quizCount = await prisma.quizAttempt.count({ where: { userId } });
    const debateArgumentCount = await prisma.debateArgument.count({ where: { userId } });
    const storyCount = await prisma.storySession.count({ where: { userId } });
    const shortLessonCount = await prisma.shortLessonResponse.count({ where: { userId } });

    // Dynamic streak calculation
    const streakResult = await prisma.activityLog.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    let currentStreak = 0;
    if (streakResult.length > 0) {
      const uniqueDates = Array.from(
        new Set(streakResult.map((log) => log.createdAt.toISOString().split("T")[0])),
      ).sort((a, b) => b.localeCompare(a));

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
      debateArgumentCount,
      storyCount,
      shortLessonCount,
      currentStreak,
    };
  }
}
