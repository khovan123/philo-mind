import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

export const movieRouter = Router();
const controller = new MovieController();

movieRouter.get("/:muc", (req, res) => controller.getMovie(req, res));
movieRouter.post("/:muc/sessions", authGuard, (req, res) => controller.submitSession(req, res));
