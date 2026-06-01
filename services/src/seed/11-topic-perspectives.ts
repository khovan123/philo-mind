/**
 * Seed: Topic Perspectives (5 types per topic)
 * Issue: #66 — T-C12
 *
 * Source: ./data/topic-perspectives.ts (inline TypeScript data)
 * Dependencies: Topic (matched by exact title)
 *
 * Types seeded: TECH | ETHICAL | ECONOMIC | SOCIAL | PHILOSOPHICAL
 *
 * Idempotency: upsert on (topicId, perspectiveType) — safe to run multiple times.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import { TOPIC_PERSPECTIVES } from "./data/topic-perspectives.js";

export async function seedTopicPerspectives(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let updated = 0;
  let skippedTopics = 0;

  for (const entry of TOPIC_PERSPECTIVES) {
    const topic = await prisma.topic.findFirst({
      where: { title: entry.topicTitle },
    });

    if (!topic) {
      console.warn(`    ⚠ Topic not found: "${entry.topicTitle}" — skipping perspectives`);
      skippedTopics++;
      continue;
    }

    for (const perspective of entry.perspectives) {
      const existing = await prisma.topicPerspective.findUnique({
        where: {
          topicId_perspectiveType: {
            topicId: topic.id,
            perspectiveType: perspective.perspectiveType,
          },
        },
      });

      await prisma.topicPerspective.upsert({
        where: {
          topicId_perspectiveType: {
            topicId: topic.id,
            perspectiveType: perspective.perspectiveType,
          },
        },
        update: { content: perspective.content },
        create: {
          topicId: topic.id,
          perspectiveType: perspective.perspectiveType,
          content: perspective.content,
        },
      });

      if (existing) {
        updated++;
      } else {
        created++;
      }
    }
  }

  const total = created + updated;
  if (total > 0) {
    seedLog("TopicPerspective", total);
    if (created > 0 || updated > 0) {
      console.log(`    → ${created} created, ${updated} updated`);
    }
  }

  if (skippedTopics > 0) {
    seedSkip("TopicPerspective", `${skippedTopics} topics skipped (not found)`);
  }
}

export { TOPIC_PERSPECTIVES, PERSPECTIVE_TYPES } from "./data/topic-perspectives.js";
export type {
  TopicPerspectiveEntrySeed,
  TopicPerspectivesSeed,
} from "./data/topic-perspectives.js";
