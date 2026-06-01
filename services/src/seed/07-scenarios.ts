/**
 * Seed: Real Life Scenarios + Scenario Analyses
 * Source: data/07-scenarios.csv
 * Dependencies: Topic (matched by category)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, seedLog, seedSkip } from "./utils/index.js";

interface ScenarioRow {
  chủ_đề: string;
  tiêu_đề: string;
  tình_huống: string;
  bối_cảnh: string;
  phân_tích_thực_dụng: string;
  phân_tích_nghĩa_vụ: string;
  phân_tích_đức_hạnh: string;
  phân_tích_quan_tâm: string;
}

export async function seedScenarios(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.realLifeScenario.count();
  if (existing > 0) {
    seedSkip("RealLifeScenario", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<ScenarioRow>("07-scenarios.csv");
  let created = 0;

  for (const row of rows) {
    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ category: row.chủ_đề }, { title: { contains: row.chủ_đề } }],
      },
    });

    if (!topic) {
      console.warn(
        `    ⚠ No topic for category: "${row.chủ_đề}" — skipping scenario "${row.tiêu_đề}"`,
      );
      continue;
    }

    // Create scenario with pre-built perspectives
    const perspectives = [
      { type: "thực_dụng", content: row.phân_tích_thực_dụng },
      { type: "nghĩa_vụ", content: row.phân_tích_nghĩa_vụ },
      { type: "đức_hạnh", content: row.phân_tích_đức_hạnh },
      { type: "quan_tâm", content: row.phân_tích_quan_tâm },
    ].filter((p) => p.content?.trim());

    await prisma.realLifeScenario.create({
      data: {
        topicId: topic.id,
        title: row.tiêu_đề,
        situation: row.tình_huống,
        context: row.bối_cảnh,
        perspectives: {
          create: perspectives.map((p) => ({
            perspectiveType: p.type,
            content: p.content,
          })),
        },
      },
    });
    created++;
  }

  seedLog("RealLifeScenario", created);
}
