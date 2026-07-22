import { prisma } from "../config/prisma.js";
import { ActivityLogService, ActivityType } from "../services/activity-log.service.js";
import { BadgeService } from "../services/badge.service.js";
import { TargetType } from "../prisma/generated/client.js";

async function main() {
  console.log("🚀 Starting database backfill for completed chapter lessons...");

  // 1. Fetch all completed chapter nodes
  const completedProgress = await prisma.userChapterProgress.findMany({
    where: {
      status: "done",
    },
    include: {
      chapterNode: true,
    },
  });

  console.log(`Found ${completedProgress.length} completed chapter progress records.`);

  let createdLogs = 0;

  for (const progress of completedProgress) {
    const { userId, chapterNodeId, createdAt, updatedAt } = progress;

    // Check if ActivityLog already exists for this lesson completion
    const existingLog = await prisma.activityLog.findFirst({
      where: {
        userId,
        activityType: ActivityType.LEARN_LESSON,
        targetType: TargetType.LESSON,
        targetId: chapterNodeId,
      },
    });

    if (!existingLog) {
      // Create ActivityLog entry with original completion date
      await prisma.activityLog.create({
        data: {
          userId,
          activityType: ActivityType.LEARN_LESSON,
          targetType: TargetType.LESSON,
          targetId: chapterNodeId,
          createdAt: updatedAt || createdAt || new Date(),
        },
      });
      createdLogs++;
    }
  }

  console.log(`Created ${createdLogs} missing ActivityLog records.`);

  // 2. Fetch all users to evaluate their badges and record their daily active status
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  console.log(`Evaluating badges and recording active status for ${users.length} users...`);

  for (const user of users) {
    // Record login/active check for users so their streak dates are initiated
    await ActivityLogService.recordDailyLogin(user.id);

    // Evaluate badges
    const newlyEarned = await BadgeService.evaluateUserBadges(user.id);
    if (newlyEarned.length > 0) {
      console.log(
        `User ${user.email} earned badges:`,
        newlyEarned.map((b) => b.badge.name).join(", "),
      );
    }
  }

  console.log("🎉 Database backfill completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Backfill failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
