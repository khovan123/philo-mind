import { Router } from "express";
import { reflectionController } from "../controllers/reflection.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createReflectionSchema,
  listReflectionsSchema,
  reflectionIdSchema,
  updateReflectionSchema,
} from "../validators/reflection.validator.js";

// ── T-A11: Reflection Routes ───────────────────────────────────

export const reflectionRouter = Router();

reflectionRouter.use(authGuard);

reflectionRouter.get("/", validate(listReflectionsSchema), (req, res, next) =>
  reflectionController.list(req, res, next),
);

reflectionRouter.post("/", validate(createReflectionSchema), (req, res, next) =>
  reflectionController.create(req, res, next),
);

reflectionRouter.get("/:id", validate(reflectionIdSchema), (req, res, next) =>
  reflectionController.getById(req, res, next),
);

reflectionRouter.patch("/:id", validate(updateReflectionSchema), (req, res, next) =>
  reflectionController.update(req, res, next),
);

reflectionRouter.delete("/:id", validate(reflectionIdSchema), (req, res, next) =>
  reflectionController.delete(req, res, next),
);
