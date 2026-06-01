/**
 * Seed: 20 Critical Questions
 * Issue: #64 — T-C10
 *
 * Source: ./data/critical-questions.ts (inline TypeScript data)
 * Dependencies: Topic (matched by exact title)
 *
 * Question types: OPEN_TEXT | MORAL_DILEMMA | LOGIC (and others in Prisma enum)
 *
 * Idempotency: upsert on question text — safe to run multiple times.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import { CRITICAL_QUESTIONS } from "./data/critical-questions.js";

export async function seedCriticalQuestions(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of CRITICAL_QUESTIONS) {
    const topic = await prisma.topic.findFirst({
      where: { title: item.topicTitle },
    });

    if (!topic) {
      console.warn(`    ⚠ Topic not found: "${item.topicTitle}" — skipping critical question`);
      skipped++;
      continue;
    }

    const existing = await prisma.criticalQuestion.findFirst({
      where: { question: item.question },
    });

    if (existing) {
      await prisma.criticalQuestion.update({
        where: { id: existing.id },
        data: {
          topicId: topic.id,
          questionType: item.questionType,
        },
      });
      updated++;
    } else {
      await prisma.criticalQuestion.create({
        data: {
          topicId: topic.id,
          question: item.question,
          questionType: item.questionType,
        },
      });
      created++;
    }
  }

  const total = created + updated;
  if (total > 0) {
    seedLog("CriticalQuestion", total);
    if (created > 0 || updated > 0) {
      console.log(`    → ${created} created, ${updated} updated`);
    }
  }
  if (skipped > 0) {
    seedSkip("CriticalQuestion", `${skipped} skipped (topic not found)`);
  }
}

export { CRITICAL_QUESTIONS } from "./data/critical-questions.js";
export type { CriticalQuestionSeed } from "./data/critical-questions.js";
