import { Router } from "express";
import { ChapterController } from "../controllers/chapter.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

export const chapterRouter = Router();
const controller = new ChapterController();

chapterRouter.get("/", (req, res) => controller.getChapters(req, res));
chapterRouter.get("/:chapter/nodes", (req, res) => controller.getNodes(req, res));
chapterRouter.get("/:chapter/nodes/:muc", (req, res) => controller.getNodeByMuc(req, res));

// Progress endpoints
chapterRouter.get("/progress/all", authGuard, (req, res) =>
  controller.getAllChapterProgress(req, res),
);
chapterRouter.get("/:chapter/progress", authGuard, (req, res) =>
  controller.getChapterProgress(req, res),
);
chapterRouter.put("/:chapter/nodes/:muc/progress", authGuard, (req, res) =>
  controller.upsertChapterProgress(req, res),
);
