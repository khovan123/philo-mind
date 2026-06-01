import { Router } from "express";
import { aiController } from "../controllers/ai.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { generateSchema } from "../validators/ai.validator.js";
import { aiRateLimit } from "../middleware/ai-rate-limit.js";

export const aiRouter = Router();

aiRouter.post("/generate", aiRateLimit, validate(generateSchema), (req, res, next) =>
  aiController.generate(req, res, next),
);

aiRouter.post("/stream", aiRateLimit, validate(generateSchema), (req, res, next) =>
  aiController.stream(req, res, next),
);
