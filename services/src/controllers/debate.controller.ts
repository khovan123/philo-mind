import type { Request, Response, NextFunction } from "express";
import { debateService, DebateError } from "../services/debate.service.js";
import { verifyAccessToken } from "../utils/jwt.js";
import {
  sendSuccess,
  sendError,
  sendPaginated,
  buildPaginationMeta,
  parsePagination,
} from "../utils/response.js";
import type { ListDebatesQuery } from "../validators/debate.validator.js";
import { DebateStance, VoteValue } from "../prisma/generated/enums.js";

// ── T-F05: Debate Controller ──────────────────────────────────────

export class DebateController {
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
   * Helper to map stance aliases (FOR -> AGREE, AGAINST -> DISAGREE)
   */
  private mapStance(stance?: string): DebateStance | undefined {
    if (!stance) return undefined;
    const s = stance.toUpperCase();
    if (s === "FOR" || s === "AGREE") return DebateStance.AGREE;
    if (s === "AGAINST" || s === "DISAGREE") return DebateStance.DISAGREE;
    if (s === "NEUTRAL") return DebateStance.NEUTRAL;
    if (s === "ALTERNATIVE") return DebateStance.ALTERNATIVE;
    return undefined;
  }

  /**
   * List all debates (paginated & filtered)
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (res.locals.query || req.query) as ListDebatesQuery;
      const { topicId, stance } = query;
      const { page, limit } = parsePagination(query as any);

      const mappedStance = this.mapStance(stance);

      const result = await debateService.listDebates(
        { topicId, stance: mappedStance },
        page,
        limit,
      );

      const meta = buildPaginationMeta(result.total, page, limit);
      return sendPaginated(res, result.debates, meta);
    } catch (err: unknown) {
      if (err instanceof DebateError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Get debate detail with arguments and comments
   */
  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = this.getOptionalUserId(req);

      const debate = await debateService.getDebateDetail(String(id), userId);
      return sendSuccess(res, debate);
    } catch (err: unknown) {
      if (err instanceof DebateError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Post a new argument to a debate
   */
  async createArgument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực người dùng", 401);
      }

      const { stance, content } = req.body;
      const mappedStance = this.mapStance(stance);

      if (!mappedStance) {
        return sendError(
          res,
          "INVALID_STANCE",
          "Lập trường không hợp lệ. Chọn AGREE, DISAGREE, hoặc NEUTRAL",
          400,
        );
      }

      const result = await debateService.createArgument(String(id), userId, {
        stance: mappedStance,
        content,
      });

      return sendSuccess(res, result, 201);
    } catch (err: unknown) {
      if (err instanceof DebateError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Vote on a debate argument
   */
  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực người dùng", 401);
      }

      const { value } = req.body;
      const voteValue = value?.toUpperCase() as VoteValue;

      if (voteValue !== VoteValue.UP && voteValue !== VoteValue.DOWN) {
        return sendError(res, "INVALID_VOTE", "Lượt bầu chọn phải là UP hoặc DOWN", 400);
      }

      const result = await debateService.voteArgument(String(id), userId, voteValue);
      return sendSuccess(res, result);
    } catch (err: unknown) {
      if (err instanceof DebateError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }

  /**
   * Add a comment to a debate argument
   */
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực người dùng", 401);
      }

      const { commentText } = req.body;

      const result = await debateService.createComment(String(id), userId, commentText);
      return sendSuccess(res, result, 201);
    } catch (err: unknown) {
      if (err instanceof DebateError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }
      return next(err);
    }
  }
}

export const debateController = new DebateController();
