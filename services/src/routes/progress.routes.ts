import { Router } from "express";
import { progressController } from "../controllers/progress.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listProgressSchema,
  progressByLessonSchema,
  progressByTopicSchema,
  upsertProgressSchema,
} from "../validators/progress.validator.js";

// ── T-A09: User Progress Routes ─────────────────────────────

export const progressRouter = Router();

progressRouter.use(authGuard);

// List all progress for the current user
progressRouter.get("/", validate(listProgressSchema), (req, res, next) =>
  progressController.list(req, res, next),
);

// Get/Upsert progress for a specific lesson
progressRouter.get("/lessons/:lessonId", validate(progressByLessonSchema), (req, res, next) =>
  progressController.getByLesson(req, res, next),
);

progressRouter.put("/lessons/:lessonId", validate(upsertProgressSchema), (req, res, next) =>
  progressController.upsert(req, res, next),
);

// Get aggregated stats for a topic
progressRouter.get("/topics/:topicId", validate(progressByTopicSchema), (req, res, next) =>
  progressController.statsByTopic(req, res, next),
);
