import { Router } from "express";
import { analysisTabController } from "../controllers/analysis-tab.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createAnalysisTabSchema,
  analysisTabIdSchema,
  listAnalysisTabsSchema,
  updateAnalysisTabSchema,
} from "../validators/analysis-tab.validator.js";

// ── T-D01: AnalysisTab Routes ─────────────────────────────────
// All routes nested under /consequences/:consequenceId/tabs
// GET    /api/v1/consequences/:consequenceId/tabs         — public
// POST   /api/v1/consequences/:consequenceId/tabs         — ADMIN / MODERATOR
// PATCH  /api/v1/consequences/:consequenceId/tabs/:id     — ADMIN / MODERATOR
// DELETE /api/v1/consequences/:consequenceId/tabs/:id     — ADMIN / MODERATOR

export const analysisTabRouter = Router({ mergeParams: true });

analysisTabRouter.get(
  "/",
  validate(listAnalysisTabsSchema),
  (req, res, next) => analysisTabController.listByConsequence(req, res, next),
);

analysisTabRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(createAnalysisTabSchema),
  (req, res, next) => analysisTabController.create(req, res, next),
);

analysisTabRouter.patch(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(updateAnalysisTabSchema),
  (req, res, next) => analysisTabController.update(req, res, next),
);

analysisTabRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(analysisTabIdSchema),
  (req, res, next) => analysisTabController.delete(req, res, next),
);
