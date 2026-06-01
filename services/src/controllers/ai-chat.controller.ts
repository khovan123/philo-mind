import type { Request, Response, NextFunction } from "express";
import { aiChatService, AiChatError } from "../services/ai-chat.service.js";
import {
  sendSuccess,
  sendPaginated,
  sendError,
  buildPaginationMeta,
  parsePagination,
} from "../utils/response.js";

export class AiChatController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { characterId, title } = req.body;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực", 401);
      }

      const session = await aiChatService.createSession(userId, characterId, title);

      return sendSuccess(res, session, 201);
    } catch (error) {
      if (error instanceof AiChatError) {
        return sendError(res, error.code, error.message, error.statusCode);
      }

      return next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực", 401);
      }

      const { page, limit } = parsePagination(req.query as {
        page?: string;
        limit?: string;
      });

      const { total, sessions } = await aiChatService.listSessions(
        userId,
        page,
        limit,
      );

      return sendPaginated(res, sessions, buildPaginationMeta(total, page, limit));
    } catch (error) {
      if (error instanceof AiChatError) {
        return sendError(res, error.code, error.message, error.statusCode);
      }

      return next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực", 401);
      }

      const session = await aiChatService.getSession(userId, id);

      return sendSuccess(res, session);
    } catch (error) {
      if (error instanceof AiChatError) {
        return sendError(res, error.code, error.message, error.statusCode);
      }

      return next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const message = Array.isArray(req.body.message)
        ? req.body.message[0]
        : req.body.message;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực", 401);
      }

      const payload = await aiChatService.sendMessage(userId, id, message);

      return sendSuccess(res, payload, 201);
    } catch (error) {
      if (error instanceof AiChatError) {
        return sendError(res, error.code, error.message, error.statusCode);
      }

      return next(error);
    }
  }

  async stream(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const message = Array.isArray(req.body.message)
        ? req.body.message[0]
        : req.body.message;

      if (!userId) {
        return sendError(res, "UNAUTHORIZED", "Chưa xác thực", 401);
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      for await (const chunk of aiChatService.streamMessage(userId, id, message)) {
        res.write(`data: ${JSON.stringify({ text: chunk })}

`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}

`);
      res.end();
    } catch (error) {
      if (error instanceof AiChatError) {
        res.write(`data: ${JSON.stringify({ error: { code: error.code, message: error.message } })}

`);
        res.end();
        return;
      }

      return next(error);
    }
  }
}

export const aiChatController = new AiChatController();
