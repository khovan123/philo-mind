import { Router } from "express";
import { TopicController } from "../controllers/topic.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listTopicsSchema,
  topicIdSchema,
  createTopicSchema,
  updateTopicSchema,
} from "../validators/topic.validator.js";

// ── T-A06: Topic Routes with Validation and Route Guards ───────

export const topicsRouter = Router();
const controller = new TopicController();

// GET /api/v1/topics (cached for 5 minutes, validates search/filter/pagination query params)
topicsRouter.get("/", validate(listTopicsSchema), cacheMiddleware(300), (req, res) =>
  controller.getAll(req, res),
);

// GET /api/v1/topics/:id (validates UUID in params)
topicsRouter.get("/:id", validate(topicIdSchema), (req, res) => controller.getById(req, res));

// POST /api/v1/topics (restricted to ADMIN and MODERATOR, validates body, invalidates cache)
topicsRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(createTopicSchema),
  (req, res) => controller.create(req, res),
);

// PATCH /api/v1/topics/:id (restricted to ADMIN and MODERATOR, validates params and partial body, invalidates cache)
topicsRouter.patch(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(updateTopicSchema),
  (req, res) => controller.update(req, res),
);

// DELETE /api/v1/topics/:id (restricted to ADMIN and MODERATOR, validates param id, invalidates cache)
topicsRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(topicIdSchema),
  (req, res) => controller.delete(req, res),
);
