import { Router } from "express";
import { StoryController } from "../controllers/story.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listStoryScenariosSchema,
  getStoryScenarioDetailSchema,
} from "../validators/story.validator.js";

import { storySessionController } from "../controllers/story-session.controller.js";
import { startStorySessionSchema } from "../validators/story-session.validator.js";

// ── Stories Routes ───────────────────────────────────────────

export const storiesRouter = Router();
const controller = new StoryController();

// GET /api/v1/stories (paginated, filterable, cached for 5 minutes)
storiesRouter.get("/", validate(listStoryScenariosSchema), cacheMiddleware(300), (req, res, next) =>
  controller.getAll(req, res, next),
);

// GET /api/v1/stories/:id (story detail with learn cards, cached for 5 minutes)
storiesRouter.get(
  "/:id",
  validate(getStoryScenarioDetailSchema),
  cacheMiddleware(300),
  (req, res, next) => controller.getDetail(req, res, next),
);

// POST /api/v1/stories (restricted to ADMIN and MODERATOR, invalidates cache)
storiesRouter.post("/", authGuard, roleGuard("ADMIN", "MODERATOR"), (req, res, next) =>
  controller.create(req, res, next),
);

// POST /api/v1/stories/:storyId/sessions (start or resume a play session)
storiesRouter.post(
  "/:storyId/sessions",
  authGuard,
  validate(startStorySessionSchema),
  (req, res, next) => storySessionController.start(req, res, next),
);
