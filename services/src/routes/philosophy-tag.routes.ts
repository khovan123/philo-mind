import { Router } from "express";
import { philosophyTagController } from "../controllers/philosophy-tag.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPhilosophyTagSchema, tagIdSchema } from "../validators/philosophy-tag.validator.js";

// ── T-D01: PhilosophyTag Routes ───────────────────────────────
// GET    /api/v1/philosophy-tags         — public list
// POST   /api/v1/philosophy-tags         — ADMIN / MODERATOR
// DELETE /api/v1/philosophy-tags/:id     — ADMIN only

export const philosophyTagRouter = Router();

philosophyTagRouter.get("/", (req, res, next) => philosophyTagController.listAll(req, res, next));

philosophyTagRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(createPhilosophyTagSchema),
  (req, res, next) => philosophyTagController.create(req, res, next),
);

philosophyTagRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN"),
  validate(tagIdSchema),
  (req, res, next) => philosophyTagController.delete(req, res, next),
);
