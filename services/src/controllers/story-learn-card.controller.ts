import type { Request, Response, NextFunction } from "express";
import {
  storyLearnCardService,
  StoryLearnCardError,
} from "../services/story-learn-card.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── T-D01: StoryLearnCard Controller ─────────────────────────

export class StoryLearnCardController {
  async listByStory(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await storyLearnCardService.listByStory(String(req.params.storyId));
      return sendSuccess(res, cards);
    } catch (err) {
      if (err instanceof StoryLearnCardError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await storyLearnCardService.create(String(req.params.storyId), req.body);
      return sendSuccess(res, card, 201);
    } catch (err) {
      if (err instanceof StoryLearnCardError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await storyLearnCardService.update(
        String(req.params.storyId),
        String(req.params.id),
        req.body,
      );
      return sendSuccess(res, card);
    } catch (err) {
      if (err instanceof StoryLearnCardError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await storyLearnCardService.delete(String(req.params.storyId), String(req.params.id));
      return sendSuccess(res, { message: "Đã xóa learn card thành công" });
    } catch (err) {
      if (err instanceof StoryLearnCardError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const storyLearnCardController = new StoryLearnCardController();
