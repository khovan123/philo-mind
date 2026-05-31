import { Router } from "express";
import { badgeController } from "../controllers/badge.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

export const badgeRouter = Router();

// Retrieve all badges with current progress metrics and earning status
badgeRouter.get("/", authGuard, badgeController.getAllBadges.bind(badgeController));

// Retrieve only earned badges
badgeRouter.get("/earned", authGuard, badgeController.getEarnedBadges.bind(badgeController));
