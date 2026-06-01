import { Router } from "express";
import { activityLogController } from "../controllers/activity-log.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createActivitySchema, listActivitiesSchema } from "../validators/activity.validator.js";

export const activityRouter = Router();

// Log an activity manually
activityRouter.post(
  "/",
  authGuard,
  validate(createActivitySchema),
  activityLogController.logActivity.bind(activityLogController),
);

// Retrieve user's paginated activity history
activityRouter.get(
  "/",
  authGuard,
  validate(listActivitiesSchema),
  activityLogController.getActivityHistory.bind(activityLogController),
);

// Retrieve consecutive daily streak and longest streak details
activityRouter.get(
  "/streak",
  authGuard,
  activityLogController.getStreakDetails.bind(activityLogController),
);
