/**
 * PhiloMind · Seed Reset
 *
 * Truncates ALL seed-managed tables (in reverse-dependency order)
 * then re-runs the master seed.
 *
 * ⚠️ DESTRUCTIVE — development only!
 *
 * Usage: CONFIRM_SEED_RESET=RESET npx tsx src/seed/reset.ts
 */
import { prisma } from "../config/prisma.js";

const LOCAL_DATABASE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "postgres",
  "philo-postgres",
]);

// Tables to truncate in reverse-dependency order
const TABLES_TO_TRUNCATE = [
  "story_learn_card_tags",
  "story_learn_cards",
  "analysis_tabs",
  "story_decisions",
  "story_sessions",
  "story_consequences",
  "story_choices",
  "story_scenarios",
  "mini_game_attempts",
  "mini_games",
  "mindmap_edges",
  "mindmap_nodes",
  // Phase 3 deps
  "quiz_attempt_answers",
  "quiz_attempts",
  "quiz_options",
  "quiz_questions",
  "quizzes",
  "lesson_answers",
  "lesson_questions",
  "lessons",
  // Phase 2 deps
  "scenario_analyses",
  "scenario_responses",
  "real_life_scenarios",
  "short_lesson_comments",
  "short_lesson_responses",
  "short_lessons",
  "reflection_entries",
  "critical_questions",
  // Phase 1 (root)
  "ai_chat_messages",
  "ai_chat_sessions",
  "ai_characters",
  "user_badges",
  "badges",
  "topics",
  "users",
] as const;

async function resetSeedData() {
  const databaseUrl = process.env.DATABASE_URL;

  if (process.env.CONFIRM_SEED_RESET !== "RESET") {
    throw new Error("Refusing to reset seed data. Set CONFIRM_SEED_RESET=RESET explicitly.");
  }

  if (!databaseUrl || !LOCAL_DATABASE_HOSTS.has(new URL(databaseUrl).hostname)) {
    throw new Error("Refusing to reset seed data. DATABASE_URL must point to a local database.");
  }

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
