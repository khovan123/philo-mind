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
 *
 * Each seed function checks if records already exist before inserting.
 * Safe to run multiple times.
 */
import { prisma } from "../config/prisma.js";
import { seedHeader } from "./utils/index.js";

// ─── Seed modules (dependency order) ──────────────────
import { seedUsers } from "./00-users.js";
import { seedTopics } from "./01-topics.js";
import { seedShortLessons } from "./02-short-lessons.js";
import { seedLessons } from "./03-lessons.js";
import { seedQuizzes } from "./04-quizzes.js";
import { seedStories } from "./05-stories.js";
import { seedCriticalQuestions } from "./09-critical-questions.js";
import { seedBadges } from "./10-badges.js";
import { seedTopicPerspectives } from "./11-topic-perspectives.js";
import { seedMiniGames } from "./11-minigames.js";
import { seedMindmaps } from "./12-mindmaps.js";
import { seedChapter01 } from "./13-chapter-01.js";
import { seedChapterMovies } from "./14-chapter-movies.js";

async function main() {
  console.log("\n🌱 PhiloMind Seed Runner");
  console.log("═".repeat(50));

  const start = Date.now();

  // ── Phase 1: Independent entities (no FK dependencies) ──
  seedHeader("Phase 1 — Root Entities");
  await seedUsers(prisma);
  await seedTopics(prisma);
  await seedBadges(prisma);

  // ── Phase 2: Topic-dependent entities ────────────────────
  seedHeader("Phase 2 — Topic-Dependent");
  await seedShortLessons(prisma);
  await seedLessons(prisma);
  await seedCriticalQuestions(prisma);
  await seedTopicPerspectives(prisma);
  await seedStories(prisma);
  await seedMiniGames(prisma);
  await seedMindmaps(prisma);

  // ── Phase 3: Lesson-dependent (needs Lesson records) ─────
  seedHeader("Phase 3 — Lesson-Dependent");
  await seedQuizzes(prisma);

  // ── Phase 4: Chapter 1 canonical content (self-contained) ─
  seedHeader("Phase 4 — Chapter 1 Canonical Content");
  await seedChapter01(prisma);

  // ── Phase 5: Chapter Movies & Nodes ─────────────────────────
  seedHeader("Phase 5 — Chapter Nodes & Movies");
  await seedChapterMovies(prisma);

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
