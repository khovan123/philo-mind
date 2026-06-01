import { Router } from "express";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiChatController } from "../controllers/ai-chat.controller.js";
import {
  createChatSessionSchema,
  listChatSessionsSchema,
  sendChatMessageSchema,
  sessionIdSchema,
} from "../validators/ai-chat.validator.js";

export const aiChatRouter = Router();

aiChatRouter.use(authGuard);

aiChatRouter.post(
  "/sessions",
  validate(createChatSessionSchema),
  (req, res, next) => aiChatController.create(req, res, next),
);

aiChatRouter.get(
  "/sessions",
  validate(listChatSessionsSchema),
  (req, res, next) => aiChatController.list(req, res, next),
);

aiChatRouter.get(
  "/sessions/:id/stream",
  validate(sessionIdSchema),
  (req, res, next) => aiChatController.get(req, res, next),
);

aiChatRouter.post(
  "/sessions/:id/messages",
  validate(sendChatMessageSchema),
  (req, res, next) => aiChatController.sendMessage(req, res, next),
);

export default aiChatRouter;
