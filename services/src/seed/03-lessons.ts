/**
 * Seed: Lessons (from Markdown files with frontmatter)
 * Source: data/03-full-lessons/*.md
 * Dependencies: Topic (matched by category/title)
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PrismaClient } from "../prisma/generated/client.js";
import { ContentStatus, QuestionType } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LESSONS_DIR = resolve(__dirname, "../../../data/03-full-lessons");

interface Frontmatter {
  chủ_đề?: string;
  tiêu_đề?: string;
  thời_gian_đọc?: string;
}

export async function seedLessons(prisma: PrismaClient): Promise<void> {
  let files: string[] = [];
  try {
    files = readdirSync(LESSONS_DIR).filter((file) => file.endsWith(".md"));
  } catch {
    console.warn(`    ⚠ Directory not found or unreadable: ${LESSONS_DIR}`);
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = resolve(LESSONS_DIR, file);
    const rawContent = readFileSync(filePath, "utf-8");

    // Parse Frontmatter
    const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      console.warn(`    ⚠ No frontmatter found in file: ${file} — skipping`);
      continue;
    }

    const frontmatterText = frontmatterMatch[1];
    const bodyText = rawContent.slice(frontmatterMatch[0].length).trim();

    const metadata: Frontmatter = {};
    const frontmatterLines = frontmatterText.split("\n");
    for (const line of frontmatterLines) {
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        metadata[key as keyof Frontmatter] = val;
      }
    }

    const title = metadata.tiêu_đề;
    const category = metadata.chủ_đề;

    if (!title || !category) {
      console.warn(`    ⚠ Missing title or topic in frontmatter of ${file} — skipping`);
      continue;
    }

    // Resolve Topic
    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ category: { contains: category } }, { title: { contains: category } }],
      },
    });

    if (!topic) {
      console.warn(`    ⚠ No topic found for category: "${category}" — skipping "${title}"`);
      continue;
    }

    // Check if lesson already exists
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        title,
        topicId: topic.id,
      },
    });

    if (existingLesson) {
      skipped++;
      continue;
    }

    // Parse Estimated Minutes
    let estimatedMinutes = 0;
    if (metadata.thời_gian_đọc) {
      const minMatch = metadata.thời_gian_đọc.match(/\d+/);
      if (minMatch) {
        estimatedMinutes = parseInt(minMatch[0], 10);
      }
    }

    // Parse Sections
    const sections = bodyText.split(/(?=##\s)/);
    let content = "";
    let realLifeExample = "";
    let conflict = "";
    let reviewQuestionsText = "";

    for (const section of sections) {
      const trimmed = section.trim();
      if (trimmed.startsWith("## Nội dung chính")) {
        content = trimmed.replace(/^## Nội dung chính\s*/, "").trim();
      } else if (trimmed.startsWith("## Ví dụ thực tế")) {
        realLifeExample = trimmed.replace(/^## Ví dụ thực tế\s*/, "").trim();
      } else if (trimmed.startsWith("## Câu hỏi tranh luận")) {
        conflict = trimmed.replace(/^## Câu hỏi tranh luận\s*/, "").trim();
      } else if (trimmed.startsWith("## Câu hỏi ôn tập")) {
        reviewQuestionsText = trimmed.replace(/^## Câu hỏi ôn tập\s*/, "").trim();
      }
    }

    // Parse Review Questions
    const parsedQuestions: { question: string; questionType: QuestionType }[] = [];
    if (reviewQuestionsText) {
      const questionLines = reviewQuestionsText.split("\n");
      for (const line of questionLines) {
        const trimmedLine = line.trim();
        // Match line format: e.g. "1. (Tự luận) ..." or just "(Tự luận) ..."
        const questionMatch = trimmedLine.match(/^(?:\d+\.\s*)?(\(([^)]+)\))\s*(.+)$/);
        if (questionMatch) {
          const prefix = questionMatch[2].trim().toLowerCase();
          const questionText = questionMatch[3].trim();
          let questionType: QuestionType = QuestionType.OPEN_TEXT;

          if (prefix === "tự luận") {
            questionType = QuestionType.OPEN_TEXT;
          } else if (prefix === "tình huống") {
            questionType = QuestionType.MORAL_DILEMMA;
          }

          if (questionText && questionText !== "...") {
            parsedQuestions.push({
              question: questionText,
              questionType,
            });
          }
        } else {
          // Simple numbered line without standard parenthesized prefix
          const simpleMatch = trimmedLine.match(/^(?:\d+\.\s*)(.+)$/);
          if (simpleMatch) {
            const questionText = simpleMatch[1].trim();
            if (questionText && questionText !== "...") {
              parsedQuestions.push({
                question: questionText,
                questionType: QuestionType.OPEN_TEXT,
              });
            }
          }
        }
      }
    }

    // Create the Lesson and nested Questions
    await prisma.lesson.create({
      data: {
        topicId: topic.id,
        title,
        content,
        realLifeExample: realLifeExample || null,
        conflict: conflict || null,
        estimatedMinutes: estimatedMinutes || null,
        status: ContentStatus.PUBLISHED,
        questions: {
          create: parsedQuestions.map((q) => ({
            question: q.question,
            questionType: q.questionType,
          })),
        },
      },
    });

    created++;
  }

  if (created > 0) {
    seedLog("Lesson", created);
  }
  if (skipped > 0) {
    seedSkip("Lesson", `${skipped} records already exist`);
  }
}
