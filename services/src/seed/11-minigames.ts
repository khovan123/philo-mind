/**
 * Seed: 5 MiniGames (matching, guess-who, logic-puzzle)
 * Issue: #65 — T-C11
 *
 * Source: ./data/minigames.ts (inline TypeScript data)
 * Dependencies: Topic (optional, matched by exact title)
 *
 * Idempotency: upsert on title — safe to run multiple times; preserves mini game UUIDs.
 */
import type { Prisma } from "../prisma/generated/client.js";
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import { MINI_GAMES } from "./data/minigames.js";

export async function seedMiniGames(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const game of MINI_GAMES) {
    let topicId: string | null = null;

    if (game.topicTitle) {
      const topic = await prisma.topic.findFirst({
        where: { title: game.topicTitle },
      });

      if (!topic) {
        console.warn(
          `    ⚠ Topic not found: "${game.topicTitle}" — skipping minigame "${game.title}"`,
        );
        skipped++;
        continue;
      }

      topicId = topic.id;
    }

    const existing = await prisma.miniGame.findFirst({
      where: { title: game.title },
    });

    const data = {
      topicId,
      title: game.title,
      gameType: game.gameType,
      description: game.description,
      config: game.config as Prisma.InputJsonValue,
    };

    if (existing) {
      await prisma.miniGame.update({
        where: { id: existing.id },
        data,
      });
      updated++;
    } else {
      await prisma.miniGame.create({ data });
      created++;
    }
  }

  const total = created + updated;
  if (total > 0) {
    seedLog("MiniGame", total);
    if (created > 0 || updated > 0) {
      console.log(`    → ${created} created, ${updated} updated`);
    }
    const byType = MINI_GAMES.reduce(
      (acc, g) => {
        acc[g.gameType] = (acc[g.gameType] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    console.log(
      `    → types: ${Object.entries(byType)
        .map(([type, count]) => `${type}=${count}`)
        .join(", ")}`,
    );
  }

  if (skipped > 0) {
    seedSkip("MiniGame", `${skipped} skipped (topic not found)`);
  }
}

export { MINI_GAMES } from "./data/minigames.js";
export type { MiniGameSeed } from "./data/minigames.js";
