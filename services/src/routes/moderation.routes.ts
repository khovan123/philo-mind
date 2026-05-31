import { Router } from "express";
import { moderationController } from "../controllers/moderation.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";

export const moderationRouter = Router();

// File a manual content report (any authenticated user can report)
moderationRouter.post(
  "/reports",
  authGuard,
  moderationController.createReport.bind(moderationController),
);

// Retrieve reported content list (restricted to admins & moderators)
moderationRouter.get(
  "/reports",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  moderationController.getReports.bind(moderationController),
);

// Apply a moderation action code to a report (restricted to admins & moderators)
moderationRouter.post(
  "/reports/:reportId/action",
  authGuard,
  roleGuard("ADMIN", "MODERATOR"),
  moderationController.takeAction.bind(moderationController),
);
