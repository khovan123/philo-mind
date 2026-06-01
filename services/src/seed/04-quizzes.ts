/**
 * Seed: Quizzes (from CSV — creates Quiz + QuizQuestion + QuizOptions)
 * Source: data/04-quizzes.csv
 * Dependencies: Lesson (matched by title)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, seedLog, seedSkip } from "./utils/index.js";

interface QuizRow {
  bài_học: string;
  câu_hỏi: string;
  đáp_án_A: string;
  đáp_án_B: string;
  đáp_án_C: string;
  đáp_án_D: string;
  đáp_án_đúng: string;
  loại: string;
}

export async function seedQuizzes(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.quiz.count();
  if (existing > 0) {
    seedSkip("Quiz", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<QuizRow>("04-quizzes.csv");
  let created = 0;

  for (const row of rows) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        OR: [
          { title: { contains: row.bài_học } },
          { content: { contains: row.bài_học } },
          { topic: { title: { contains: row.bài_học } } },
          { topic: { category: { contains: row.bài_học } } },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    if (!lesson) {
      console.warn(
        `    ⚠ No lesson found for: "${row.bài_học}" — creating quiz without lesson link is not possible, skipping`,
      );
      continue;
    }

    if (!row.đáp_án_đúng) {
      continue;
    }
    const correctLetter = row.đáp_án_đúng.trim().toUpperCase();
    const options = [
      { text: row.đáp_án_A, letter: "A" },
      { text: row.đáp_án_B, letter: "B" },
      { text: row.đáp_án_C, letter: "C" },
      { text: row.đáp_án_D, letter: "D" },
    ];

    await prisma.quiz.create({
      data: {
        lessonId: lesson.id,
        title: `Quiz: ${row.bài_học}`,
        quizType: row.loại || "trắc_nghiệm",
        questions: {
          create: [
            {
              question: row.câu_hỏi,
              questionType: "SINGLE_CHOICE",
              options: {
                create: options.map((opt) => ({
                  optionText: opt.text,
                  isCorrect: opt.letter === correctLetter,
                })),
              },
            },
          ],
        },
      },
    });
    created++;
  }

  seedLog("Quiz", created);
}
