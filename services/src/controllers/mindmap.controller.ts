import type { Request, Response, NextFunction } from "express";
import { mindmapService, MindmapError } from "../services/mindmap.service.js";
import { sendError, sendSuccess } from "../utils/response.js";

// ── T-A13: Mindmap Controller ────────────────────────────────

function getId(req: Request): string {
  return String(req.params.id);
}

export class MindmapController {
  async getGraphByTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const graph = await mindmapService.getGraphByTopic(String(req.params.topicId));
      return sendSuccess(res, graph, 200);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async createNode(req: Request, res: Response, next: NextFunction) {
    try {
      const node = await mindmapService.createNode(req.body);
      return sendSuccess(res, node, 201);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async updateNode(req: Request, res: Response, next: NextFunction) {
    try {
      const node = await mindmapService.updateNode(getId(req), req.body);
      return sendSuccess(res, node, 200);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async deleteNode(req: Request, res: Response, next: NextFunction) {
    try {
      await mindmapService.deleteNode(getId(req));
      return sendSuccess(res, { message: "Đã xóa mindmap node thành công" }, 200);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async createEdge(req: Request, res: Response, next: NextFunction) {
    try {
      const edge = await mindmapService.createEdge(req.body);
      return sendSuccess(res, edge, 201);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async updateEdge(req: Request, res: Response, next: NextFunction) {
    try {
      const edge = await mindmapService.updateEdge(getId(req), req.body);
      return sendSuccess(res, edge, 200);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async deleteEdge(req: Request, res: Response, next: NextFunction) {
    try {
      await mindmapService.deleteEdge(getId(req));
      return sendSuccess(res, { message: "Đã xóa mindmap edge thành công" }, 200);
    } catch (err) {
      if (err instanceof MindmapError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const mindmapController = new MindmapController();
