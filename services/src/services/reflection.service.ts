import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type {
  CreateReflectionInput,
  ListReflectionsQuery,
  UpdateReflectionInput,
} from "../validators/reflection.validator.js";

// ── T-A11: Reflection Service ──────────────────────────────────

const reflectionInclude = {
  topic: {
    select: {
      id: true,
      title: true,
      category: true,
    },
  },
  question: {
    select: {
      id: true,
      topicId: true,
      question: true,
      questionType: true,
    },
  },
};

export class ReflectionService {
  async listForUser(userId: string, query: ListReflectionsQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = {
      userId,
      ...(query.topicId ? { topicId: query.topicId } : {}),
      ...(query.questionId ? { questionId: query.questionId } : {}),
    };

    const [reflections, total] = await Promise.all([
      prisma.reflectionEntry.findMany({
        where,
        include: reflectionInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.reflectionEntry.count({ where }),
    ]);

    return {
      reflections,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getForUser(userId: string, reflectionId: string) {
    const reflection = await prisma.reflectionEntry.findFirst({
      where: { id: reflectionId, userId },
      include: reflectionInclude,
    });

    if (!reflection) {
      throw new ReflectionError("REFLECTION_NOT_FOUND", "Không tìm thấy reflection", 404);
    }

    return reflection;
  }

  async createForUser(userId: string, input: CreateReflectionInput) {
    await this.validateLinks(input.topicId, input.questionId);

    return prisma.reflectionEntry.create({
      data: {
        userId,
        content: input.content,
        topicId: input.topicId ?? null,
        questionId: input.questionId ?? null,
      },
      include: reflectionInclude,
    });
  }

  async updateForUser(userId: string, reflectionId: string, input: UpdateReflectionInput) {
    await this.validateLinks(input.topicId, input.questionId);

    const result = await prisma.reflectionEntry.updateMany({
      where: { id: reflectionId, userId },
      data: {
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.topicId !== undefined ? { topicId: input.topicId } : {}),
        ...(input.questionId !== undefined ? { questionId: input.questionId } : {}),
      },
    });

    if (result.count === 0) {
      throw new ReflectionError("REFLECTION_NOT_FOUND", "Không tìm thấy reflection", 404);
    }

    return this.getForUser(userId, reflectionId);
  }

  async deleteForUser(userId: string, reflectionId: string) {
    const result = await prisma.reflectionEntry.deleteMany({
      where: { id: reflectionId, userId },
    });

    if (result.count === 0) {
      throw new ReflectionError("REFLECTION_NOT_FOUND", "Không tìm thấy reflection", 404);
    }
  }

  private async validateLinks(topicId?: string | null, questionId?: string | null) {
    if (topicId) {
      const topic = await prisma.topic.findUnique({ where: { id: topicId }, select: { id: true } });
      if (!topic) {
        throw new ReflectionError("TOPIC_NOT_FOUND", "Không tìm thấy topic", 404);
      }
    }

    if (questionId) {
      const question = await prisma.criticalQuestion.findUnique({
        where: { id: questionId },
        select: { id: true, topicId: true },
      });

      if (!question) {
        throw new ReflectionError(
          "CRITICAL_QUESTION_NOT_FOUND",
          "Không tìm thấy critical question",
          404,
        );
      }

      if (topicId && question.topicId !== topicId) {
        throw new ReflectionError(
          "REFLECTION_LINK_MISMATCH",
          "Critical question không thuộc topic đã chọn",
          400,
        );
      }
    }
  }
}

export class ReflectionError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ReflectionError";
  }
}

export const reflectionService = new ReflectionService();
