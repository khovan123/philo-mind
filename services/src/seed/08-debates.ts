/**
 * Seed: 10 Debates
 * Issue: #64 — T-C10
 *
 * Source: ./data/debates.ts (inline TypeScript data)
 * Dependencies: Topic (matched by exact title)
 *
 * Idempotency: upsert on title — safe to run multiple times; preserves debate UUIDs.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import { DEBATES } from "./data/debates.js";

export async function seedDebates(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const debate of DEBATES) {
    const topic = await prisma.topic.findFirst({
      where: { title: debate.topicTitle },
    });

    if (!topic) {
      console.warn(
        `    ⚠ Topic not found: "${debate.topicTitle}" — skipping debate "${debate.title}"`,
      );
      skipped++;
      continue;
    }

    const existing = await prisma.debate.findFirst({
      where: { title: debate.title },
    });

    if (existing) {
      await prisma.debate.update({
        where: { id: existing.id },
        data: {
          topicId: topic.id,
          description: debate.description,
          status: debate.status ?? "OPEN",
        },
      });
      updated++;
    } else {
      await prisma.debate.create({
        data: {
          topicId: topic.id,
          title: debate.title,
          description: debate.description,
          status: debate.status ?? "OPEN",
        },
      });
      created++;
    }
  }

  const total = created + updated;
  if (total > 0) {
    seedLog("Debate", total);
    if (created > 0 || updated > 0) {
      console.log(`    → ${created} created, ${updated} updated`);
    }
  }
  if (skipped > 0) {
    seedSkip("Debate", `${skipped} skipped (topic not found)`);
  }
}

export { DEBATES } from "./data/debates.js";
export type { DebateSeed } from "./data/debates.js";
