import type { Request, Response, NextFunction } from "express";
import { philosophyTagService, PhilosophyTagError } from "../services/philosophy-tag.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── T-D01: PhilosophyTag Controller ──────────────────────────

export class PhilosophyTagController {
  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await philosophyTagService.listAll();
      return sendSuccess(res, tags);
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await philosophyTagService.create(req.body);
      return sendSuccess(res, tag, 201);
    } catch (err) {
      if (err instanceof PhilosophyTagError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await philosophyTagService.delete(String(req.params.id));
      return sendSuccess(res, { message: "Đã xóa philosophy tag thành công" });
    } catch (err) {
      if (err instanceof PhilosophyTagError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const philosophyTagController = new PhilosophyTagController();
