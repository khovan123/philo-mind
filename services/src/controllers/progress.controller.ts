import type { Request, Response, NextFunction } from "express";
import { progressService, ProgressError } from "../services/progress.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";

// ── T-A09: User Progress Controller ─────────────────────────

function getUserId(req: Request): string {
  return String(req.user?.id);
}

export class ProgressController {
  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const progress = await progressService.upsert(
        getUserId(req),
        String(req.params.lessonId),
        req.body,
      );
      return sendSuccess(res, progress, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getByLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const progress = await progressService.getByLesson(
        getUserId(req),
        String(req.params.lessonId),
      );
      return sendSuccess(res, progress, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await progressService.list(getUserId(req), res.locals.query ?? req.query);
      return sendPaginated(res, result.records, result.meta, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async statsByTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await progressService.statsByTopic(getUserId(req), String(req.params.topicId));
      return sendSuccess(res, stats, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  private handleError(err: unknown, res: Response, next: NextFunction) {
    if (err instanceof ProgressError) {
      return sendError(res, err.code, err.message, err.statusCode);
    }
    return next(err);
  }
}

export const progressController = new ProgressController();
