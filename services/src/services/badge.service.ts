import { prisma } from "../config/prisma.js";
import type { Prisma } from "../prisma/generated/client.js";
import { ProgressStatus } from "../prisma/generated/enums.js";
import { RETAINED_ACTIVITY_TYPES } from "../types/activity.js";

export interface BadgeDefinition {
  name: string;
  description: string;
  iconUrl: string;
  conditionType: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    name: "Ngày học đầu tiên",
    description: "Hoàn thành 1 hoạt động học tập có ý nghĩa trên PhiloMind",
    iconUrl: "🌱",
    conditionType: "first_learning_day",
  },
  {
    name: "Hoàn tất nhập môn",
    description: "Hoàn thành 3 bài học chính thức",
    iconUrl: "📘",
    conditionType: "lesson_finish_3",
  },
  {
    name: "Người luyện đáp án",
    description: "Hoàn thành 5 lượt quiz hoặc luyện tập",
    iconUrl: "🎯",
    conditionType: "quiz_complete_5",
  },
  {
    name: "Người lưu tri thức",
    description: "Lưu 3 nội dung học tập vào bookmark",
    iconUrl: "🔖",
    conditionType: "bookmark_save_3",
  },
  {
    name: "Lữ khách Story Mode",
    description: "Đưa ra 3 lựa chọn trong luồng học Story Mode",
    iconUrl: "🎭",
    conditionType: "story_decision_3",
  },
  {
    name: "Người chơi khái niệm",
    description: "Hoàn thành 5 lượt mini game ôn tập khái niệm",
    iconUrl: "🧩",
    conditionType: "minigame_complete_5",
  },
  {
    name: "Nhịp ngắn mỗi ngày",
    description: "Phản hồi 7 bài học ngắn daily hook",
    iconUrl: "💡",
    conditionType: "short_lesson_7",
  },
  {
    name: "Giữ nhịp 3 ngày",
    description: "Duy trì streak học tập 3 ngày liên tiếp",
    iconUrl: "🔥",
    conditionType: "learning_streak_3",
  },
  {
    name: "Bền bỉ 7 ngày",
    description: "Duy trì streak học tập 7 ngày liên tiếp",
    iconUrl: "🛡️",
    conditionType: "learning_streak_7",
  },
  {
    name: "Người học toàn diện",
    description:
      "Có hoạt động ở đủ 5 trụ cột: bài học, quiz, Story Mode, short lesson và mini game",
    iconUrl: "🧭",
    conditionType: "balanced_core_5",
  },
];

const ACTIVE_BADGE_CONDITION_TYPES = BADGE_DEFINITIONS.map((badge) => badge.conditionType);

type UserBadgeWithBadge = Prisma.UserBadgeGetPayload<{
  include: { badge: true };
}>;

export class BadgeService {
  /**
   * Ensure current badges are seeded and retired badge definitions are removed.
   */
  static async ensureBadgesSeeded(): Promise<void> {
    await prisma.badge.createMany({
      data: BADGE_DEFINITIONS,
      skipDuplicates: true,
    });

    await prisma.badge.deleteMany({
      where: {
        conditionType: {
          notIn: ACTIVE_BADGE_CONDITION_TYPES,
        },
      },
    });
  }

  /**
   * Retrieve all badges and their earning status for a specific user.
   */
  static async getAllBadgesForUser(userId: string) {
    await this.ensureBadgesSeeded();

    const allBadges = await prisma.badge.findMany({
      where: {
        conditionType: {
          in: ACTIVE_BADGE_CONDITION_TYPES,
        },
      },
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
        case "first_learning_day":
          progress = metrics.totalLearningActivities;
          target = 1;
          break;
        case "lesson_finish_3":
          progress = metrics.completedLessonsCount;
          target = 3;
          break;
        case "quiz_complete_5":
          progress = metrics.completedQuizCount;
          target = 5;
          break;
        case "bookmark_save_3":
          progress = metrics.bookmarkCount;
          target = 3;
          break;
        case "story_decision_3":
          progress = metrics.storyDecisionCount;
          target = 3;
          break;
        case "minigame_complete_5":
          progress = metrics.completedMiniGameCount;
          target = 5;
          break;
        case "short_lesson_7":
          progress = metrics.shortLessonCount;
          target = 7;
          break;
        case "learning_streak_3":
          progress = metrics.currentStreak;
          target = 3;
          break;
        case "learning_streak_7":
          progress = metrics.currentStreak;
          target = 7;
          break;
        case "balanced_core_5":
          progress = metrics.balancedCoreCount;
          target = 5;
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
    await this.ensureBadgesSeeded();

    return prisma.userBadge.findMany({
      where: {
        userId,
        badge: {
          conditionType: {
            in: ACTIVE_BADGE_CONDITION_TYPES,
          },
        },
      },
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
      where: {
        conditionType: {
          in: ACTIVE_BADGE_CONDITION_TYPES,
        },
      },
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
        case "first_learning_day":
          isEligible = metrics.totalLearningActivities >= 1;
          break;
        case "lesson_finish_3":
          isEligible = metrics.completedLessonsCount >= 3;
          break;
        case "quiz_complete_5":
          isEligible = metrics.completedQuizCount >= 5;
          break;
        case "bookmark_save_3":
          isEligible = metrics.bookmarkCount >= 3;
          break;
        case "story_decision_3":
          isEligible = metrics.storyDecisionCount >= 3;
          break;
        case "minigame_complete_5":
          isEligible = metrics.completedMiniGameCount >= 5;
          break;
        case "short_lesson_7":
          isEligible = metrics.shortLessonCount >= 7;
          break;
        case "learning_streak_3":
          isEligible = metrics.currentStreak >= 3;
          break;
        case "learning_streak_7":
          isEligible = metrics.currentStreak >= 7;
          break;
        case "balanced_core_5":
          isEligible = metrics.balancedCoreCount >= 5;
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
      totalLearningActivities,
      legacyCompletedLessonsCount,
      chapterCompletedLessonsCount,
      completedQuizCount,
      storyDecisionCount,
      shortLessonCount,
      completedMiniGameCount,
      bookmarkCount,
      streakResult,
    ] = await Promise.all([
      prisma.activityLog.count({
        where: {
          userId,
          activityType: { in: RETAINED_ACTIVITY_TYPES },
        },
      }),
      prisma.userProgress.count({
        where: { userId, status: ProgressStatus.COMPLETED },
      }),
      prisma.userChapterProgress.count({
        where: { userId, status: "done" },
      }),
      prisma.quizAttempt.count({ where: { userId, completedAt: { not: null } } }),
      prisma.storyDecision.count({ where: { userId } }),
      prisma.shortLessonResponse.count({ where: { userId } }),
      prisma.miniGameAttempt.count({ where: { userId, completedAt: { not: null } } }),
      prisma.bookmark.count({ where: { userId } }),
      prisma.activityLog.findMany({
        where: {
          userId,
          activityType: { in: RETAINED_ACTIVITY_TYPES },
        },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const completedLessonsCount = legacyCompletedLessonsCount + chapterCompletedLessonsCount;

    const balancedCoreCount = [
      completedLessonsCount,
      completedQuizCount,
      storyDecisionCount,
      shortLessonCount,
      completedMiniGameCount,
    ].filter((count) => count > 0).length;

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
      totalLearningActivities,
      completedLessonsCount,
      completedQuizCount,
      storyDecisionCount,
      shortLessonCount,
      completedMiniGameCount,
      bookmarkCount,
      balancedCoreCount,
      currentStreak,
    };
  }
}
