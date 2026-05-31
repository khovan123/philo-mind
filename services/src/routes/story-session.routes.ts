import { Router } from "express";
import { storySessionController } from "../controllers/story-session.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  decideStorySessionSchema,
  completeStorySessionSchema,
} from "../validators/story-session.validator.js";

// ── T-D03: StorySession Routes ────────────────────────────────

export const storySessionRouter = Router();

// POST /api/v1/story-sessions/:sessionId/decide
storySessionRouter.post(
  "/:sessionId/decide",
  authGuard,
  validate(decideStorySessionSchema),
  (req, res, next) => storySessionController.decide(req, res, next),
);

// POST /api/v1/story-sessions/:sessionId/complete
storySessionRouter.post(
  "/:sessionId/complete",
  authGuard,
  validate(completeStorySessionSchema),
  (req, res, next) => storySessionController.complete(req, res, next),
);
