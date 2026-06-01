/**
 * Seed: Mini Games (from Markdown files with frontmatter)
 * Source: data/11-minigames/*.md
 * Dependencies: Topic (optional)
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MINIGAMES_DIR = resolve(__dirname, "../../../data/11-minigames");

interface MiniGameFrontmatter {
  tên?: string;
  loại?: string;
  mô_tả?: string;
  thời_gian?: string;
  chủ_đề?: string;
}

function parseFrontmatter(
  rawContent: string,
): { metadata: MiniGameFrontmatter; body: string } | null {
  const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const metadata: MiniGameFrontmatter = {};
  for (const line of frontmatterMatch[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    metadata[key as keyof MiniGameFrontmatter] = value;
  }

  return {
    metadata,
    body: rawContent.slice(frontmatterMatch[0].length).trim(),
  };
}

function parseMarkdownTable(body: string): Record<string, string>[] {
  const rows = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));

  if (rows.length < 3) return [];

  const headers = rows[0]
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  return rows.slice(2).map((row) => {
    const cells = row
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

function parseGuessWho(body: string): { name: string; hints: string[]; answer: string }[] {
  const characters = [
    ...body.matchAll(/###\s+Nhân vật\s+\d+:\s*([\s\S]*?)(?=\n###\s+Nhân vật\s+\d+:|$)/g),
  ];
  return characters.map((match, index) => {
    const block = match[1];
    const hints = [...block.matchAll(/-\s+Gợi ý\s+\d+(?:\s+\([^)]+\))?:\s*(.+)/g)].map((hint) =>
      hint[1].trim(),
    );
    const answer = block.match(/-\s+Đáp án:\s*(.+)/)?.[1]?.trim() ?? "";
    return { name: `Nhân vật ${index + 1}`, hints, answer };
  });
}

export async function seedMiniGames(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.miniGame.count();
  if (existing > 0) {
    seedSkip("MiniGame", `already has ${existing} records`);
    return;
  }

  let files: string[] = [];
  try {
    files = readdirSync(MINIGAMES_DIR).filter((file) => file.endsWith(".md"));
  } catch {
    seedSkip("MiniGame", `directory not found: ${MINIGAMES_DIR}`);
    return;
  }

  let created = 0;

  for (const file of files) {
    const parsed = parseFrontmatter(readFileSync(resolve(MINIGAMES_DIR, file), "utf-8"));
    if (!parsed?.metadata.tên || !parsed.metadata.loại) {
      console.warn(`    ⚠ Missing minigame metadata in ${file} — skipping`);
      continue;
    }

    const topic = parsed.metadata.chủ_đề
      ? await prisma.topic.findFirst({
          where: {
            OR: [
              { title: { contains: parsed.metadata.chủ_đề } },
              { category: { contains: parsed.metadata.chủ_đề } },
            ],
          },
        })
      : null;

    const config =
      parsed.metadata.loại === "guess-who"
        ? { characters: parseGuessWho(parsed.body) }
        : { pairs: parseMarkdownTable(parsed.body), timeLimit: parsed.metadata.thời_gian ?? null };

    await prisma.miniGame.create({
      data: {
        topicId: topic?.id ?? null,
        title: parsed.metadata.tên,
        gameType: parsed.metadata.loại,
        description: parsed.metadata.mô_tả ?? null,
        config,
      },
    });

    created++;
  }

  seedLog("MiniGame", created);
}
