import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { bookmarkRouter } from "./bookmark.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { badgeRouter } from "./badge.routes.js";
import { activityRouter } from "./activity.routes.js";
import { moderationRouter } from "./moderation.routes.js";

// ── API v1 Router ──────────────────────────────────────────

export const apiRouter = Router();

// Health check
apiRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      message: "PhiloMind API v1",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
  });
});

// Auth routes
apiRouter.use("/auth", authRouter);

// Bookmark routes
apiRouter.use("/bookmarks", bookmarkRouter);

// Notification routes
apiRouter.use("/notifications", notificationRouter);

// Badges, Activities, and Moderation routes
apiRouter.use("/badges", badgeRouter);
apiRouter.use("/activities", activityRouter);
apiRouter.use("/moderation", moderationRouter);

// TODO: Phase 1+ routes
// apiRouter.use("/topics", topicRouter);
// apiRouter.use("/lessons", lessonRouter);
// apiRouter.use("/stories", storyRouter);
