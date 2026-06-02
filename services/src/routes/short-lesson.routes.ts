import { Router } from "express";
import { ShortLessonController } from "../controllers/short-lesson.controller.js";
import { authGuard, optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listShortLessonsSchema,
  shortLessonIdSchema,
  respondShortLessonSchema,
  commentShortLessonSchema,
} from "../validators/short-lesson.validator.js";

// ── T-A08: Short Lesson Routes ───────────────────────────────────────

export const shortLessonRouter = Router();
const controller = new ShortLessonController();

// GET /api/v1/short-lessons (paginated list with filters)
shortLessonRouter.get("/", validate(listShortLessonsSchema), (req, res) =>
  controller.getAll(req, res),
);

// GET /api/v1/short-lessons/:id (retrieve short lesson details with my stance/comments)
shortLessonRouter.get("/:id", optionalAuth, validate(shortLessonIdSchema), (req, res) =>
  controller.getById(req, res),
);

// POST /api/v1/short-lessons/:id/respond (submit/upsert a response to a short lesson dilemma)
shortLessonRouter.post("/:id/respond", authGuard, validate(respondShortLessonSchema), (req, res) =>
  controller.respond(req, res),
);

// POST /api/v1/short-lessons/:id/comments (post a comment on a short lesson)
shortLessonRouter.post("/:id/comments", authGuard, validate(commentShortLessonSchema), (req, res) =>
  controller.comment(req, res),
);

// GET /api/v1/short-lessons/:id/comments (retrieve all comments of a short lesson paginated)
shortLessonRouter.get("/:id/comments", validate(shortLessonIdSchema), (req, res) =>
  controller.getComments(req, res),
);
