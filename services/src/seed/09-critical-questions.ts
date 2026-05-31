/**
 * Seed: Critical Questions
 * Source: data/09-critical-questions.csv
 * Dependencies: Topic (matched by category)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, mapQuestionType, seedLog, seedSkip } from "./utils/index.js";

interface CriticalQuestionRow {
  chủ_đề: string;
  câu_hỏi: string;
  loại: string;
}

export async function seedCriticalQuestions(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.criticalQuestion.count();
  if (existing > 0) {
    seedSkip("CriticalQuestion", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<CriticalQuestionRow>("09-critical-questions.csv");
  let created = 0;

  for (const row of rows) {
    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ category: row.chủ_đề }, { title: { contains: row.chủ_đề } }],
      },
    });

    if (!topic) {
      console.warn(`    ⚠ No topic for: "${row.chủ_đề}" — skipping question`);
      continue;
    }

    await prisma.criticalQuestion.create({
      data: {
        topicId: topic.id,
        question: row.câu_hỏi,
        questionType: mapQuestionType(row.loại),
      },
    });
    created++;
  }

  seedLog("CriticalQuestion", created);
}
