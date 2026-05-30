import { Router } from "express";
import { StoryController } from "../controllers/story.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";

// ── Stories Routes ───────────────────────────────────────────

export const storiesRouter = Router();
const controller = new StoryController();

// GET /api/v1/stories (cached for 5 minutes)
storiesRouter.get("/", cacheMiddleware(300), (req, res) => controller.getAll(req, res));

// POST /api/v1/stories (restricted to ADMIN and MODERATOR, invalidates cache)
storiesRouter.post("/", authGuard, roleGuard("ADMIN", "MODERATOR"), (req, res) =>
  controller.create(req, res),
);
