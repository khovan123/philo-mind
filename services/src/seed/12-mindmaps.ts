/**
 * Seed: Mindmaps (from Markdown files with frontmatter and tables)
 * Source: data/12-mindmaps/*.md
 * Dependencies: Topic
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MINDMAPS_DIR = resolve(__dirname, "../../../data/12-mindmaps");

interface MindmapFrontmatter {
  chủ_đề?: string;
}

function parseFrontmatter(
  rawContent: string,
): { metadata: MindmapFrontmatter; body: string } | null {
  const frontmatterMatch = rawContent.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const metadata: MindmapFrontmatter = {};
  for (const line of frontmatterMatch[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    metadata[key as keyof MindmapFrontmatter] = value;
  }

  return {
    metadata,
    body: rawContent.slice(frontmatterMatch[0].length).trim(),
  };
}

function stripMarkdown(value: string): string {
  return value.replace(/\*\*/g, "").trim();
}

function extractTable(body: string, heading: string): Record<string, string>[] {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const section = body.match(new RegExp(`## ${escapedHeading}\\s*([\\s\\S]*?)(?=\\n## |$)`))?.[1];
  if (!section) return [];

  const rows = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));

  if (rows.length < 3) return [];

  const headers = rows[0]
    .split("|")
    .slice(1, -1)
    .map((cell) => stripMarkdown(cell));
  return rows.slice(2).map((row) => {
    const cells = row
      .split("|")
      .slice(1, -1)
      .map((cell) => stripMarkdown(cell));
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

export async function seedMindmaps(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.mindmapNode.count();
  if (existing > 0) {
    seedSkip("MindmapNode", `already has ${existing} records`);
    return;
  }

  let files: string[] = [];
  try {
    files = readdirSync(MINDMAPS_DIR).filter((file) => file.endsWith(".md"));
  } catch {
    seedSkip("MindmapNode", `directory not found: ${MINDMAPS_DIR}`);
    return;
  }

  let createdNodes = 0;
  let createdEdges = 0;

  for (const file of files) {
    const parsed = parseFrontmatter(readFileSync(resolve(MINDMAPS_DIR, file), "utf-8"));
    if (!parsed?.metadata.chủ_đề) {
      console.warn(`    ⚠ Missing mindmap topic in ${file} — skipping`);
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
      console.warn(`    ⚠ No topic found for mindmap "${parsed.metadata.chủ_đề}" — skipping`);
      continue;
    }

    const nodeRows = extractTable(parsed.body, "Các khái niệm (Nodes)");
    const edgeRows = extractTable(parsed.body, "Các liên kết (Edges)");
    const nodeIdByTitle = new Map<string, string>();

    for (const row of nodeRows) {
      const title = row["Tên"];
      if (!title) continue;

      const node = await prisma.mindmapNode.create({
        data: {
          topicId: topic.id,
          title,
          nodeType: row["Loại"] || "khái_niệm",
          description: row["Mô tả ngắn"] || null,
        },
      });

      nodeIdByTitle.set(title, node.id);
      createdNodes++;
    }

    for (const row of edgeRows) {
      const sourceNodeId = nodeIdByTitle.get(row["Từ"]);
      const targetNodeId = nodeIdByTitle.get(row["Đến"]);
      if (!sourceNodeId || !targetNodeId) continue;

      await prisma.mindmapEdge.create({
        data: {
          sourceNodeId,
          targetNodeId,
          relationType: row["Quan hệ"] || "liên_quan",
        },
      });
      createdEdges++;
    }
  }

  seedLog("MindmapNode", createdNodes);
  seedLog("MindmapEdge", createdEdges);
}
