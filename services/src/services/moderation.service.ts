import { prisma } from "../config/prisma.js";
import type { TargetType } from "../prisma/generated/enums.js";
import { ReportStatus, ModerationActionType } from "../prisma/generated/enums.js";

const OFFENSIVE_WORDS = [
  "chửi",
  "bậy",
  "tục",
  "hateful",
  "harassment",
  "phản động",
  "nhục mạ",
  "xúc phạm",
  "chửi thề",
  "khốn nạn",
  "ngu ngốc",
];

export class ModerationService {
  /**
   * Scan text for offensive words and automatically create a report if any are found.
   * Returns true if the content was flagged, false otherwise.
   */
  static async autoFlagContent(
    userId: string,
    targetType: TargetType,
    targetId: string,
    content: string,
  ): Promise<boolean> {
    if (!content) return false;

    const lowerContent = content.toLowerCase();
    const detectedWords = OFFENSIVE_WORDS.filter((word) =>
      lowerContent.includes(word.toLowerCase()),
    );

    if (detectedWords.length > 0) {
      // Create an auto-flagged report
      await prisma.report.create({
        data: {
          reporterId: userId, // User who authored the flagged content
          targetType,
          targetId,
          reason: `[Tự Động Hệ Thống] Phát hiện từ ngữ không phù hợp: ${detectedWords.join(", ")}`,
          status: ReportStatus.PENDING,
        },
      });
      return true;
    }

    return false;
  }

  /**
   * Manually file a report against a piece of content.
   */
  static async createReport(
    reporterId: string,
    targetType: TargetType,
    targetId: string,
    reason: string,
  ) {
    return prisma.report.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
        status: ReportStatus.PENDING,
      },
    });
  }

  /**
   * Get all reports, optionally filtered by status and target type, with pagination.
   * Typically used for administrative/moderation dashboards.
   */
  static async getReports(
    status?: ReportStatus,
    targetType?: TargetType,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (targetType) {
      where.targetType = targetType;
    }

    const [reports, total] = await prisma.$transaction([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          actions: {
            include: {
              moderator: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Apply a moderation action (HIDE, DELETE, WARN, BAN, RESTORE, NO_ACTION) to a report.
   */
  static async takeAction(
    reportId: string,
    moderatorId: string,
    actionType: ModerationActionType,
    note?: string,
  ) {
    // 1. Verify the report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error(`Report not found with id: ${reportId}`);
    }

    // 2. Create the ModerationAction entry
    const action = await prisma.moderationAction.create({
      data: {
        reportId,
        moderatorId,
        actionType,
        note: note || null,
      },
    });

    // 3. Update the report status based on action type
    const finalStatus =
      actionType === ModerationActionType.NO_ACTION ? ReportStatus.REJECTED : ReportStatus.RESOLVED;

    await prisma.report.update({
      where: { id: reportId },
      data: { status: finalStatus },
    });

    // 4. Return the result of the action taken
    return {
      reportId,
      actionId: action.id,
      actionType,
      status: finalStatus,
      note,
    };
  }
}
