import { Router } from "express";
import { storyLearnCardController } from "../controllers/story-learn-card.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createStoryLearnCardSchema,
  listStoryLearnCardsSchema,
  storyLearnCardIdSchema,
  updateStoryLearnCardSchema,
} from "../validators/story-learn-card.validator.js";

// ── T-D01: StoryLearnCard Routes ──────────────────────────────
// All routes nested under /stories/:storyId/learn-cards
// GET    /api/v1/stories/:storyId/learn-cards         — public
// POST   /api/v1/stories/:storyId/learn-cards         — ADMIN / MODERATOR
// PATCH  /api/v1/stories/:storyId/learn-cards/:id     — ADMIN / MODERATOR
// DELETE /api/v1/stories/:storyId/learn-cards/:id     — ADMIN / MODERATOR

export const storyLearnCardRouter = Router({ mergeParams: true });

storyLearnCardRouter.get(
  "/",
  validate(listStoryLearnCardsSchema),
  (req, res, next) => storyLearnCardController.listByStory(req, res, next),
);

storyLearnCardRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(createStoryLearnCardSchema),
  (req, res, next) => storyLearnCardController.create(req, res, next),
);

storyLearnCardRouter.patch(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(updateStoryLearnCardSchema),
  (req, res, next) => storyLearnCardController.update(req, res, next),
);

storyLearnCardRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(storyLearnCardIdSchema),
  (req, res, next) => storyLearnCardController.delete(req, res, next),
);
