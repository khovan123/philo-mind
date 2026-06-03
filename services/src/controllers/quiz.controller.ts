import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ActivityLogService, ActivityType } from "../services/activity-log.service.js";
import { buildPaginationMeta, sendError, sendPaginated, sendSuccess } from "../utils/response.js";
import { TargetType } from "../prisma/generated/client.js";

const quizImage =
  "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=900&q=80";

export class QuizController {
  async list(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search, topicId, status } = req.query as Record<string, string>;
      const parsedPage = Math.max(1, Number(page));
      const parsedLimit = Math.min(100, Math.max(1, Number(limit)));
      const skip = (parsedPage - 1) * parsedLimit;
      const userId = req.user?.id;

      const where: any = {};
      if (topicId) where.lesson = { topicId };
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { lesson: { title: { contains: search, mode: "insensitive" } } },
          { lesson: { topic: { title: { contains: search, mode: "insensitive" } } } },
          { lesson: { topic: { category: { contains: search, mode: "insensitive" } } } },
        ];
      }

      const total = await prisma.quiz.count({ where });
      const quizzes = await prisma.quiz.findMany({
        where,
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              conflict: true,
              estimatedMinutes: true,
              topic: { select: { id: true, title: true, category: true, difficulty: true } },
            },
          },
          questions: { select: { id: true } },
          attempts: userId
            ? {
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 1,
                include: { answers: { select: { id: true } } },
              }
            : false,
        },
        orderBy: { title: "asc" },
        skip,
        take: parsedLimit,
      });

      const data = quizzes
        .map((quiz) => this.toSummary(quiz))
        .filter((quiz) => !status || quiz.status === status);

      return sendPaginated(res, data, buildPaginationMeta(total, parsedPage, parsedLimit));
    } catch (err) {
      const error = err as Error;
      return sendError(res, "QUIZ_LIST_ERROR", error.message, 500);
    }
  }

  async getByLesson(req: Request, res: Response) {
    try {
      const lessonId = req.params.lessonId as string;
      const quiz = await prisma.quiz.findFirst({
        where: { lessonId },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              estimatedMinutes: true,
              topic: { select: { title: true, category: true, difficulty: true } },
            },
          },
          questions: {
            include: { options: true },
            orderBy: { id: "asc" },
          },
        },
      });

      if (!quiz) return sendError(res, "QUIZ_NOT_FOUND", "Quiz khong ton tai", 404);

      return sendSuccess(res, this.toDetail(quiz));
    } catch (err) {
      const error = err as Error;
      return sendError(res, "QUIZ_DETAIL_ERROR", error.message, 500);
    }
  }

  async startAttempt(req: Request, res: Response) {
    try {
      const quizId = req.params.quizId as string;
      const userId = req.user!.id;
      const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } });

      if (!quiz) return sendError(res, "QUIZ_NOT_FOUND", "Quiz khong ton tai", 404);

      const attempt = await prisma.quizAttempt.create({
        data: { quizId, userId, score: 0 },
      });

      return sendSuccess(res, {
        attemptId: attempt.id,
        quizId,
        totalQuestions: quiz.questions.length,
        startedAt: attempt.createdAt,
      }, 201);
    } catch (err) {
      const error = err as Error;
      return sendError(res, "QUIZ_ATTEMPT_START_ERROR", error.message, 500);
    }
  }

  async submitAnswer(req: Request, res: Response) {
    try {
      const attemptId = req.params.attemptId as string;
      const userId = req.user!.id;
      const { questionId, selectedOptionId, textAnswer } = req.body;

      const attempt = await prisma.quizAttempt.findFirst({
        where: { id: attemptId, userId },
      });
      if (!attempt) return sendError(res, "ATTEMPT_NOT_FOUND", "Lan lam quiz khong ton tai", 404);
      if (attempt.completedAt) return sendError(res, "ATTEMPT_COMPLETED", "Quiz da hoan thanh", 409);

      const question = await prisma.quizQuestion.findUnique({
        where: { id: questionId },
        include: { options: true },
      });
      if (!question || question.quizId !== attempt.quizId) {
        return sendError(res, "QUESTION_NOT_FOUND", "Cau hoi khong ton tai", 404);
      }

      const correctOption = question.options.find((option) => option.isCorrect) ?? null;
      const isCorrect = Boolean(selectedOptionId && selectedOptionId === correctOption?.id);
      const existing = await prisma.quizAttemptAnswer.findFirst({
        where: { attemptId, questionId },
      });

      const answer = existing
        ? await prisma.quizAttemptAnswer.update({
            where: { id: existing.id },
            data: { selectedOptionId, textAnswer, isCorrect },
          })
        : await prisma.quizAttemptAnswer.create({
            data: { attemptId, questionId, selectedOptionId, textAnswer, isCorrect },
          });

      return sendSuccess(res, {
        answer,
        isCorrect,
        correctOptionId: correctOption?.id ?? null,
        explanation: this.buildExplanation(question.question, isCorrect),
      });
    } catch (err) {
      const error = err as Error;
      return sendError(res, "QUIZ_ANSWER_ERROR", error.message, 500);
    }
  }

  async completeAttempt(req: Request, res: Response) {
    try {
      const attemptId = req.params.attemptId as string;
      const userId = req.user!.id;
      const attempt = await prisma.quizAttempt.findFirst({
        where: { id: attemptId, userId },
        include: {
          quiz: { include: { questions: true } },
          answers: true,
        },
      });

      if (!attempt) return sendError(res, "ATTEMPT_NOT_FOUND", "Lan lam quiz khong ton tai", 404);

      const totalQuestions = attempt.quiz.questions.length;
      const correctCount = attempt.answers.filter((answer) => answer.isCorrect).length;
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      const completed = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { score, completedAt: new Date() },
      });

      const activityResult = await ActivityLogService.logActivity(
        userId,
        ActivityType.DO_QUIZ,
        TargetType.QUIZ,
        attempt.quizId,
        { score, correctCount, totalQuestions },
      );

      return sendSuccess(res, {
        attempt: completed,
        score,
        accuracy: score,
        correctCount,
        totalQuestions,
        newlyEarnedBadges: activityResult.newlyEarnedBadges,
      });
    } catch (err) {
      const error = err as Error;
      return sendError(res, "QUIZ_COMPLETE_ERROR", error.message, 500);
    }
  }

  private toSummary(quiz: any) {
    const latestAttempt = quiz.attempts?.[0] ?? null;
    const completed = Boolean(latestAttempt?.completedAt);
    const answeredCount = latestAttempt?.answers?.length ?? 0;
    const questionCount = quiz.questions?.length ?? 0;

    return {
      id: quiz.id,
      lessonId: quiz.lessonId,
      title: quiz.title,
      topic: quiz.lesson?.topic?.category ?? quiz.lesson?.topic?.title ?? "Philosophy",
      description: quiz.lesson?.conflict ?? quiz.lesson?.title ?? "Review this lesson.",
      questions: questionCount,
      timeMinutes: Math.max(3, quiz.lesson?.estimatedMinutes ?? questionCount + 2),
      difficulty: String(quiz.lesson?.topic?.difficulty ?? "MEDIUM").toLowerCase(),
      status: completed ? "completed" : latestAttempt ? "in-progress" : "not-started",
      progress: questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0,
      score: completed ? latestAttempt.score : undefined,
      image: quizImage,
    };
  }

  private toDetail(quiz: any) {
    return {
      id: quiz.id,
      lessonId: quiz.lessonId,
      title: quiz.title,
      topic: quiz.lesson?.topic?.category ?? quiz.lesson?.topic?.title ?? "Philosophy",
      difficulty: String(quiz.lesson?.topic?.difficulty ?? "MEDIUM").toLowerCase(),
      durationSeconds: Math.max(180, (quiz.lesson?.estimatedMinutes ?? quiz.questions.length + 2) * 60),
      questions: quiz.questions.map((question: any, index: number) => {
        const correctOption = question.options.find((option: any) => option.isCorrect);
        return {
          id: question.id,
          prompt: question.question,
          context: index === 0 ? quiz.lesson?.title : undefined,
          options: question.options.map((option: any, optionIndex: number) => ({
            id: option.id,
            label: String.fromCharCode(65 + optionIndex),
            text: option.optionText,
          })),
          correctOptionId: correctOption?.id ?? "",
          explanation: this.buildExplanation(question.question, true),
          concept: quiz.lesson?.topic?.category ?? "Core Concept",
        };
      }),
    };
  }

  private buildExplanation(question: string, correct: boolean) {
    return correct
      ? `Cau tra loi phu hop voi trong tam cua cau hoi: ${question}`
      : `Hay xem lai khai niem trong bai hoc roi thu lai cau hoi: ${question}`;
  }
}

export const quizController = new QuizController();
