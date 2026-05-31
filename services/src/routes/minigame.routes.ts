import { Router } from "express";
import { miniGameController } from "../controllers/minigame.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createMiniGameSchema,
  listMiniGamesSchema,
  miniGameIdSchema,
  playMiniGameSchema,
  updateMiniGameSchema,
} from "../validators/minigame.validator.js";

// ── T-H03: MiniGame Routes ───────────────────────────────────

export const miniGameRouter = Router();

miniGameRouter.use(authGuard);

miniGameRouter.get("/", validate(listMiniGamesSchema), (req, res, next) =>
  miniGameController.list(req, res, next),
);

miniGameRouter.post("/", roleGuard("ADMIN"), validate(createMiniGameSchema), (req, res, next) =>
  miniGameController.create(req, res, next),
);

miniGameRouter.post("/:id/play", validate(playMiniGameSchema), (req, res, next) =>
  miniGameController.play(req, res, next),
);

miniGameRouter.get("/:id/leaderboard", validate(miniGameIdSchema), (req, res, next) =>
  miniGameController.leaderboard(req, res, next),
);

miniGameRouter.get("/:id", validate(miniGameIdSchema), (req, res, next) =>
  miniGameController.getById(req, res, next),
);

miniGameRouter.patch("/:id", roleGuard("ADMIN"), validate(updateMiniGameSchema), (req, res, next) =>
  miniGameController.update(req, res, next),
);

miniGameRouter.delete("/:id", roleGuard("ADMIN"), validate(miniGameIdSchema), (req, res, next) =>
  miniGameController.delete(req, res, next),
);
