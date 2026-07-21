import { PrismaClient } from "../prisma/generated/client.js";
import { readFileSync, readdirSync } from "fs";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { seedLog } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../../data");

export async function seedChapterNodesFromJson(prisma: PrismaClient): Promise<void> {
  const files = readdirSync(DATA_DIR);
  let chaptersSeeded = 0;
  let nodesSeeded = 0;

  for (const file of files) {
    if (file.startsWith("chuong_") && file.endsWith(".json")) {
      const filePath = path.join(DATA_DIR, file);
      const rawData = readFileSync(filePath, "utf-8");
      let nodes: any[];
      try {
        nodes = JSON.parse(rawData);
      } catch (e) {
        console.error(`Failed to parse ${file}`);
        continue;
      }

      if (!Array.isArray(nodes) || nodes.length === 0) continue;

      const firstMuc = nodes[0].muc as string;
      const chapterCode = firstMuc.split('.')[0];
      const chapterTitle = `Chương ${chapterCode}`; // Or extract from file if needed
      const order = nodes.map(n => n.muc);

      const existingChapter = await prisma.chapter.findUnique({
        where: { code: chapterCode },
      });

      const chapter = existingChapter
        ? await prisma.chapter.update({
            where: { id: existingChapter.id },
            data: {
              title: chapterTitle,
              order: order,
            },
          })
        : await prisma.chapter.create({
            data: {
              code: chapterCode,
              title: chapterTitle,
              order: order,
            },
          });

      chaptersSeeded++;

      for (const node of nodes) {
        const existingNode = await prisma.chapterNode.findUnique({
          where: {
            chapterId_muc: {
              chapterId: chapter.id,
              muc: node.muc,
            },
          },
        });

        if (existingNode) {
          await prisma.chapterNode.update({
            where: { id: existingNode.id },
            data: {
              title: node.title,
              data: node,
            },
          });
        } else {
          await prisma.chapterNode.create({
            data: {
              chapterId: chapter.id,
              muc: node.muc,
              title: node.title,
              data: node,
            },
          });
        }
        nodesSeeded++;
      }
    }
  }

  seedLog("Chapter (JSON)", chaptersSeeded);
  seedLog("ChapterNode (JSON)", nodesSeeded);
}
