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
const allowedOrigins = [
  "https://philo-mind-orpin.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8081",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(
  compression({
    level: 6, // balanced compression (1=fast, 9=best ratio)
    threshold: 1024, // skip bodies < 1KB
    filter: (req, res) => {
      // Don't compress if client sent Cache-Control: no-transform
      if (req.headers["cache-control"]?.includes("no-transform")) {
        return false;
      }
      // Fall back to the default filter (compresses text/* + json + xml)
      return compression.filter(req, res);
    },
  }),
);
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
let server: ReturnType<typeof app.listen> | undefined;
let keepAlive: ReturnType<typeof setInterval> | undefined;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    console.warn(`🚀 PhiloMind API running on http://localhost:${PORT}`);
  });
}

if (server) {
  keepAlive = setInterval(() => {
    // Keep the dev process alive in TSX/Windows shells that unref the HTTP server.
  }, 60 * 60 * 1000);

  server.on("close", () => {
    if (keepAlive) {
      clearInterval(keepAlive);
    }
  });
}

export default app;
export { keepAlive, server };
