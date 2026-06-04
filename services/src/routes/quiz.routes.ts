import { Router } from "express";
import { quizController } from "../controllers/quiz.controller.js";
import { authGuard, optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  attemptIdSchema,
  lessonQuizSchema,
  listQuizzesSchema,
  quizIdSchema,
  submitQuizAnswerSchema,
} from "../validators/quiz.validator.js";

export const quizRouter = Router();

quizRouter.get("/", optionalAuth, validate(listQuizzesSchema), (req, res) =>
  quizController.list(req, res),
);
quizRouter.get("/by-lesson/:lessonId", optionalAuth, validate(lessonQuizSchema), (req, res) =>
  quizController.getByLesson(req, res),
);
quizRouter.post("/:quizId/attempts", authGuard, validate(quizIdSchema), (req, res) =>
  quizController.startAttempt(req, res),
);
quizRouter.post(
  "/attempts/:attemptId/answers",
  authGuard,
  validate(submitQuizAnswerSchema),
  (req, res) => quizController.submitAnswer(req, res),
);
quizRouter.post("/attempts/:attemptId/complete", authGuard, validate(attemptIdSchema), (req, res) =>
  quizController.completeAttempt(req, res),
);
