import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { bookmarkRouter } from "./bookmark.routes.js";
import { criticalQuestionRouter } from "./critical-question.routes.js";
import { mindmapRouter } from "./mindmap.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { reflectionRouter } from "./reflection.routes.js";
import { badgeRouter } from "./badge.routes.js";
import { activityRouter } from "./activity.routes.js";
import { moderationRouter } from "./moderation.routes.js";
import { topicsRouter } from "./topics.routes.js";
import { storiesRouter } from "./stories.routes.js";
import { statsRouter } from "./stats.routes.js";
import { philosophyTagRouter } from "./philosophy-tag.routes.js";
import { storyLearnCardRouter } from "./story-learn-card.routes.js";
import { analysisTabRouter } from "./analysis-tab.routes.js";
import { storySessionRouter } from "./story-session.routes.js";
import { choiceRouter } from "./choice.routes.js";
import { topicPerspectiveRouter } from "./topic-perspective.routes.js";
import { miniGameRouter } from "./minigame.routes.js";

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

// Critical question routes
apiRouter.use("/critical-questions", criticalQuestionRouter);

// Reflection routes
apiRouter.use("/reflections", reflectionRouter);

// Mindmap routes
apiRouter.use("/mindmaps", mindmapRouter);

// Notification routes
apiRouter.use("/notifications", notificationRouter);

// Badges, Activities, and Moderation routes
apiRouter.use("/badges", badgeRouter);
apiRouter.use("/activities", activityRouter);
apiRouter.use("/moderation", moderationRouter);

// Cached content and stats routes
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/topics/:topicId/perspectives", topicPerspectiveRouter);
apiRouter.use("/stories", storiesRouter);
apiRouter.use("/stats", statsRouter);

// T-D01: Story Mode Engine — learn cards, analysis tabs, philosophy tags
apiRouter.use("/philosophy-tags", philosophyTagRouter);
apiRouter.use("/stories/:storyId/learn-cards", storyLearnCardRouter);
apiRouter.use("/consequences/:consequenceId/tabs", analysisTabRouter);
apiRouter.use("/story-sessions", storySessionRouter);
apiRouter.use("/choices", choiceRouter);
apiRouter.use("/minigames", miniGameRouter);

// TODO: Phase 1+ routes
// apiRouter.use("/lessons", lessonRouter);
