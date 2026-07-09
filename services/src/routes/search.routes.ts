import { Router } from "express";
import { SearchController } from "../controllers/search.controller.js";

export const searchRouter = Router();
const controller = new SearchController();

searchRouter.get("/semantic", (req, res, next) => controller.semanticSearch(req, res, next));
searchRouter.post("/recache", (req, res, next) => controller.triggerRecache(req, res, next));
