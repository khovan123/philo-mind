import type { Request, Response, NextFunction } from "express";
import { ModerationService } from "../services/moderation.service.js";
import type { TargetType, ReportStatus, ModerationActionType } from "../prisma/generated/enums.js";
import {
  sendSuccess,
  sendPaginated,
  buildPaginationMeta,
  parsePagination,
} from "../utils/response.js";

export class ModerationController {
  /**
   * File a manual report on content.
   */
  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const reporterId = req.user!.id;
      const { targetType, targetId, reason } = req.body;

      if (!targetType || !targetId || !reason) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Thiếu thông tin targetType, targetId hoặc lý do báo cáo.",
          },
        });
      }

      const report = await ModerationService.createReport(
        reporterId,
        targetType as TargetType,
        targetId,
        reason,
      );

      return sendSuccess(res, report, 201);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Admin/Moderator endpoint to fetch reported content.
   */
  async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, targetType } = req.query;
      const { page, limit } = parsePagination(req.query);

      const result = await ModerationService.getReports(
        status as ReportStatus,
        targetType as TargetType,
        page,
        limit,
      );

      const meta = buildPaginationMeta(result.pagination.total, page, limit);
      return sendPaginated(res, result.reports, meta, 200);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Admin/Moderator endpoint to apply action codes to reported content.
   */
  async takeAction(req: Request, res: Response, next: NextFunction) {
    try {
      const moderatorId = req.user!.id;
      const reportId = req.params.reportId as string;
      const { actionType, note } = req.body;

      if (!actionType) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Thiếu actionType để thực hiện hành động kiểm duyệt.",
          },
        });
      }

      const result = await ModerationService.takeAction(
        reportId,
        moderatorId,
        actionType as ModerationActionType,
        note,
      );

      return sendSuccess(res, result, 200);
    } catch (err) {
      return next(err);
    }
  }
}

export const moderationController = new ModerationController();
