import { Router } from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createNotificationSchema,
  listNotificationsSchema,
  notificationIdSchema,
  updateNotificationSchema,
} from "../validators/notification.validator.js";

// ── T-A15: Notification Routes ───────────────────────────────

export const notificationRouter = Router();

notificationRouter.use(authGuard);

notificationRouter.get("/", validate(listNotificationsSchema), (req, res, next) =>
  notificationController.list(req, res, next),
);

notificationRouter.post(
  "/",
  roleGuard("ADMIN"),
  validate(createNotificationSchema),
  (req, res, next) => notificationController.create(req, res, next),
);

notificationRouter.get("/unread-count", (req, res, next) =>
  notificationController.getUnreadCount(req, res, next),
);

notificationRouter.patch("/read-all", (req, res, next) =>
  notificationController.markAllAsRead(req, res, next),
);

notificationRouter.get("/:id", validate(notificationIdSchema), (req, res, next) =>
  notificationController.getById(req, res, next),
);

notificationRouter.patch("/:id/read", validate(notificationIdSchema), (req, res, next) =>
  notificationController.markAsRead(req, res, next),
);

notificationRouter.patch(
  "/:id",
  roleGuard("ADMIN"),
  validate(updateNotificationSchema),
  (req, res, next) => notificationController.update(req, res, next),
);

notificationRouter.delete("/:id", validate(notificationIdSchema), (req, res, next) =>
  notificationController.delete(req, res, next),
);
