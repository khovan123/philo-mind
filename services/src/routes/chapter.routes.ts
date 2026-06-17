import { Router } from "express";
import { ChapterController } from "../controllers/chapter.controller.js";

export const chapterRouter = Router();
const controller = new ChapterController();

chapterRouter.get("/", (req, res) => controller.getChapters(req, res));
chapterRouter.get("/:chapter/nodes", (req, res) => controller.getNodes(req, res));
chapterRouter.get("/:chapter/nodes/:muc", (req, res) => controller.getNodeByMuc(req, res));
