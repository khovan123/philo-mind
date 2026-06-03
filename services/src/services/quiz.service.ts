import type { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type { ListQuizzesQuery, SubmitAnswerInput } from "../validators/quiz.validator.js";

// ── T-A10: Quiz Service ─────────────────────────────────────

const quizInclude = {
  lesson: {
    select: {
      id: true,
      title: true,
      topicId: true,
    },
  },
  questions: {
    include: {
      options: {
        select: {
          id: true,
          optionText: true,
          // isCorrect intentionally excluded for user-facing queries
        },
      },
    },
  },
  _count: {
    select: { attempts: true },
  },
} satisfies Prisma.QuizInclude;

const attemptInclude = {
  quiz: {
    select: { id: true, title: true, lessonId: true },
  },
  answers: {
    include: {
      question: {
        select: { id: true, question: true, questionType: true },
      },
      selectedOption: {
        select: { id: true, optionText: true },
      },
    },
  },
} satisfies Prisma.QuizAttemptInclude;

export class QuizService {
  /**
   * List quizzes with optional lessonId filter.
   */
  async list(query: ListQuizzesQuery) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.QuizWhereInput = {
      ...(query.lessonId ? { lessonId: query.lessonId } : {}),
    };

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: quizInclude,
        orderBy: { title: "asc" },
        skip,
        take: limit,
      }),
      prisma.quiz.count({ where }),
    ]);

    return {
      quizzes,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  /**
   * Get a single quiz with its questions (options without isCorrect).
   */
  async getById(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: quizInclude,
    });

    if (!quiz) {
      throw new QuizError("QUIZ_NOT_FOUND", "Không tìm thấy bài trắc nghiệm", 404);
    }

    return quiz;
  }

  /**
   * Start a new quiz attempt.
   */
  async startAttempt(quizId: string, userId: string) {
    await this.ensureQuizExists(quizId);

    // Check if user already has an incomplete attempt for this quiz
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId,
        userId,
        completedAt: null,
      },
      include: attemptInclude,
    });

    if (existingAttempt) {
      return existingAttempt;
    }

    return prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score: 0,
      },
      include: attemptInclude,
    });
  }

  /**
   * Submit an answer for a quiz attempt.
   */
  async submitAnswer(attemptId: string, userId: string, input: SubmitAnswerInput) {
    const attempt = await this.ensureOwnAttempt(attemptId, userId);

    if (attempt.completedAt) {
      throw new QuizError("ATTEMPT_ALREADY_COMPLETED", "Bài trắc nghiệm này đã hoàn thành", 400);
    }

    // Ensure question belongs to the quiz
    const question = await prisma.quizQuestion.findFirst({
      where: {
        id: input.questionId,
        quizId: attempt.quizId,
      },
      include: {
        options: true,
      },
    });

    if (!question) {
      throw new QuizError("QUESTION_NOT_FOUND", "Câu hỏi không thuộc bài trắc nghiệm này", 404);
    }

    // Determine correctness
    let isCorrect = false;
    if (input.selectedOptionId) {
      const selectedOption = question.options.find((o) => o.id === input.selectedOptionId);
      if (!selectedOption) {
        throw new QuizError("OPTION_NOT_FOUND", "Đáp án không hợp lệ", 404);
      }
      isCorrect = selectedOption.isCorrect;
    }

    // Upsert the answer (allow re-answering before completion)
    const existingAnswer = await prisma.quizAttemptAnswer.findFirst({
      where: {
        attemptId,
        questionId: input.questionId,
      },
    });

    if (existingAnswer) {
      return prisma.quizAttemptAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedOptionId: input.selectedOptionId ?? null,
          textAnswer: input.textAnswer ?? null,
          isCorrect,
        },
      });
    }

    return prisma.quizAttemptAnswer.create({
      data: {
        attemptId,
        questionId: input.questionId,
        selectedOptionId: input.selectedOptionId ?? null,
        textAnswer: input.textAnswer ?? null,
        isCorrect,
      },
    });
  }

  /**
   * Complete an attempt and calculate the final score.
   */
  async completeAttempt(attemptId: string, userId: string) {
    const attempt = await this.ensureOwnAttempt(attemptId, userId);

    if (attempt.completedAt) {
      throw new QuizError("ATTEMPT_ALREADY_COMPLETED", "Bài trắc nghiệm này đã hoàn thành", 400);
    }

    // Calculate score based on correct answers
    const answers = await prisma.quizAttemptAnswer.findMany({
      where: { attemptId },
    });

    const totalQuestions = await prisma.quizQuestion.count({
      where: { quizId: attempt.quizId },
    });

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        completedAt: new Date(),
      },
      include: attemptInclude,
    });
  }

  /**
   * Get a specific attempt with answers.
   */
  async getAttempt(attemptId: string, userId: string) {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        ...attemptInclude,
        answers: {
          include: {
            question: {
              include: {
                options: true, // Include isCorrect only for completed attempts
              },
            },
            selectedOption: {
              select: { id: true, optionText: true },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new QuizError("ATTEMPT_NOT_FOUND", "Không tìm thấy lần thi", 404);
    }

    if (attempt.userId !== userId) {
      throw new QuizError("FORBIDDEN", "Bạn không có quyền xem lần thi này", 403);
    }

    // Strip isCorrect from options if attempt is not completed
    if (!attempt.completedAt) {
      return {
        ...attempt,
        answers: attempt.answers.map((a) => ({
          ...a,
          question: {
            ...a.question,
            options: a.question.options.map(({ isCorrect: _isCorrect, ...opt }) => opt),
          },
        })),
      };
    }

    return attempt;
  }

  private async ensureQuizExists(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true },
    });

    if (!quiz) {
      throw new QuizError("QUIZ_NOT_FOUND", "Không tìm thấy bài trắc nghiệm", 404);
    }
  }

  private async ensureOwnAttempt(attemptId: string, userId: string) {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new QuizError("ATTEMPT_NOT_FOUND", "Không tìm thấy lần thi", 404);
    }

    if (attempt.userId !== userId) {
      throw new QuizError("FORBIDDEN", "Bạn không có quyền thao tác lần thi này", 403);
    }

    return attempt;
  }
}

export class QuizError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "QuizError";
  }
}

export const quizService = new QuizService();
