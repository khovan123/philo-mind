import type { Request, Response, NextFunction } from "express";
import { BadgeService } from "../services/badge.service.js";
import { sendSuccess } from "../utils/response.js";

export class BadgeController {
  /**
   * Retrieve all badges with current progress metrics and earning status for the authenticated user.
   */
  async getAllBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const badges = await BadgeService.getAllBadgesForUser(userId);
      return sendSuccess(res, badges, 200);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Retrieve only the badges earned by the authenticated user.
   */
  async getEarnedBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const earnedBadges = await BadgeService.getEarnedBadges(userId);
      return sendSuccess(res, earnedBadges, 200);
    } catch (err) {
      return next(err);
    }
  }
}

export const badgeController = new BadgeController();
