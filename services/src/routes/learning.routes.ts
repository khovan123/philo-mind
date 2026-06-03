import { Router } from "express";
import { learningController } from "../controllers/learning.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

export const learningRouter = Router();

learningRouter.get("/dashboard", optionalAuth, (req, res) => learningController.dashboard(req, res));
