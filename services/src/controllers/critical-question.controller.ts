import type { Request, Response, NextFunction } from "express";
import { criticalQuestionService, CriticalQuestionError } from "../services/critical-question.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";

// ── T-A12: Critical Question Controller ────────────────────────

function getId(req: Request): string {
  return String(req.params.id);
}

export class CriticalQuestionController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await criticalQuestionService.list(req.query);
      return sendPaginated(res, result.questions, result.meta, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await criticalQuestionService.adminList(req.query);
      return sendPaginated(res, result.questions, result.meta, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await criticalQuestionService.getById(getId(req));
      return sendSuccess(res, question, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getRandom(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await criticalQuestionService.getRandom(req.query);
      return sendSuccess(res, question, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getDailyRandom(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await criticalQuestionService.getDailyRandom(req.query);
      return sendSuccess(res, result, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await criticalQuestionService.create(req.body);
      return sendSuccess(res, question, 201);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await criticalQuestionService.update(getId(req), req.body);
      return sendSuccess(res, question, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await criticalQuestionService.delete(getId(req));
      return sendSuccess(res, { message: "Đã xóa critical question thành công" }, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  private handleError(err: unknown, res: Response, next: NextFunction) {
    if (err instanceof CriticalQuestionError) {
      return sendError(res, err.code, err.message, err.statusCode);
    }
    return next(err);
  }
}

export const criticalQuestionController = new CriticalQuestionController();
