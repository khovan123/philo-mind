import type { Request, Response, NextFunction } from "express";
import { reflectionService, ReflectionError } from "../services/reflection.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";

// ── T-A11: Reflection Controller ───────────────────────────────

function getId(req: Request): string {
  return String(req.params.id);
}

export class ReflectionController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await reflectionService.listForUser(req.user!.id, req.query);
      return sendPaginated(res, result.reflections, result.meta, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const reflection = await reflectionService.getForUser(req.user!.id, getId(req));
      return sendSuccess(res, reflection, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const reflection = await reflectionService.createForUser(req.user!.id, req.body);
      return sendSuccess(res, reflection, 201);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const reflection = await reflectionService.updateForUser(req.user!.id, getId(req), req.body);
      return sendSuccess(res, reflection, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await reflectionService.deleteForUser(req.user!.id, getId(req));
      return sendSuccess(res, { message: "Đã xóa reflection thành công" }, 200);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  private handleError(err: unknown, res: Response, next: NextFunction) {
    if (err instanceof ReflectionError) {
      return sendError(res, err.code, err.message, err.statusCode);
    }
    return next(err);
  }
}

export const reflectionController = new ReflectionController();
