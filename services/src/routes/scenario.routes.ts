import { Router } from "express";
import { scenarioController } from "../controllers/scenario.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  listScenariosSchema,
  getScenarioDetailSchema,
  respondScenarioSchema,
  rethinkScenarioSchema,
} from "../validators/scenario.validator.js";

// ── T-F02: Scenario Routes ────────────────────────────────────

export const scenarioRouter = Router();

// GET /api/v1/scenarios — list scenarios (paginated & filtered)
scenarioRouter.get("/", validate(listScenariosSchema), (req, res, next) =>
  scenarioController.list(req, res, next),
);

// GET /api/v1/scenarios/:id — get scenario detail
scenarioRouter.get("/:id", validate(getScenarioDetailSchema), (req, res, next) =>
  scenarioController.getDetail(req, res, next),
);

// POST /api/v1/scenarios/:id/respond — submit initial stance response
scenarioRouter.post("/:id/respond", authGuard, validate(respondScenarioSchema), (req, res, next) =>
  scenarioController.respond(req, res, next),
);

// PATCH /api/v1/scenarios/:id/rethink — submit revised stance response
scenarioRouter.patch("/:id/rethink", authGuard, validate(rethinkScenarioSchema), (req, res, next) =>
  scenarioController.rethink(req, res, next),
);
