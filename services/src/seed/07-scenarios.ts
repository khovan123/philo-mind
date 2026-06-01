/**
 * Seed: 10 Real-life Scenarios (4 perspectives + frameworks each)
 * Issue: #63 — T-C09
 *
 * Source: ./data/real-life-scenarios.ts (inline TypeScript data)
 * Dependencies: Topic (matched by exact title)
 *
 * Records seeded:
 *   - RealLifeScenario    (upsert by title — stable key for demo/test)
 *   - ScenarioPerspective (delete + re-create per scenario for idempotency)
 *   - ScenarioFramework   (delete + re-create per scenario for idempotency)
 *
 * Idempotency: upsert on title — safe to run multiple times; preserves scenario UUIDs.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import { REAL_LIFE_SCENARIOS } from "./data/real-life-scenarios.js";

export async function seedScenarios(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const scenario of REAL_LIFE_SCENARIOS) {
    const topic = await prisma.topic.findFirst({
      where: { title: scenario.topicTitle },
    });

    if (!topic) {
      console.warn(
        `    ⚠ Topic not found: "${scenario.topicTitle}" — skipping scenario "${scenario.title}"`,
      );
      skipped++;
      continue;
    }

    const existing = await prisma.realLifeScenario.findFirst({
      where: { title: scenario.title },
    });

    let scenarioId: string;

    if (existing) {
      await prisma.realLifeScenario.update({
        where: { id: existing.id },
        data: {
          topicId: topic.id,
          situation: scenario.situation,
          context: scenario.context,
        },
      });
      scenarioId = existing.id;
      updated++;
    } else {
      const record = await prisma.realLifeScenario.create({
        data: {
          topicId: topic.id,
          title: scenario.title,
          situation: scenario.situation,
          context: scenario.context,
        },
      });
      scenarioId = record.id;
      created++;
    }

    await prisma.scenarioPerspective.deleteMany({ where: { scenarioId } });
    await prisma.scenarioFramework.deleteMany({ where: { scenarioId } });

    if (scenario.perspectives.length > 0) {
      await prisma.scenarioPerspective.createMany({
        data: scenario.perspectives.map((p) => ({
          scenarioId,
          perspectiveType: p.perspectiveType,
          content: p.content,
        })),
      });
    }

    if (scenario.frameworks.length > 0) {
      await prisma.scenarioFramework.createMany({
        data: scenario.frameworks.map((f) => ({
          scenarioId,
          name: f.name,
          description: f.description ?? null,
          content: f.content,
        })),
      });
    }
  }

  const total = created + updated;
  if (total > 0) {
    seedLog("RealLifeScenario", total);
    if (created > 0 || updated > 0) {
      console.log(`    → ${created} created, ${updated} updated`);
    }
    const perspectiveCount = REAL_LIFE_SCENARIOS.reduce((n, s) => n + s.perspectives.length, 0);
    const frameworkCount = REAL_LIFE_SCENARIOS.reduce((n, s) => n + s.frameworks.length, 0);
    seedLog("ScenarioPerspective", perspectiveCount);
    seedLog("ScenarioFramework", frameworkCount);
  }

  if (skipped > 0) {
    seedSkip("RealLifeScenario", `${skipped} skipped (topic not found)`);
  }
}

export { REAL_LIFE_SCENARIOS } from "./data/real-life-scenarios.js";
export type {
  RealLifeScenarioSeed,
  ScenarioFrameworkSeed,
  ScenarioPerspectiveSeed,
  ScenarioPerspectiveType,
} from "./data/real-life-scenarios.js";
