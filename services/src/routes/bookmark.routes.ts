import { Router } from "express";
import { bookmarkController } from "../controllers/bookmark.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  bookmarkIdSchema,
  bookmarkStatusSchema,
  listBookmarksSchema,
  toggleBookmarkSchema,
} from "../validators/bookmark.validator.js";

// ── T-A14: Bookmark Routes ───────────────────────────────────

export const bookmarkRouter = Router();

bookmarkRouter.use(authGuard);

bookmarkRouter.get("/", validate(listBookmarksSchema), (req, res, next) =>
  bookmarkController.list(req, res, next),
);

bookmarkRouter.get("/status", validate(bookmarkStatusSchema), (req, res, next) =>
  bookmarkController.getStatus(req, res, next),
);

bookmarkRouter.post("/toggle", validate(toggleBookmarkSchema), (req, res, next) =>
  bookmarkController.toggle(req, res, next),
);

bookmarkRouter.delete("/:id", validate(bookmarkIdSchema), (req, res, next) =>
  bookmarkController.delete(req, res, next),
);
