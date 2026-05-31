import { Router } from "express";
import { mindmapController } from "../controllers/mindmap.controller.js";
import { authGuard, roleGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createMindmapEdgeSchema,
  createMindmapNodeSchema,
  edgeIdSchema,
  nodeIdSchema,
  topicIdSchema,
  updateMindmapEdgeSchema,
  updateMindmapNodeSchema,
} from "../validators/mindmap.validator.js";

// ── T-A13: Mindmap Routes ────────────────────────────────────

export const mindmapRouter = Router();

mindmapRouter.use(authGuard);

mindmapRouter.get("/topics/:topicId", validate(topicIdSchema), (req, res, next) =>
  mindmapController.getGraphByTopic(req, res, next),
);

mindmapRouter.post(
  "/nodes",
  roleGuard("ADMIN"),
  validate(createMindmapNodeSchema),
  (req, res, next) => mindmapController.createNode(req, res, next),
);

mindmapRouter.patch(
  "/nodes/:id",
  roleGuard("ADMIN"),
  validate(updateMindmapNodeSchema),
  (req, res, next) => mindmapController.updateNode(req, res, next),
);

mindmapRouter.delete("/nodes/:id", roleGuard("ADMIN"), validate(nodeIdSchema), (req, res, next) =>
  mindmapController.deleteNode(req, res, next),
);

mindmapRouter.post(
  "/edges",
  roleGuard("ADMIN"),
  validate(createMindmapEdgeSchema),
  (req, res, next) => mindmapController.createEdge(req, res, next),
);

mindmapRouter.patch(
  "/edges/:id",
  roleGuard("ADMIN"),
  validate(updateMindmapEdgeSchema),
  (req, res, next) => mindmapController.updateEdge(req, res, next),
);

mindmapRouter.delete("/edges/:id", roleGuard("ADMIN"), validate(edgeIdSchema), (req, res, next) =>
  mindmapController.deleteEdge(req, res, next),
);
