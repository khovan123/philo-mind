/**
 * Seed: Story Scenarios (from Markdown files with frontmatter)
 * Source: data/05-stories/*.md
 * Dependencies: Topic
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PrismaClient } from "../prisma/generated/client.js";
import { mapDifficulty, seedLog, seedSkip } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STORIES_DIR = resolve(__dirname, "../../../data/05-stories");

interface StoryFrontmatter {
  chủ_đề?: string;
  tiêu_đề?: string;
  nhân_vật?: string;
  bối_cảnh_lịch_sử?: string;
  độ_khó?: string;
}

function parseFrontmatter(rawContent: string): { metadata: StoryFrontmatter; body: string } | null {
  const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const metadata: StoryFrontmatter = {};
  for (const line of frontmatterMatch[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    metadata[key as keyof StoryFrontmatter] = value;
  }

  return {
    metadata,
    body: rawContent.slice(frontmatterMatch[0].length).trim(),
  };
}

function extractSection(body: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = body.match(new RegExp(`## ${escapedHeading}\\s*([\\s\\S]*?)(?=\\n## |$)`));
  return match?.[1]?.trim() ?? "";
}

function cleanChoiceText(text: string): string {
  return text
    .replace(/^\s*###\s+Lựa chọn\s+\d+:\s*/i, "")
    .replace(/^["“”]/, "")
    .trim();
}

function parseChoices(body: string): { title: string; reasoningPrompt?: string }[] {
  const choicesSection = extractSection(body, "Lựa chọn");
  const matches = [
    ...choicesSection.matchAll(
      /###\s+Lựa chọn\s+\d+:[^\n]*\n([\s\S]*?)(?=\n###\s+Lựa chọn\s+\d+:|$)/g,
    ),
  ];

  return matches.map((match) => {
    const block = match[0].trim();
    const titleLine = block.split("\n")[0] ?? "";
    const promptMatch = block.match(/>\s*💭\s*\*?Gợi ý suy nghĩ:\s*([\s\S]*?)\*?\s*$/m);

    return {
      title: cleanChoiceText(titleLine),
      reasoningPrompt: promptMatch?.[1]?.trim(),
    };
  });
}

function parseConsequenceBlocks(body: string): string[] {
  const consequencesSection = extractSection(body, "Hậu quả");
  return [
    ...consequencesSection.matchAll(
      /###\s+Nếu chọn\s+\d+[^\n]*\n([\s\S]*?)(?=\n###\s+Nếu chọn\s+\d+|$)/g,
    ),
  ].map((match) => match[1].trim());
}

function extractBoldSection(block: string, label: string): string | undefined {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(
    new RegExp(`\\*\\*${escapedLabel}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[^*]+:\\*\\*|$)`),
  );
  return match?.[1]?.trim();
}

function extractPhilosophicalAnalysis(block: string): string | undefined {
  const match = block.match(
    /\*\*Phân tích triết học(?:\s*\([^)]+\))?:\*\*\s*([\s\S]*?)(?=\n\*\*[^*]+:\*\*|$)/,
  );
  return match?.[1]?.trim();
}

export async function seedStories(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.storyScenario.count();
  if (existing > 0) {
    seedSkip("StoryScenario", `already has ${existing} records`);
    return;
  }

  let files: string[] = [];
  try {
    files = readdirSync(STORIES_DIR).filter((file) => file.endsWith(".md"));
  } catch {
    seedSkip("StoryScenario", `directory not found: ${STORIES_DIR}`);
    return;
  }

  let created = 0;

  for (const file of files) {
    const parsed = parseFrontmatter(readFileSync(resolve(STORIES_DIR, file), "utf-8"));
    if (!parsed?.metadata.chủ_đề || !parsed.metadata.tiêu_đề) {
      console.warn(`    ⚠ Missing story metadata in ${file} — skipping`);
      continue;
    }

    const topic = await prisma.topic.findFirst({
      where: {
        OR: [
          { title: { contains: parsed.metadata.chủ_đề } },
          { category: { contains: parsed.metadata.chủ_đề } },
        ],
      },
    });

    if (!topic) {
      console.warn(`    ⚠ No topic found for story "${parsed.metadata.tiêu_đề}" — skipping`);
      continue;
    }

    const choices = parseChoices(parsed.body);
    const consequenceBlocks = parseConsequenceBlocks(parsed.body);

    await prisma.storyScenario.create({
      data: {
        topicId: topic.id,
        title: parsed.metadata.tiêu_đề,
        description: extractSection(parsed.body, "Tình huống"),
        characterRole: parsed.metadata.nhân_vật ?? null,
        historicalContext: parsed.metadata.bối_cảnh_lịch_sử ?? null,
        difficulty: mapDifficulty(parsed.metadata.độ_khó ?? "Dễ"),
        choices: {
          create: choices.map((choice, index) => {
            const block = consequenceBlocks[index] ?? "";
            return {
              choiceText: choice.title,
              reasoningPrompt: choice.reasoningPrompt ?? null,
              consequences: {
                create: {
                  resultText: extractBoldSection(block, "Kết quả") ?? "",
                  ethicalAnalysis: extractBoldSection(block, "Phân tích đạo đức") ?? null,
                  philosophicalAnalysis: extractPhilosophicalAnalysis(block) ?? null,
                  politicalEconomicAnalysis:
                    extractBoldSection(block, "Phân tích chính trị - xã hội") ?? null,
                  historicalImpact: extractBoldSection(block, "Bối cảnh lịch sử") ?? null,
                },
              },
            };
          }),
        },
      },
    });

    created++;
  }

  seedLog("StoryScenario", created);
}
