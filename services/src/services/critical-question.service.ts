import type { Prisma, QuestionType } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type {
  AdminListCriticalQuestionsQuery,
  CreateCriticalQuestionInput,
  ListCriticalQuestionsQuery,
  RandomCriticalQuestionQuery,
  UpdateCriticalQuestionInput,
} from "../validators/critical-question.validator.js";

// ── T-A12: Critical Question Service ───────────────────────────

type DateProvider = () => Date;

const questionInclude = {
  topic: {
    select: {
      id: true,
      title: true,
      category: true,
    },
  },
} satisfies Prisma.CriticalQuestionInclude;

export class CriticalQuestionService {
  constructor(private readonly dateProvider: DateProvider = () => new Date()) {}

  async list(query: ListCriticalQuestionsQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = this.buildWhere(query);

    const [questions, total] = await Promise.all([
      prisma.criticalQuestion.findMany({
        where,
        include: questionInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.criticalQuestion.count({ where }),
    ]);

    return {
      questions,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async adminList(query: AdminListCriticalQuestionsQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = this.buildWhere(query);
    const orderBy = { [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc" } as Prisma.CriticalQuestionOrderByWithRelationInput;

    const [questions, total] = await Promise.all([
      prisma.criticalQuestion.findMany({
        where,
        include: questionInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.criticalQuestion.count({ where }),
    ]);

    return {
      questions,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getById(questionId: string) {
    const question = await prisma.criticalQuestion.findUnique({
      where: { id: questionId },
      include: questionInclude,
    });

    if (!question) {
      throw new CriticalQuestionError("CRITICAL_QUESTION_NOT_FOUND", "Không tìm thấy critical question", 404);
    }

    return question;
  }

  async getRandom(query: RandomCriticalQuestionQuery) {
    const where = this.buildWhere(query);
    const total = await prisma.criticalQuestion.count({ where });

    if (total === 0) {
      throw new CriticalQuestionError("CRITICAL_QUESTION_NOT_FOUND", "Không tìm thấy critical question", 404);
    }

    const skip = Math.floor(Math.random() * total);
    return this.findQuestionAtOffset(where, skip);
  }

  async getDailyRandom(query: RandomCriticalQuestionQuery) {
    const where = this.buildWhere(query);
    const total = await prisma.criticalQuestion.count({ where });

    if (total === 0) {
      throw new CriticalQuestionError("CRITICAL_QUESTION_NOT_FOUND", "Không tìm thấy critical question", 404);
    }

    const date = this.getTodayKey();
    const seed = `${date}|${query.topicId ?? "all"}|${query.questionType ?? "all"}`;
    const skip = this.stableIndex(seed, total);
    const question = await this.findQuestionAtOffset(where, skip);

    return { date, question };
  }

  async create(input: CreateCriticalQuestionInput) {
    await this.ensureTopicExists(input.topicId);

    return prisma.criticalQuestion.create({
      data: {
        topicId: input.topicId,
        question: input.question,
        questionType: input.questionType,
      },
      include: questionInclude,
    });
  }

  async update(questionId: string, input: UpdateCriticalQuestionInput) {
    await this.ensureQuestionExists(questionId);

    if (input.topicId !== undefined) {
      await this.ensureTopicExists(input.topicId);
    }

    return prisma.criticalQuestion.update({
      where: { id: questionId },
      data: {
        ...(input.topicId !== undefined ? { topicId: input.topicId } : {}),
        ...(input.question !== undefined ? { question: input.question } : {}),
        ...(input.questionType !== undefined ? { questionType: input.questionType } : {}),
      },
      include: questionInclude,
    });
  }

  async delete(questionId: string) {
    const result = await prisma.criticalQuestion.deleteMany({
      where: { id: questionId },
    });

    if (result.count === 0) {
      throw new CriticalQuestionError("CRITICAL_QUESTION_NOT_FOUND", "Không tìm thấy critical question", 404);
    }
  }

  private buildWhere(query: RandomCriticalQuestionQuery): Prisma.CriticalQuestionWhereInput {
    return {
      ...(query.topicId ? { topicId: query.topicId } : {}),
      ...(query.questionType ? { questionType: query.questionType as QuestionType } : {}),
    };
  }

  private async ensureTopicExists(topicId: string) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });

    if (!topic) {
      throw new CriticalQuestionError("TOPIC_NOT_FOUND", "Không tìm thấy topic", 404);
    }
  }

  private async ensureQuestionExists(questionId: string) {
    const question = await prisma.criticalQuestion.findUnique({
      where: { id: questionId },
      select: { id: true },
    });

    if (!question) {
      throw new CriticalQuestionError("CRITICAL_QUESTION_NOT_FOUND", "Không tìm thấy critical question", 404);
    }
  }

  private async findQuestionAtOffset(where: Prisma.CriticalQuestionWhereInput, skip: number) {
    const question = await prisma.criticalQuestion.findFirst({
      where,
      include: questionInclude,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip,
    });

    if (!question) {
      throw new CriticalQuestionError("CRITICAL_QUESTION_NOT_FOUND", "Không tìm thấy critical question", 404);
    }

    return question;
  }

  private getTodayKey(): string {
    return this.dateProvider().toISOString().slice(0, 10);
  }

  private stableIndex(seed: string, total: number): number {
    let hash = 0;
    for (const char of seed) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    return hash % total;
  }
}

export class CriticalQuestionError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "CriticalQuestionError";
  }
}

export const criticalQuestionService = new CriticalQuestionService();
