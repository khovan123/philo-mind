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
  const existing = await prisma.topic.count();
  if (existing > 0) {
    seedSkip("Topic", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<TopicRow>("01-topics.csv");

  for (const row of rows) {
    await prisma.topic.create({
      data: {
        title: row.tên_chủ_đề,
        description: row.mô_tả,
        category: row.phân_loại,
        difficulty: mapDifficulty(row.độ_khó),
      },
    });
  }

  seedLog("Topic", rows.length);
}
