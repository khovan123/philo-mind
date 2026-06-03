import { Router } from "express";
import { quizController } from "../controllers/quiz.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  attemptIdSchema,
  completeAttemptSchema,
  listQuizzesSchema,
  quizIdSchema,
  startAttemptSchema,
  submitAnswerSchema,
} from "../validators/quiz.validator.js";

// ── T-A10: Quiz Routes ──────────────────────────────────────

export const quizRouter = Router();

quizRouter.use(authGuard);

// List quizzes
quizRouter.get("/", validate(listQuizzesSchema), (req, res, next) =>
  quizController.list(req, res, next),
);

// Get a quiz with questions
quizRouter.get("/:quizId", validate(quizIdSchema), (req, res, next) =>
  quizController.getById(req, res, next),
);

// Start an attempt
quizRouter.post("/:quizId/attempts", validate(startAttemptSchema), (req, res, next) =>
  quizController.startAttempt(req, res, next),
);

// Submit an answer within an attempt
quizRouter.post("/attempts/:attemptId/answers", validate(submitAnswerSchema), (req, res, next) =>
  quizController.submitAnswer(req, res, next),
);

// Complete an attempt
quizRouter.post(
  "/attempts/:attemptId/complete",
  validate(completeAttemptSchema),
  (req, res, next) => quizController.completeAttempt(req, res, next),
);

// Get attempt details
quizRouter.get("/attempts/:attemptId", validate(attemptIdSchema), (req, res, next) =>
  quizController.getAttempt(req, res, next),
);
