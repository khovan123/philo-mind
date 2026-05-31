import type { Request, Response, NextFunction } from "express";
import { notificationService, NotificationError } from "../services/notification.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";

// ── T-A15: Notification Controller ───────────────────────────

function getNotificationId(req: Request): string {
  return String(req.params.id);
}

export class NotificationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.listForUser(req.user!.id, req.query);
      return sendPaginated(res, result.notifications, result.meta, 200);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.getForUser(
        req.user!.id,
        getNotificationId(req),
      );
      return sendSuccess(res, notification, 200);
    } catch (err) {
      if (err instanceof NotificationError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.getUnreadCount(req.user!.id);
      return sendSuccess(res, result, 200);
    } catch (err) {
      return next(err);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.markAsRead(
        req.user!.id,
        getNotificationId(req),
      );
      return sendSuccess(res, notification, 200);
    } catch (err) {
      if (err instanceof NotificationError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAllAsRead(req.user!.id);
      return sendSuccess(res, result, 200);
    } catch (err) {
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.deleteForUser(req.user!.id, getNotificationId(req));
      return sendSuccess(res, { message: "Đã xóa thông báo thành công" }, 200);
    } catch (err) {
      if (err instanceof NotificationError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.create(req.body);
      return sendSuccess(res, notification, 201);
    } catch (err) {
      if (err instanceof NotificationError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.update(getNotificationId(req), req.body);
      return sendSuccess(res, notification, 200);
    } catch (err) {
      if (err instanceof NotificationError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const notificationController = new NotificationController();
