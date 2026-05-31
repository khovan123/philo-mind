import { Router } from "express";
import { TopicController } from "../controllers/topic.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";

// ── Topics Routes ───────────────────────────────────────────

export const topicsRouter = Router();
const controller = new TopicController();

// GET /api/v1/topics (cached for 5 minutes)
topicsRouter.get("/", cacheMiddleware(300), (req, res) => controller.getAll(req, res));

// POST /api/v1/topics (restricted to ADMIN and MODERATOR, invalidates cache)
topicsRouter.post("/", authGuard, roleGuard("ADMIN", "MODERATOR"), (req, res) =>
  controller.create(req, res),
);
