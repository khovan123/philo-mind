import type { Request, Response, NextFunction } from "express";
import { consequenceService, ConsequenceError } from "../services/consequence.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── T-D04: Consequence Controller ────────────────────────────

export class ConsequenceController {
  /**
   * Fetch the consequence of a choice by its choiceId
   */
  async getByChoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { choiceId } = req.params;
      const consequence = await consequenceService.getConsequenceByChoice(String(choiceId));
      return sendSuccess(res, consequence, 200);
    } catch (err: unknown) {
      if (err instanceof ConsequenceError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const consequenceController = new ConsequenceController();
