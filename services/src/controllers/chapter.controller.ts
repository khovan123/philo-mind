import type { Request, Response } from "express";
import { ChapterContentService } from "../services/chapter-content.service.js";
import { sendError, sendSuccess } from "../utils/response.js";

export class ChapterController {
  getChapters(_req: Request, res: Response) {
    try {
      return sendSuccess(res, ChapterContentService.listChapters());
    } catch (err) {
      const error = err as Error;
      return sendError(res, "CHAPTER_LIST_ERROR", error.message, 500);
    }
  }

  getNodes(req: Request, res: Response) {
    try {
      const chapter = String(req.params.chapter);

      const nodes = ChapterContentService.listNodes(chapter);

      return sendSuccess(res, {
        order: nodes.map((node) => node.muc),
        nodes,
      });
    } catch (err) {
      const error = err as Error;
      const status = error.message.includes("không hợp lệ") ? 400 : 500;

      return sendError(res, "CHAPTER_CSV_READ_ERROR", error.message, status);
    }
  }

  getNodeByMuc(req: Request, res: Response) {
    try {
      const chapter = String(req.params.chapter);
      const muc = String(req.params.muc);
      const node = ChapterContentService.getNode(chapter, muc);

      if (!node) {
        return sendError(res, "CHAPTER_NODE_NOT_FOUND", "Không tìm thấy node bài học", 404);
      }

      return sendSuccess(res, node);
    } catch (err) {
      const error = err as Error;
      const status = error.message.includes("không hợp lệ") ? 400 : 500;

      return sendError(res, "CHAPTER_CSV_READ_ERROR", error.message, status);
    }
  }
}
