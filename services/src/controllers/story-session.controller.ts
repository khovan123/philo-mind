import type { Request, Response, NextFunction } from "express";
import { storySessionService, StorySessionError } from "../services/story-session.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── T-D03: StorySession Controller ───────────────────────────

export class StorySessionController {
  /**
   * Start or resume a story session
   */
  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const { storyId } = req.params;
      const userId = req.user!.id;

      const session = await storySessionService.startSession(userId, String(storyId));
      return sendSuccess(res, session, 201);
    } catch (err: unknown) {
      if (err instanceof StorySessionError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Submit a decision choice in a story session
   */
  async decide(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.id;
      const { choiceId, userReason } = req.body;

      const decision = await storySessionService.makeDecision(
        userId,
        String(sessionId),
        String(choiceId),
        userReason,
      );
      return sendSuccess(res, decision, 201);
    } catch (err: unknown) {
      if (err instanceof StorySessionError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Complete a story session
   */
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.id;

      const session = await storySessionService.completeSession(userId, String(sessionId));
      return sendSuccess(res, session, 200);
    } catch (err: unknown) {
      if (err instanceof StorySessionError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const storySessionController = new StorySessionController();
