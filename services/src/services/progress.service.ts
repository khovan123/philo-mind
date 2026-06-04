import type { Prisma, ProgressStatus } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type { ListProgressQuery, UpsertProgressInput } from "../validators/progress.validator.js";

// ── T-A09: User Progress Service ────────────────────────────

const progressInclude = {
  lesson: {
    select: {
      id: true,
      title: true,
      topicId: true,
      estimatedMinutes: true,
      topic: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
    },
  },
} satisfies Prisma.UserProgressInclude;

export class ProgressService {
  /**
   * Upsert user progress for a specific lesson.
   * Auto-sets completedAt when status is COMPLETED or progressPercent reaches 100.
   */
  async upsert(userId: string, lessonId: string, input: UpsertProgressInput) {
    await this.ensureLessonExists(lessonId);

    // Determine auto-complete logic
    let status: ProgressStatus | undefined = input.status as ProgressStatus | undefined;
    let completedAt: Date | null | undefined = undefined;

    if (input.progressPercent === 100 && !status) {
      status = "COMPLETED";
    }

    if (status === "COMPLETED") {
      completedAt = new Date();
    } else if (status) {
      completedAt = null;
    }

    const data: Prisma.UserProgressUncheckedUpdateInput = {
      ...(status !== undefined ? { status } : {}),
      ...(input.progressPercent !== undefined ? { progressPercent: input.progressPercent } : {}),
      ...(completedAt !== undefined ? { completedAt } : {}),
    };

    return prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      create: {
        userId,
        lessonId,
        status: status ?? "IN_PROGRESS",
        progressPercent: input.progressPercent ?? 0,
        completedAt: completedAt ?? null,
      },
      update: data,
      include: progressInclude,
    });
  }

  /**
   * Get progress for a specific lesson.
   */
  async getByLesson(userId: string, lessonId: string) {
    await this.ensureLessonExists(lessonId);

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      include: progressInclude,
    });

    // Return default when no progress record exists
    if (!progress) {
      return {
        userId,
        lessonId,
        status: "NOT_STARTED" as ProgressStatus,
        progressPercent: 0,
        completedAt: null,
      };
    }

    return progress;
  }

  /**
   * List all progress for a user with optional filters.
   */
  async list(userId: string, query: ListProgressQuery) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.UserProgressWhereInput = {
      userId,
      ...(query.status ? { status: query.status as ProgressStatus } : {}),
      ...(query.topicId ? { lesson: { topicId: query.topicId } } : {}),
    };

    const [records, total] = await Promise.all([
      prisma.userProgress.findMany({
        where,
        include: progressInclude,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.userProgress.count({ where }),
    ]);

    return {
      records,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  /**
   * Get aggregated stats for a given topic.
   */
  async statsByTopic(userId: string, topicId: string) {
    await this.ensureTopicExists(topicId);

    const lessons = await prisma.lesson.findMany({
      where: { topicId },
      select: { id: true },
    });

    if (lessons.length === 0) {
      return {
        topicId,
        totalLessons: 0,
        completedLessons: 0,
        inProgressLessons: 0,
        notStartedLessons: 0,
        averageProgress: 0,
      };
    }

    const lessonIds = lessons.map((l) => l.id);

    const progressRecords = await prisma.userProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
      select: {
        status: true,
        progressPercent: true,
      },
    });

    const completedLessons = progressRecords.filter((p) => p.status === "COMPLETED").length;
    const inProgressLessons = progressRecords.filter((p) => p.status === "IN_PROGRESS").length;
    const notStartedLessons = lessons.length - progressRecords.length;

    const totalPercent = progressRecords.reduce((sum, p) => sum + p.progressPercent, 0);
    const averageProgress = lessons.length > 0 ? Math.round(totalPercent / lessons.length) : 0;

    return {
      topicId,
      totalLessons: lessons.length,
      completedLessons,
      inProgressLessons,
      notStartedLessons,
      averageProgress,
    };
  }

  private async ensureLessonExists(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lesson) {
      throw new ProgressError("LESSON_NOT_FOUND", "Không tìm thấy bài học", 404);
    }
  }

  private async ensureTopicExists(topicId: string) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });

    if (!topic) {
      throw new ProgressError("TOPIC_NOT_FOUND", "Không tìm thấy topic", 404);
    }
  }
}

export class ProgressError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ProgressError";
  }
}

export const progressService = new ProgressService();
