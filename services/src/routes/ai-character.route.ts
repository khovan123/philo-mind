import { Router } from "express";

import { authGuard, roleGuard } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createCharacterSchema,
  updateCharacterSchema,
  characterIdSchema,
} from "../validators/ai-character.validator.js";

import { aiCharacterController } from "../controllers/ai-character.controller.js";

export const aiCharacterRouter = Router();

aiCharacterRouter.get("/", (req, res, next) => aiCharacterController.getAll(req, res, next));

aiCharacterRouter.get("/:id", validate(characterIdSchema), (req, res, next) =>
  aiCharacterController.getById(req, res, next),
);

aiCharacterRouter.post(
  "/",
  authGuard,
  roleGuard("ADMIN"),
  validate(createCharacterSchema),
  (req, res, next) => aiCharacterController.create(req, res, next),
);

aiCharacterRouter.patch(
  "/:id",
  authGuard,
  roleGuard("ADMIN"),
  validate(updateCharacterSchema),
  (req, res, next) => aiCharacterController.update(req, res, next),
);

aiCharacterRouter.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN"),
  validate(characterIdSchema),
  (req, res, next) => aiCharacterController.delete(req, res, next),
);
