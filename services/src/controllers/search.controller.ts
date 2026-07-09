import type { Request, Response, NextFunction } from "express";
import { searchService } from "../services/search.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class SearchController {
  async semanticSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const query = String(req.query.q || "").trim();
      const type = req.query.type ? String(req.query.type) : undefined;

      if (!query) {
        return sendSuccess(res, []);
      }

      const results = await searchService.search(query, type);
      return sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  async triggerRecache(_req: Request, res: Response, next: NextFunction) {
    try {
      // Force refresh the cache in background
      searchService.initializeVectorCache();
      return sendSuccess(res, { message: "Recaching triggered successfully" });
    } catch (err) {
      next(err);
    }
  }
}
