/**
 * PhiloMind · Seed Reset
 *
 * Truncates ALL seed-managed tables (in reverse-dependency order)
 * then re-runs the master seed.
 *
 * ⚠️ DESTRUCTIVE — development only!
 *
 * Usage: npm run seed:reset
 */
/* eslint-disable no-console */
import { PrismaClient } from "../prisma/generated/client.js";

const prisma = new PrismaClient();

// Tables to truncate in reverse-dependency order
const TABLES_TO_TRUNCATE = [
  // Phase 3 deps
  "quiz_attempt_answers",
  "quiz_attempts",
  "quiz_options",
  "quiz_questions",
  "quizzes",
  // Phase 2 deps
  "scenario_analyses",
  "scenario_responses",
  "real_life_scenarios",
  "short_lesson_comments",
  "short_lesson_responses",
  "short_lessons",
  "debate_votes",
  "debate_comments",
  "debate_arguments",
  "debates",
  "reflection_entries",
  "critical_questions",
  // Phase 1 (root)
  "ai_chat_messages",
  "ai_chat_sessions",
  "ai_characters",
  "user_badges",
  "badges",
  "topics",
] as const;

async function resetSeedData() {
  console.log("\n🗑️  PhiloMind Seed Reset");
  console.log("═".repeat(50));
  console.log("⚠️  Truncating seed-managed tables...\n");

  for (const table of TABLES_TO_TRUNCATE) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
      console.log(`  ✔ ${table}`);
    } catch {
      // Table might not exist yet (pre-migration)
      console.log(`  ⊘ ${table} (not found)`);
    }
  }

  console.log("\n✅ Reset complete. Run `npm run seed` to re-populate.\n");
}

resetSeedData()
  .catch((err) => {
    console.error("\n❌ Reset failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
