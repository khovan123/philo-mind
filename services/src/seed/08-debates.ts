/**
 * Seed: Debates
 * Source: data/08-debates.csv
 * Dependencies: Topic (matched by category)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, seedLog, seedSkip } from "./utils/index.js";

interface DebateRow {
  chủ_đề: string;
  tiêu_đề: string;
  mô_tả: string;
}

export async function seedDebates(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.debate.count();
  if (existing > 0) {
    seedSkip("Debate", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<DebateRow>("08-debates.csv");
  let created = 0;

  for (const row of rows) {
    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ category: row.chủ_đề }, { title: { contains: row.chủ_đề } }],
      },
    });

    if (!topic) {
      console.warn(`    ⚠ No topic for: "${row.chủ_đề}" — skipping debate "${row.tiêu_đề}"`);
      continue;
    }

    await prisma.debate.create({
      data: {
        topicId: topic.id,
        title: row.tiêu_đề,
        description: row.mô_tả,
        status: "OPEN",
      },
    });
    created++;
  }

  seedLog("Debate", created);
}
