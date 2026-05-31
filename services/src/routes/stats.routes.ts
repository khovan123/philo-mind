import { Router } from "express";
import { StatsController } from "../controllers/stats.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";

// ── Stats Routes ─────────────────────────────────────────────

export const statsRouter = Router();
const controller = new StatsController();

// GET /api/v1/stats (cached for 5 minutes)
statsRouter.get("/", cacheMiddleware(300), (req, res) => controller.getStats(req, res));
