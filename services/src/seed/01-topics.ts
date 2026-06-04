/**
 * Seed: Topics
 * Source: data/01-topics.csv
 * Dependencies: none (root entity)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, mapDifficulty, seedLog, seedSkip } from "./utils/index.js";

interface TopicRow {
  tên_chủ_đề: string;
  mô_tả: string;
  phân_loại: string;
  độ_khó: string;
}

export async function seedTopics(prisma: PrismaClient): Promise<void> {
  const rows = readCsv<TopicRow>("01-topics.csv");
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const existing = await prisma.topic.findFirst({
      where: { title: row.tên_chủ_đề },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.topic.create({
      data: {
        title: row.tên_chủ_đề,
        description: row.mô_tả,
        category: row.phân_loại,
        difficulty: mapDifficulty(row.độ_khó),
      },
    });
    created++;
  }

  if (created > 0) {
    seedLog("Topic", created);
  }
  if (skipped > 0) {
    seedSkip("Topic", `${skipped} records already exist`);
  }
}
