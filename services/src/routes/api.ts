import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    message: "PhiloMind API v1",
    version: "1.0.0",
  });
});
