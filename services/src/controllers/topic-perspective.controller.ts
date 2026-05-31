import type { Request, Response, NextFunction } from "express";
import {
  topicPerspectiveService,
  TopicPerspectiveError,
} from "../services/topic-perspective.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── T-H01: TopicPerspective Controller ────────────────────────

export class TopicPerspectiveController {
  async listByTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const perspectives = await topicPerspectiveService.listByTopic(String(req.params.topicId));
      return sendSuccess(res, perspectives);
    } catch (err) {
      if (err instanceof TopicPerspectiveError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const perspective = await topicPerspectiveService.create(
        String(req.params.topicId),
        req.body,
      );
      return sendSuccess(res, perspective, 201);
    } catch (err) {
      if (err instanceof TopicPerspectiveError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const perspective = await topicPerspectiveService.update(
        String(req.params.topicId),
        String(req.params.id),
        req.body,
      );
      return sendSuccess(res, perspective);
    } catch (err) {
      if (err instanceof TopicPerspectiveError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await topicPerspectiveService.delete(String(req.params.topicId), String(req.params.id));
      return sendSuccess(res, { message: "Đã xóa góc nhìn (perspective) thành công" });
    } catch (err) {
      if (err instanceof TopicPerspectiveError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const topicPerspectiveController = new TopicPerspectiveController();
