import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { healthRouter } from "./routes/health.js";
import { apiRouter } from "./routes/api.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use("/health", healthRouter);
app.use("/api/v1", apiRouter);

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 PhiloMind API running on http://localhost:${PORT}`);
});

export default app;
