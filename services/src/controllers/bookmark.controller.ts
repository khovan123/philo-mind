import type { Request, Response, NextFunction } from "express";
import { bookmarkService, BookmarkError } from "../services/bookmark.service.js";
import { sendError, sendPaginated, sendSuccess } from "../utils/response.js";
import type { BookmarkTargetInput, ListBookmarksQuery } from "../validators/bookmark.validator.js";

// ── T-A14: Bookmark Controller ───────────────────────────────

function getBookmarkId(req: Request): string {
  return String(req.params.id);
}

export class BookmarkController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await bookmarkService.listForUser(
        req.user!.id,
        req.query as ListBookmarksQuery,
      );
      return sendPaginated(res, result.bookmarks, result.meta, 200);
    } catch (err) {
      return next(err);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await bookmarkService.getStatus(
        req.user!.id,
        req.query as BookmarkTargetInput,
      );
      return sendSuccess(res, result, 200);
    } catch (err) {
      return next(err);
    }
  }

  async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await bookmarkService.toggle(req.user!.id, req.body);
      return sendSuccess(res, result, 200);
    } catch (err) {
      if (err instanceof BookmarkError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await bookmarkService.deleteForUser(req.user!.id, getBookmarkId(req));
      return sendSuccess(res, { message: "Đã xóa bookmark thành công" }, 200);
    } catch (err) {
      if (err instanceof BookmarkError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const bookmarkController = new BookmarkController();
