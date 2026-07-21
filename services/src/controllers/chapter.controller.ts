import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response.js";
import { ChapterContentService } from "../services/chapter-content.service.js";

export class ChapterController {
  async getChapters(_req: Request, res: Response) {
    try {
      const chapters = await ChapterContentService.getChaptersFromDb();
      return sendSuccess(res, chapters);
    } catch (err) {
      const error = err as Error;
      return sendError(res, "CHAPTER_LIST_ERROR", error.message, 500);
    }
  }

  async getNodes(req: Request, res: Response) {
    try {
      const chapterCode = String(req.params.chapter);
      const data = await ChapterContentService.getNodesFromDb(chapterCode);

      return sendSuccess(res, data);
    } catch (err) {
      const error = err as Error;
      if (error.message === "Không tìm thấy chương") {
        return sendError(res, "CHAPTER_NOT_FOUND", error.message, 404);
      }
      return sendError(res, "CHAPTER_DB_READ_ERROR", error.message, 500);
    }
  }

  async getNodeByMuc(req: Request, res: Response) {
    try {
      const chapterCode = String(req.params.chapter);
      const muc = String(req.params.muc);

      const nodeData = await ChapterContentService.getNodeByMucFromDb(chapterCode, muc);

      return sendSuccess(res, nodeData);
    } catch (err) {
      const error = err as Error;
      if (error.message === "Không tìm thấy chương") {
        return sendError(res, "CHAPTER_NOT_FOUND", error.message, 404);
      }
      if (error.message === "Không tìm thấy node bài học") {
        return sendError(res, "CHAPTER_NODE_NOT_FOUND", error.message, 404);
      }
      return sendError(res, "CHAPTER_DB_READ_ERROR", error.message, 500);
    }
  }

  async getChapterProgress(req: Request, res: Response) {
    try {
      const chapterCode = String(req.params.chapter);
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Vui lòng đăng nhập", 401);
      }

      const progress = await ChapterContentService.getChapterProgress(userId, chapterCode);
      return sendSuccess(res, progress);
    } catch (err) {
      const error = err as Error;
      if (error.message === "Không tìm thấy chương") {
        return sendError(res, "CHAPTER_NOT_FOUND", error.message, 404);
      }
      return sendError(res, "PROGRESS_FETCH_ERROR", error.message, 500);
    }
  }

  async getAllChapterProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Vui lòng đăng nhập", 401);
      }

      const progress = await ChapterContentService.getAllChapterProgress(userId);
      return sendSuccess(res, progress);
    } catch (err) {
      const error = err as Error;
      return sendError(res, "ALL_PROGRESS_FETCH_ERROR", error.message, 500);
    }
  }

  async upsertChapterProgress(req: Request, res: Response) {
    try {
      const chapterCode = String(req.params.chapter);
      const muc = String(req.params.muc);
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Vui lòng đăng nhập", 401);
      }

      const payload = req.body;
      const progress = await ChapterContentService.upsertChapterProgress(
        userId,
        chapterCode,
        muc,
        payload,
      );
      return sendSuccess(res, progress);
    } catch (err) {
      const error = err as Error;
      if (error.message === "Không tìm thấy chương" || error.message === "Không tìm thấy node") {
        return sendError(res, "CHAPTER_OR_NODE_NOT_FOUND", error.message, 404);
      }
      return sendError(res, "PROGRESS_UPDATE_ERROR", error.message, 500);
    }
  }
}
