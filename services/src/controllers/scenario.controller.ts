import type { Request, Response, NextFunction } from "express";
import { scenarioService, ScenarioError } from "../services/scenario.service.js";
import { verifyAccessToken } from "../utils/jwt.js";
import {
  sendSuccess,
  sendError,
  sendPaginated,
  buildPaginationMeta,
  parsePagination,
} from "../utils/response.js";
import type { ListScenariosQuery } from "../validators/scenario.validator.js";

// ── T-F02: Scenario Controller ──────────────────────────────────

export class ScenarioController {
  /**
   * Helper to extract user ID from authorization header if present
   */
  private getOptionalUserId(req: Request): string | null {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token) {
          const payload = verifyAccessToken(token);
          return payload.sub || null;
        }
      }
    } catch {
      // Return null if token is invalid or expired
    }
    return null;
  }

  /**
   * List all real-life scenarios (paginated & filtered)
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (res.locals.query || req.query) as ListScenariosQuery;
      const { topicId } = query;
      const { page, limit } = parsePagination(query as any);

      const result = await scenarioService.listScenarios({ topicId }, page, limit);

      const meta = buildPaginationMeta(result.total, page, limit);
      return sendPaginated(res, result.scenarios, meta);
    } catch (err: unknown) {
      if (err instanceof ScenarioError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Get detail of a scenario with optional user response
   */
  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = this.getOptionalUserId(req);

      const scenario = await scenarioService.getScenarioDetail(String(id), userId);
      return sendSuccess(res, scenario);
    } catch (err: unknown) {
      if (err instanceof ScenarioError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Submit initial stance response for scenario
   */
  async respond(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực người dùng", 401);
      }

      const result = await scenarioService.respondScenario(String(id), userId, req.body);
      return sendSuccess(res, result);
    } catch (err: unknown) {
      if (err instanceof ScenarioError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Submit revised stance/reflection response for scenario
   */
  async rethink(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực người dùng", 401);
      }

      const result = await scenarioService.rethinkScenario(String(id), userId, req.body);
      return sendSuccess(res, result);
    } catch (err: unknown) {
      if (err instanceof ScenarioError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const scenarioController = new ScenarioController();
