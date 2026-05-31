/**
 * ══════════════════════════════════════════════
 * PhiloMind · Master Seed Runner
 * ══════════════════════════════════════════════
 *
 * Reads CSV files from project-root/data/ and seeds them
 * into the database in dependency-safe order.
 *
 * Usage:
 *   npm run seed               (idempotent — skips existing data)
 *   npm run seed:reset          (truncate + re-seed)
 *
 * Each seed function checks if records already exist before inserting.
 * Safe to run multiple times.
 */
/* eslint-disable no-console */
import { prisma } from "../config/prisma.js";
import { seedHeader } from "./utils/index.js";

// ─── Seed modules (dependency order) ──────────────────
import { seedTopics } from "./01-topics.js";
import { seedShortLessons } from "./02-short-lessons.js";
import { seedLessons } from "./03-lessons.js";
import { seedQuizzes } from "./04-quizzes.js";
import { seedAiCharacters } from "./06-ai-characters.js";
import { seedScenarios } from "./07-scenarios.js";
import { seedDebates } from "./08-debates.js";
import { seedCriticalQuestions } from "./09-critical-questions.js";
import { seedBadges } from "./10-badges.js";

async function main() {
  console.log("\n🌱 PhiloMind Seed Runner");
  console.log("═".repeat(50));

  const start = Date.now();

  // ── Phase 1: Independent entities (no FK dependencies) ──
  seedHeader("Phase 1 — Root Entities");
  await seedTopics(prisma);
  await seedAiCharacters(prisma);
  await seedBadges(prisma);

  // ── Phase 2: Topic-dependent entities ────────────────────
  seedHeader("Phase 2 — Topic-Dependent");
  await seedShortLessons(prisma);
  await seedLessons(prisma);
  await seedScenarios(prisma);
  await seedDebates(prisma);
  await seedCriticalQuestions(prisma);

  // ── Phase 3: Lesson-dependent (needs Lesson records) ─────
  seedHeader("Phase 3 — Lesson-Dependent");
  await seedQuizzes(prisma);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n${"═".repeat(50)}`);
  console.log(`✅ Seed completed in ${elapsed}s\n`);
}

main()
  .catch((err) => {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
