import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { notificationRouter } from "./notification.routes.js";

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

// Notification routes
apiRouter.use("/notifications", notificationRouter);

// TODO: Phase 1+ routes
// apiRouter.use("/topics", topicRouter);
// apiRouter.use("/lessons", lessonRouter);
// apiRouter.use("/stories", storyRouter);
