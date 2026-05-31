import type { Request, Response, NextFunction } from "express";
import { analysisTabService, AnalysisTabError } from "../services/analysis-tab.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ── T-D01: AnalysisTab Controller ────────────────────────────

export class AnalysisTabController {
  async listByConsequence(req: Request, res: Response, next: NextFunction) {
    try {
      const tabs = await analysisTabService.listByConsequence(String(req.params.consequenceId));
      return sendSuccess(res, tabs);
    } catch (err) {
      if (err instanceof AnalysisTabError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tab = await analysisTabService.create(String(req.params.consequenceId), req.body);
      return sendSuccess(res, tab, 201);
    } catch (err) {
      if (err instanceof AnalysisTabError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tab = await analysisTabService.update(
        String(req.params.consequenceId),
        String(req.params.id),
        req.body,
      );
      return sendSuccess(res, tab);
    } catch (err) {
      if (err instanceof AnalysisTabError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await analysisTabService.delete(
        String(req.params.consequenceId),
        String(req.params.id),
      );
      return sendSuccess(res, { message: "Đã xóa analysis tab thành công" });
    } catch (err) {
      if (err instanceof AnalysisTabError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const analysisTabController = new AnalysisTabController();
