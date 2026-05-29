import { z } from "zod";
import "dotenv/config";

// ── T-I02: Environment Configuration with Zod Validation ───
// Fail-fast: server crashes immediately if env vars are missing/invalid

const envSchema = z.object({
  // ─── Server ────────────────────────────────────────────────
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // ─── Database ──────────────────────────────────────────────
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),

  // ─── JWT / Auth ────────────────────────────────────────────
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // ─── AI / Gemini ───────────────────────────────────────────
  GEMINI_API_KEY: z.string().optional(),

  // ─── Storage (Cloudinary / S3) ─────────────────────────────
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // ─── Email (SMTP) ──────────────────────────────────────────
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // ─── Logging ───────────────────────────────────────────────
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

// Parse & validate — throws on invalid config
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

// Re-export typed helpers
export type Env = z.infer<typeof envSchema>;
