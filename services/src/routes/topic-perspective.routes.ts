import { Router } from "express";
import { topicPerspectiveController } from "../controllers/topic-perspective.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createTopicPerspectiveSchema,
  listTopicPerspectivesSchema,
  topicPerspectiveIdSchema,
  updateTopicPerspectiveSchema,
} from "../validators/topic-perspective.validator.js";

// ── T-H01: TopicPerspective Routes ────────────────────────────
// All routes nested under /topics/:topicId/perspectives
// GET    /api/v1/topics/:topicId/perspectives         — public
// POST   /api/v1/topics/:topicId/perspectives         — ADMIN / MODERATOR
// PATCH  /api/v1/topics/:topicId/perspectives/:id     — ADMIN / MODERATOR
// DELETE /api/v1/topics/:topicId/perspectives/:id     — ADMIN / MODERATOR

export const topicPerspectiveRouter = Router({ mergeParams: true });

topicPerspectiveRouter.get("/", validate(listTopicPerspectivesSchema), (req, res, next) =>
  topicPerspectiveController.listByTopic(req, res, next),
);

topicPerspectiveRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(createTopicPerspectiveSchema),
  (req, res, next) => topicPerspectiveController.create(req, res, next),
);

topicPerspectiveRouter.patch(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(updateTopicPerspectiveSchema),
  (req, res, next) => topicPerspectiveController.update(req, res, next),
);

topicPerspectiveRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(topicPerspectiveIdSchema),
  (req, res, next) => topicPerspectiveController.delete(req, res, next),
);
