import type { Request, Response, NextFunction } from "express";
import { miniGameService, MiniGameError } from "../services/minigame.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";

// ── T-H03: MiniGame Controller ───────────────────────────────

function getId(req: Request): string {
  return String(req.params.id);
}

function getUserId(req: Request): string {
  return String(req.user?.id);
}

export class MiniGameController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await miniGameService.list(res.locals.query ?? req.query);
      return sendPaginated(res, result.games, result.meta, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const game = await miniGameService.getById(getId(req));
      return sendSuccess(res, game, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const game = await miniGameService.create(req.body);
      return sendSuccess(res, game, 201);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const game = await miniGameService.update(getId(req), req.body);
      return sendSuccess(res, game, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await miniGameService.delete(getId(req));
      return sendSuccess(res, { message: "Đã xóa mini game thành công" }, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async play(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await miniGameService.play(getId(req), getUserId(req), req.body);
      return sendSuccess(res, result, 201);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async leaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await miniGameService.getLeaderboard(getId(req));
      return sendSuccess(res, leaderboard, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  private handleError(err: unknown, res: Response, next: NextFunction) {
    if (err instanceof MiniGameError) {
      return sendError(res, err.code, err.message, err.statusCode);
    }
    return next(err);
  }
}

export const miniGameController = new MiniGameController();
