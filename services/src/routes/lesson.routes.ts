import { Router } from "express";
import { LessonController } from "../controllers/lesson.controller.js";
import { authGuard, optionalAuth, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listLessonsSchema,
  lessonIdSchema,
  createLessonSchema,
  updateLessonSchema,
  submitAnswerSchema,
} from "../validators/lesson.validator.js";

// ── T-A07: Lesson Routes ───────────────────────────────────────

export const lessonRouter = Router();
const controller = new LessonController();

// GET /api/v1/lessons (paginated list with filters)
lessonRouter.get("/", optionalAuth, validate(listLessonsSchema), (req, res) =>
  controller.getAll(req, res),
);

// GET /api/v1/lessons/:id (retrieve lesson details with questions)
lessonRouter.get("/:id", optionalAuth, validate(lessonIdSchema), (req, res) =>
  controller.getById(req, res),
);

// POST /api/v1/lessons/:id/progress (update reading/study progress)
lessonRouter.post("/:id/progress", authGuard, validate(lessonIdSchema), (req, res) =>
  controller.updateProgress(req, res),
);

// POST /api/v1/lessons/questions/:questionId/answers (submit answer to review question)
lessonRouter.post("/questions/:questionId/answers", authGuard, validate(submitAnswerSchema), (req, res) =>
  controller.submitQuestionAnswer(req, res),
);

// ADMIN/MODERATOR ONLY ROUTES
// POST /api/v1/lessons (create a new lesson)
lessonRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(createLessonSchema),
  (req, res) => controller.create(req, res),
);

// PATCH /api/v1/lessons/:id (update existing lesson details)
lessonRouter.patch(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(updateLessonSchema),
  (req, res) => controller.update(req, res),
);

// DELETE /api/v1/lessons/:id (delete a lesson)
lessonRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  validate(lessonIdSchema),
  (req, res) => controller.delete(req, res),
);
