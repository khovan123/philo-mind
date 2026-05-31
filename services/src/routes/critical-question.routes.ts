import { Router } from "express";
import { criticalQuestionController } from "../controllers/critical-question.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  adminListCriticalQuestionsSchema,
  createCriticalQuestionSchema,
  criticalQuestionIdSchema,
  listCriticalQuestionsSchema,
  randomCriticalQuestionSchema,
  updateCriticalQuestionSchema,
} from "../validators/critical-question.validator.js";

// ── T-A12: Critical Question Routes ────────────────────────────

export const criticalQuestionRouter = Router();

criticalQuestionRouter.use(authGuard);

criticalQuestionRouter.get("/", validate(listCriticalQuestionsSchema), (req, res, next) =>
  criticalQuestionController.list(req, res, next),
);

criticalQuestionRouter.get("/random", validate(randomCriticalQuestionSchema), (req, res, next) =>
  criticalQuestionController.getRandom(req, res, next),
);

criticalQuestionRouter.get("/daily-random", validate(randomCriticalQuestionSchema), (req, res, next) =>
  criticalQuestionController.getDailyRandom(req, res, next),
);

criticalQuestionRouter.get("/admin", roleGuard("ADMIN"), validate(adminListCriticalQuestionsSchema), (req, res, next) =>
  criticalQuestionController.adminList(req, res, next),
);

criticalQuestionRouter.post("/admin", roleGuard("ADMIN"), validate(createCriticalQuestionSchema), (req, res, next) =>
  criticalQuestionController.create(req, res, next),
);

criticalQuestionRouter.patch(
  "/admin/:id",
  roleGuard("ADMIN"),
  validate(updateCriticalQuestionSchema),
  (req, res, next) => criticalQuestionController.update(req, res, next),
);

criticalQuestionRouter.delete(
  "/admin/:id",
  roleGuard("ADMIN"),
  validate(criticalQuestionIdSchema),
  (req, res, next) => criticalQuestionController.delete(req, res, next),
);

criticalQuestionRouter.get("/:id", validate(criticalQuestionIdSchema), (req, res, next) =>
  criticalQuestionController.getById(req, res, next),
);
