import type { Request, Response, NextFunction } from "express";
import { ActivityLogService } from "../services/activity-log.service.js";
import type { TargetType } from "../prisma/generated/enums.js";
import {
  sendSuccess,
  sendPaginated,
  buildPaginationMeta,
  parsePagination,
} from "../utils/response.js";

export class ActivityLogController {
  /**
   * Log an activity manually from the client or API.
   */
  async logActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { activityType, targetType, targetId, metadata } = req.body;

      const result = await ActivityLogService.logActivity(
        userId,
        activityType,
        targetType as TargetType,
        targetId,
        metadata,
      );

      return sendSuccess(res, result, 201);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Get the authenticated user's activity history.
   */
  async getActivityHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page, limit } = parsePagination(req.query);

      const result = await ActivityLogService.getActivityHistory(userId, page, limit);

      const meta = buildPaginationMeta(result.pagination.total, page, limit);
      return sendPaginated(res, result.logs, meta, 200);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Get the authenticated user's daily consecutive streak and longest streak details.
   */
  async getStreakDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const streakDetails = await ActivityLogService.getStreakDetails(userId);
      return sendSuccess(res, streakDetails, 200);
    } catch (err) {
      return next(err);
    }
  }
}

export const activityLogController = new ActivityLogController();
