/**
 * Seed: AI Characters
 * Source: data/06-ai-characters.csv
 * Dependencies: none
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, seedLog, seedSkip } from "./utils/index.js";

interface AiCharacterRow {
  tên: string;
  loại: string;
  tiểu_sử: string;
  thế_giới_quan: string;
  cách_nói_chuyện: string;
  phạm_vi_kiến_thức: string;
}

export async function seedAiCharacters(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.aiCharacter.count();
  if (existing > 0) {
    seedSkip("AiCharacter", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<AiCharacterRow>("06-ai-characters.csv");

  for (const row of rows) {
    await prisma.aiCharacter.create({
      data: {
        name: row.tên,
        type: row.loại,
        bio: row.tiểu_sử,
        worldview: row.thế_giới_quan,
        // Combine speech style + knowledge into prompt instruction
        promptInstruction: [
          `Cách nói chuyện: ${row.cách_nói_chuyện}`,
          `Phạm vi kiến thức: ${row.phạm_vi_kiến_thức}`,
        ].join("\n\n"),
      },
    });
  }

  seedLog("AiCharacter", rows.length);
}
