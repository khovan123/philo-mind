import type { Request, Response, NextFunction } from "express";
import { quizService, QuizError } from "../services/quiz.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";

// ── T-A10: Quiz Controller ──────────────────────────────────

function getUserId(req: Request): string {
  return String(req.user?.id);
}

export class QuizController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await quizService.list(res.locals.query ?? req.query);
      return sendPaginated(res, result.quizzes, result.meta, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await quizService.getById(String(req.params.quizId));
      return sendSuccess(res, quiz, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async startAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const attempt = await quizService.startAttempt(String(req.params.quizId), getUserId(req));
      return sendSuccess(res, attempt, 201);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const answer = await quizService.submitAnswer(
        String(req.params.attemptId),
        getUserId(req),
        req.body,
      );
      return sendSuccess(res, answer, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async completeAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await quizService.completeAttempt(
        String(req.params.attemptId),
        getUserId(req),
      );
      return sendSuccess(res, result, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const attempt = await quizService.getAttempt(String(req.params.attemptId), getUserId(req));
      return sendSuccess(res, attempt, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  private handleError(err: unknown, res: Response, next: NextFunction) {
    if (err instanceof QuizError) {
      return sendError(res, err.code, err.message, err.statusCode);
    }
    return next(err);
  }
}

export const quizController = new QuizController();
