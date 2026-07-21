import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { bookmarkRouter } from "./bookmark.routes.js";
import { criticalQuestionRouter } from "./critical-question.routes.js";
import { mindmapRouter } from "./mindmap.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { badgeRouter } from "./badge.routes.js";
import { activityRouter } from "./activity.routes.js";
import { topicsRouter } from "./topics.routes.js";
import { storiesRouter } from "./stories.routes.js";
import { statsRouter } from "./stats.routes.js";

import { philosophyTagRouter } from "./philosophy-tag.routes.js";
import { storyLearnCardRouter } from "./story-learn-card.routes.js";
import { analysisTabRouter } from "./analysis-tab.routes.js";
import { storySessionRouter } from "./story-session.routes.js";
import { choiceRouter } from "./choice.routes.js";
import { miniGameRouter } from "./minigame.routes.js";
import { lessonRouter } from "./lesson.routes.js";
import { shortLessonRouter } from "./short-lesson.routes.js";
import { quizRouter } from "./quiz.routes.js";
import { progressRouter } from "./progress.routes.js";
import { learningRouter } from "./learning.routes.js";
import { profileRouter } from "./profile.routes.js";
import { chapterRouter } from "./chapter.routes.js";
import { movieRouter } from "./movie.routes.js";
import { searchRouter } from "./search.routes.js";

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

// Mindmap routes
apiRouter.use("/mindmaps", mindmapRouter);

// Notification routes
apiRouter.use("/notifications", notificationRouter);

// Badges and Activities routes
apiRouter.use("/badges", badgeRouter);
apiRouter.use("/activities", activityRouter);

// Cached content and stats routes
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/stories", storiesRouter);
apiRouter.use("/stats", statsRouter);

// T-D01: Story Mode Engine — learn cards, analysis tabs, philosophy tags
apiRouter.use("/philosophy-tags", philosophyTagRouter);
apiRouter.use("/stories/:storyId/learn-cards", storyLearnCardRouter);
apiRouter.use("/consequences/:consequenceId/tabs", analysisTabRouter);
apiRouter.use("/story-sessions", storySessionRouter);
apiRouter.use("/choices", choiceRouter);
apiRouter.use("/minigames", miniGameRouter);
apiRouter.use("/lessons", lessonRouter);
apiRouter.use("/short-lessons", shortLessonRouter);
apiRouter.use("/quizzes", quizRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/learning", learningRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/chapters", chapterRouter);
apiRouter.use("/movies", movieRouter);
apiRouter.use("/search", searchRouter);
