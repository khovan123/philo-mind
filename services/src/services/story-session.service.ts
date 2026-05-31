
import type { TargetType } from "../prisma/generated/enums.js";
import { prisma } from "../config/prisma.js";
import { ActivityLogService, ActivityType } from "./activity-log.service.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";

// ── T-D03: StorySession Service ───────────────────────────────

export class StorySessionError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "StorySessionError";
  }
}

export class StorySessionService {
  /**
   * Start a new session or resume an existing active (IN_PROGRESS) session
   */
  async startSession(userId: string, storyId: string) {
    // 1. Verify story scenario exists
    const story = await prisma.storyScenario.findUnique({
      where: { id: storyId },
      select: { id: true },
    });
    if (!story) {
      throw new StorySessionError("STORY_NOT_FOUND", "Không tìm thấy story scenario", 404);
    }

    // 2. Check for an active session (IN_PROGRESS) for this user and story
    let session = await prisma.storySession.findFirst({
      where: {
        userId,
        storyId,
        status: "IN_PROGRESS",
      },
      include: {
        decisions: {
          include: {
            choice: {
              include: {
                consequences: {
                  include: {
                    analysisTabs: {
                      orderBy: { order: "asc" },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // 3. Create a new session if none exists
    if (!session) {
      session = await prisma.storySession.create({
        data: {
          userId,
          storyId,
          status: "IN_PROGRESS",
        },
        include: {
          decisions: {
            include: {
              choice: {
                include: {
                  consequences: {
                    include: {
                      analysisTabs: {
                        orderBy: { order: "asc" },
                      },
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // Invalidate caching for stories and stats due to new play session
      await invalidateCachePattern("cache:api:/api/v1/stories*");
      await invalidateCachePattern("cache:api:/api/v1/stats*");
    }

    return session;
  }

  /**
   * Record a decision choice during an active story session
   */
  async makeDecision(userId: string, sessionId: string, choiceId: string, userReason?: string) {
    // 1. Verify active session exists and belongs to the user
    const session = await prisma.storySession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new StorySessionError("SESSION_NOT_FOUND", "Không tìm thấy session", 404);
    }
    if (session.userId !== userId) {
      throw new StorySessionError(
        "SESSION_FORBIDDEN",
        "Bạn không có quyền thao tác trên session này",
        403,
      );
    }
    if (session.status !== "IN_PROGRESS") {
      throw new StorySessionError("SESSION_NOT_ACTIVE", "Session này đã kết thúc", 400);
    }

    // 2. Verify choice exists and belongs to the correct story
    const choice = await prisma.storyChoice.findUnique({
      where: { id: choiceId },
    });
    if (!choice) {
      throw new StorySessionError("CHOICE_NOT_FOUND", "Lựa chọn không tồn tại", 404);
    }
    if (choice.storyId !== session.storyId) {
      throw new StorySessionError(
        "CHOICE_STORY_MISMATCH",
        "Lựa chọn không thuộc câu chuyện này",
        400,
      );
    }

    // 3. Idempotent check: if decision already made for this session/choice, return it
    const existingDecision = await prisma.storyDecision.findFirst({
      where: { sessionId, choiceId },
      include: {
        choice: {
          include: {
            consequences: {
              include: {
                analysisTabs: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });
    if (existingDecision) {
      return existingDecision;
    }

    // 4. Create decision
    const decision = await prisma.storyDecision.create({
      data: {
        sessionId,
        userId,
        choiceId,
        userReason: userReason || null,
      },
      include: {
        choice: {
          include: {
            consequences: {
              include: {
                analysisTabs: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    // 5. Log activity (triggers badge evaluation)
    try {
      await ActivityLogService.logActivity(
        userId,
        ActivityType.DECIDE_STORY,
        "STORY" as TargetType,
        session.storyId,
        { choiceId, sessionId },
      );
    } catch (error) {
      console.error("❌ Failed to log activity for story decision:", error);
    }

    // 6. Invalidate caching
    await invalidateCachePattern("cache:api:/api/v1/stories*");
    await invalidateCachePattern("cache:api:/api/v1/stats*");

    return decision;
  }

  /**
   * Complete an active story session
   */
  async completeSession(userId: string, sessionId: string) {
    // 1. Verify active session exists and belongs to the user
    const session = await prisma.storySession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new StorySessionError("SESSION_NOT_FOUND", "Không tìm thấy session", 404);
    }
    if (session.userId !== userId) {
      throw new StorySessionError(
        "SESSION_FORBIDDEN",
        "Bạn không có quyền thao tác trên session này",
        403,
      );
    }
    if (session.status !== "IN_PROGRESS") {
      throw new StorySessionError("SESSION_NOT_ACTIVE", "Session này đã kết thúc", 400);
    }

    // 2. Mark session as completed
    const updatedSession = await prisma.storySession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // 3. Invalidate caching
    await invalidateCachePattern("cache:api:/api/v1/stories*");
    await invalidateCachePattern("cache:api:/api/v1/stats*");

    return updatedSession;
  }
}

export const storySessionService = new StorySessionService();
