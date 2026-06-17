import { prisma } from "../config/prisma.js";
import { ActivityLogService, ActivityType } from "./activity-log.service.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";
import { DebateStance, VoteValue, DebateStatus } from "../prisma/generated/enums.js";

// ── T-F05: Debate Service ──────────────────────────────────────────

export class DebateError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "DebateError";
  }
}

export class DebateService {
  /**
   * List debates with counts (paginated & filtered)
   */
  async listDebates(
    filters: { topicId?: string; stance?: DebateStance },
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.topicId) {
      where.topicId = filters.topicId;
    }
    if (filters.stance) {
      where.arguments = {
        some: { stance: filters.stance },
      };
    }

    const [debates, total] = await Promise.all([
      prisma.debate.findMany({
        where,
        include: {
          arguments: {
            select: {
              stance: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.debate.count({ where }),
    ]);

    // Map counts of arguments by stance
    const debatesWithCounts = debates.map((debate) => {
      const agreeCount = debate.arguments.filter((a) => a.stance === DebateStance.AGREE).length;
      const disagreeCount = debate.arguments.filter(
        (a) => a.stance === DebateStance.DISAGREE,
      ).length;
      const neutralCount = debate.arguments.filter((a) => a.stance === DebateStance.NEUTRAL).length;
      const alternativeCount = debate.arguments.filter(
        (a) => a.stance === DebateStance.ALTERNATIVE,
      ).length;

      return {
        id: debate.id,
        topicId: debate.topicId,
        title: debate.title,
        description: debate.description,
        status: debate.status,
        createdAt: debate.createdAt,
        counts: {
          total: debate.arguments.length,
          agree: agreeCount,
          disagree: disagreeCount,
          neutral: neutralCount,
          alternative: alternativeCount,
        },
      };
    });

    return {
      debates: debatesWithCounts,
      total,
    };
  }

  /**
   * Get debate detail including arguments with user info, comments, and votes
   */
  async getDebateDetail(id: string, userId?: string | null) {
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: {
        arguments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
            votes: true,
          },
          orderBy: [{ voteCount: "desc" }, { createdAt: "desc" }],
        },
      },
    });

    if (!debate) {
      throw new DebateError("DEBATE_NOT_FOUND", "Không tìm thấy phiên tranh luận này", 404);
    }

    // Format arguments to attach current user's vote and strip raw votes array if necessary
    const formattedArguments = debate.arguments.map((arg) => {
      const userVote = userId ? arg.votes.find((v) => v.userId === userId)?.value || null : null;
      const upVotes = arg.votes.filter((v) => v.value === VoteValue.UP).length;
      const downVotes = arg.votes.filter((v) => v.value === VoteValue.DOWN).length;

      return {
        id: arg.id,
        debateId: arg.debateId,
        userId: arg.userId,
        stance: arg.stance,
        argumentText: arg.argumentText,
        voteCount: arg.voteCount, // calculated score
        createdAt: arg.createdAt,
        user: arg.user,
        comments: arg.comments,
        userVote,
        voteStats: {
          up: upVotes,
          down: downVotes,
        },
      };
    });

    return {
      id: debate.id,
      topicId: debate.topicId,
      title: debate.title,
      description: debate.description,
      status: debate.status,
      createdAt: debate.createdAt,
      arguments: formattedArguments,
    };
  }

  /**
   * Create a new argument in a debate
   */
  async createArgument(
    debateId: string,
    userId: string,
    input: { stance: DebateStance; content: string },
  ) {
    // 1. Verify debate exists and is open
    const debate = await prisma.debate.findUnique({
      where: { id: debateId },
      select: { id: true, status: true },
    });

    if (!debate) {
      throw new DebateError("DEBATE_NOT_FOUND", "Không tìm thấy phiên tranh luận này", 404);
    }

    if (debate.status !== DebateStatus.OPEN) {
      throw new DebateError("DEBATE_CLOSED", "Phiên tranh luận này đã đóng", 400);
    }

    // 2. Create the argument record
    const argument = await prisma.debateArgument.create({
      data: {
        debateId,
        userId,
        stance: input.stance,
        argumentText: input.content,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 3. Log activity
    try {
      await ActivityLogService.logActivity(userId, ActivityType.POST_ARGUMENT, "DEBATE", debateId, {
        stance: input.stance,
        argumentId: argument.id,
      });
    } catch (error) {
      console.error("❌ Failed to log activity for posting argument:", error);
    }

    // 4. Invalidate cache
    await invalidateCachePattern("cache:api:/api/v1/debates*");

    return argument;
  }

  /**
   * Vote on an argument (UP or DOWN) with unique constraint
   */
  async voteArgument(argumentId: string, userId: string, value: VoteValue) {
    // 1. Check if argument exists
    const argument = await prisma.debateArgument.findUnique({
      where: { id: argumentId },
      select: { id: true, debateId: true },
    });

    if (!argument) {
      throw new DebateError("ARGUMENT_NOT_FOUND", "Không tìm thấy lập luận này", 404);
    }

    // 2. Upsert the vote (ensures unique vote per user per argument)
    await prisma.debateVote.upsert({
      where: {
        argumentId_userId: {
          argumentId,
          userId,
        },
      },
      create: {
        argumentId,
        userId,
        value,
      },
      update: {
        value,
      },
    });

    // 3. Recalculate voteCount (Score = UP_votes - DOWN_votes)
    const [upVotes, downVotes] = await Promise.all([
      prisma.debateVote.count({ where: { argumentId, value: VoteValue.UP } }),
      prisma.debateVote.count({ where: { argumentId, value: VoteValue.DOWN } }),
    ]);

    const voteCount = upVotes - downVotes;

    // Update the argument's vote count score
    await prisma.debateArgument.update({
      where: { id: argumentId },
      data: { voteCount },
    });

    // 4. Log activity
    try {
      await ActivityLogService.logActivity(userId, "VOTE_ARGUMENT", "ARGUMENT", argumentId, {
        value,
      });
    } catch (error) {
      console.error("❌ Failed to log activity for voting argument:", error);
    }

    // 5. Invalidate cache
    await invalidateCachePattern("cache:api:/api/v1/debates*");

    return {
      argumentId,
      voteCount,
      userVote: value,
    };
  }

  /**
   * Add a comment to an argument
   */
  async createComment(argumentId: string, userId: string, commentText: string) {
    // 1. Check if argument exists
    const argument = await prisma.debateArgument.findUnique({
      where: { id: argumentId },
      select: { id: true },
    });

    if (!argument) {
      throw new DebateError("ARGUMENT_NOT_FOUND", "Không tìm thấy lập luận này", 404);
    }

    // 2. Create the comment record
    const comment = await prisma.debateComment.create({
      data: {
        argumentId,
        userId,
        commentText,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 3. Log activity
    try {
      await ActivityLogService.logActivity(userId, "COMMENT_ARGUMENT", "ARGUMENT", argumentId, {
        commentId: comment.id,
      });
    } catch (error) {
      console.error("❌ Failed to log activity for adding comment:", error);
    }

    // 4. Invalidate cache
    await invalidateCachePattern("cache:api:/api/v1/debates*");

    return comment;
  }
}

export const debateService = new DebateService();
