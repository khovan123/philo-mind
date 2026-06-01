/**
 * Seed: 5 AI Characters — prompts + bios
 * Issue: #62 — T-C08
 *
 * Source: ./data/ai-characters.ts (inline TypeScript data)
 * Dependencies: none
 *
 * Records seeded:
 *   - AiCharacter (upsert by name — stable key for demo/test)
 *
 * Idempotency: upsert on name — safe to run multiple times; preserves existing UUIDs.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog } from "./utils/index.js";
import { AI_CHARACTERS } from "./data/ai-characters.js";

const SAFETY_PREFIX = [
  "Bạn đang đóng vai nhân vật triết học trong ứng dụng học tập PhiloMind.",
  "Trả lời bằng tiếng Việt trừ khi người dùng yêu cầu ngôn ngữ khác.",
  "Mục tiêu: giáo dục, kích thích tư duy phản biện — không cổ vũ bạo lực, thù hận, tự hại hoặc thông tin y khoa/pháp lý chuyên sâu.",
  "Nếu câu hỏi ngoài phạm vi chuyên môn, hãy thừa nhận giới hạn và hướng người học quay lại khái niệm triết học liên quan.",
].join("\n");

function buildPromptInstruction(speechStyle: string, knowledgeScope: string): string {
  return [
    SAFETY_PREFIX,
    `Cách nói chuyện: ${speechStyle}`,
    `Phạm vi kiến thức: ${knowledgeScope}`,
  ].join("\n\n");
}

export async function seedAiCharacters(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let updated = 0;

  for (const character of AI_CHARACTERS) {
    const promptInstruction = buildPromptInstruction(
      character.speechStyle,
      character.knowledgeScope,
    );

    const existing = await prisma.aiCharacter.findFirst({
      where: { name: character.name },
    });

    if (existing) {
      await prisma.aiCharacter.update({
        where: { id: existing.id },
        data: {
          type: character.type,
          bio: character.bio,
          worldview: character.worldview,
          promptInstruction,
        },
      });
      updated++;
    } else {
      await prisma.aiCharacter.create({
        data: {
          name: character.name,
          type: character.type,
          bio: character.bio,
          worldview: character.worldview,
          promptInstruction,
        },
      });
      created++;
    }
  }

  seedLog("AiCharacter", AI_CHARACTERS.length);
  if (created > 0 || updated > 0) {
    console.log(`    → ${created} created, ${updated} updated`);
  }
}

// Re-export for tests and consumers
export { AI_CHARACTERS } from "./data/ai-characters.js";
