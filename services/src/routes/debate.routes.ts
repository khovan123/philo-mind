import { Router } from "express";
import { debateController } from "../controllers/debate.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listDebatesSchema,
  getDebateDetailSchema,
  createArgumentSchema,
  voteArgumentSchema,
  createCommentSchema,
} from "../validators/debate.validator.js";

// ── T-F05: Debate Routes ──────────────────────────────────────────

export const debateRouter = Router();
export const debateArgumentRouter = Router();

// ── Debates Endpoints ──

// GET /api/v1/debates — list debates (paginated & filtered)
debateRouter.get("/", validate(listDebatesSchema), (req, res, next) =>
  debateController.list(req, res, next),
);

// GET /api/v1/debates/:id — get debate detail
debateRouter.get("/:id", validate(getDebateDetailSchema), (req, res, next) =>
  debateController.getDetail(req, res, next),
);

// POST /api/v1/debates/:id/arguments — post a new argument
debateRouter.post("/:id/arguments", authGuard, validate(createArgumentSchema), (req, res, next) =>
  debateController.createArgument(req, res, next),
);

// ── Debate Arguments Endpoints ──

// POST /api/v1/debate-arguments/:id/votes — vote on an argument
debateArgumentRouter.post("/:id/votes", authGuard, validate(voteArgumentSchema), (req, res, next) =>
  debateController.vote(req, res, next),
);

// POST /api/v1/debate-arguments/:id/comments — comment on an argument
debateArgumentRouter.post("/:id/comments", authGuard, validate(createCommentSchema), (req, res, next) =>
  debateController.createComment(req, res, next),
);
