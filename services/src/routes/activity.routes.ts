import { Router } from "express";
import { activityLogController } from "../controllers/activity-log.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

export const activityRouter = Router();

// Log an activity manually
activityRouter.post("/", authGuard, activityLogController.logActivity.bind(activityLogController));

// Retrieve user's paginated activity history
activityRouter.get(
  "/",
  authGuard,
  activityLogController.getActivityHistory.bind(activityLogController),
);

// Retrieve consecutive daily streak and longest streak details
activityRouter.get(
  "/streak",
  authGuard,
  activityLogController.getStreakDetails.bind(activityLogController),
);
