import type { Request, Response, NextFunction } from "express";
import { aiService, AiError } from "../services/ai.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class AiController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;

      const result = await aiService.generate(prompt);

      return sendSuccess(res, result, 200);
    } catch (err) {
      if (err instanceof AiError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }

      return next(err);
    }
  }

  async stream(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of aiService.stream(prompt)) {
        res.write(`data: ${chunk}\n\n`);
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err) {
      if (err instanceof AiError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }

      return next(err);
    }
  }
}

export const aiController = new AiController();
