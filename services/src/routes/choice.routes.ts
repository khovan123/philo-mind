import { Router } from "express";
import { consequenceController } from "../controllers/consequence.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { getConsequenceByChoiceSchema } from "../validators/choice.validator.js";

// ── T-D04: Choice Routes ──────────────────────────────────────

export const choiceRouter = Router();

// GET /api/v1/choices/:choiceId/consequence (fetch choice consequence and its analyses)
choiceRouter.get(
  "/:choiceId/consequence",
  validate(getConsequenceByChoiceSchema),
  (req, res, next) => consequenceController.getByChoice(req, res, next),
);
