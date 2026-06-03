import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

export const profileRouter = Router();

profileRouter.get("/summary", authGuard, (req, res) => profileController.summary(req, res));
