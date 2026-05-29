import { env } from "./config/env.js"; // must be first — validates env on load
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { healthRouter } from "./routes/health.js";
import { apiRouter } from "./routes/api.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

const app = express();
const PORT = env.PORT;

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use("/health", healthRouter);
app.use("/api/v1", apiRouter);

// ── Error Handling ─────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.warn(`🚀 PhiloMind API running on http://localhost:${PORT}`);
});

export default app;
