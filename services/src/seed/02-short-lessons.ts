/**
 * Seed: Short Lessons
 * Source: data/02-short-lessons.csv
 * Dependencies: Topic (matched by category)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, seedLog, seedSkip } from "./utils/index.js";

interface ShortLessonRow {
  chủ_đề: string;
  tiêu_đề: string;
  hook: string;
  insight: string;
  conflict: string;
  quan_điểm_A: string;
  quan_điểm_B: string;
}

export async function seedShortLessons(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.shortLesson.count();
  if (existing > 0) {
    seedSkip("ShortLesson", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<ShortLessonRow>("02-short-lessons.csv");
  let created = 0;

  for (const row of rows) {
    // Find topic by category (chủ_đề column matches topic.category)
    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ category: row.chủ_đề }, { title: { contains: row.chủ_đề } }],
      },
    });

    if (!topic) {
      console.warn(
        `    ⚠ No topic found for category: "${row.chủ_đề}" — skipping "${row.tiêu_đề}"`,
      );
      continue;
    }

    await prisma.shortLesson.create({
      data: {
        topicId: topic.id,
        title: row.tiêu_đề,
        hook: row.hook,
        insight: row.insight,
        conflict: row.conflict,
        stanceA: row.quan_điểm_A,
        stanceB: row.quan_điểm_B,
      },
    });
    created++;
  }

  seedLog("ShortLesson", created);
}
