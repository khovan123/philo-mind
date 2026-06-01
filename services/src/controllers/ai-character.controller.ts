import type { Request, Response, NextFunction } from "express";

import { aiCharacterService, AiCharacterError } from "../services/ai-character.service.js";

import { sendSuccess, sendError } from "../utils/response.js";

export class AiCharacterController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await aiCharacterService.getAll();

      return sendSuccess(res, data);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await aiCharacterService.getById(String(req.params.id));

      return sendSuccess(res, data);
    } catch (err) {
      if (err instanceof AiCharacterError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }

      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await aiCharacterService.create(req.body);

      return sendSuccess(res, data, 201);
    } catch (err) {
      if (err instanceof AiCharacterError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }

      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await aiCharacterService.update(String(req.params.id), req.body);

      return sendSuccess(res, data);
    } catch (err) {
      if (err instanceof AiCharacterError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }

      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await aiCharacterService.delete(String(req.params.id));

      return sendSuccess(res, data);
    } catch (err) {
      if (err instanceof AiCharacterError) {
        return sendError(res, err.code, err.message, err.statusCode);
      }

      return next(err);
    }
  }
}

export const aiCharacterController = new AiCharacterController();
