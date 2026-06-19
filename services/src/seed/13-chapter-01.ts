/**
 * Seed: Chapter 1 canonical content
 * Tasks: CH1-02 + CH1-03
 *
 * Source: data/chapter-01/*.json (6 section files) + flashcards.json
 *   Each section file = { order, code, topic, lesson, quiz[], scenario, debate }
 *   flashcards.json   = { decks: [{ topicSlug, code, title, axis, cards[] }] }
 *
 * Seeds (in dependency order, all idempotent):
 *   - Topic            (upsert by title; forces category="Chương 1")
 *   - Lesson           (upsert by topicId+title; status=PUBLISHED)
 *   - Quiz             (1 per lesson; replace questions on re-run)
 *   - RealLifeScenario (upsert by title; delete+recreate perspectives)
 *   - Debate           (upsert by title) + 2 DebateArgument (authored by admin)
 *   - CriticalQuestion (upsert by question text)
 *   - MiniGame         (flashcard deck; upsert by topicId+title+gameType)
 *
 * QuizQuestion.explanation persists the per-item `explanation` from the JSON
 *   (added as a nullable column via migration add_quiz_question_explanation).
 */
import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Prisma, PrismaClient, QuestionType } from "../prisma/generated/client.js";
import { ContentStatus, DebateStance } from "../prisma/generated/client.js";
import { readJson, seedLog, seedSkip } from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CHAPTER_DIR = resolve(__dirname, "../../../data/chapter-01");

const ADMIN_EMAIL = "admin@philomind.com";

interface SectionFile {
  order: number;
  code: string;
  topic: {
    title: string;
    slug: string;
    category: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    description: string;
  };
  lesson: {
    title: string;
    hook: string;
    body: string;
    examples: string[];
  };
  quiz: Array<{
    type: QuestionType;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  scenario: {
    situation: string;
    perspectives: Array<{ type: string; content: string }>;
    discussionQuestion?: string;
  };
  debate: {
    positionA: string;
    positionB: string;
    openQuestions: string[];
  };
}

interface FlashcardsFile {
  decks: Array<{
    topicSlug: string;
    code: string;
    title: string;
    axis: string;
    cards: Array<{ front: string; back: string; pairWith?: string }>;
  }>;
}

export async function seedChapter01(prisma: PrismaClient): Promise<void> {
  const files = readdirSync(CHAPTER_DIR)
    .filter((f) => f.endsWith(".json") && f !== "flashcards.json")
    .sort();

  const sections = files
    .map((f) => readJson<SectionFile>(`chapter-01/${f}`))
    .sort((a, b) => a.order - b.order);

  const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    console.warn(`    ⚠ Admin user "${ADMIN_EMAIL}" not found — debate arguments will be skipped`);
  }

  // slug -> topicId, for flashcard decks
  const topicIdBySlug = new Map<string, string>();

  let topics = 0;
  let lessons = 0;
  let quizzes = 0;
  let scenarios = 0;
  let perspectives = 0;
  let debates = 0;
  let critical = 0;

  for (const section of sections) {
    // ── Topic (upsert by title; force category="Chương 1") ──
    const existingTopic = await prisma.topic.findFirst({ where: { title: section.topic.title } });
    const topic = existingTopic
      ? await prisma.topic.update({
          where: { id: existingTopic.id },
          data: {
            description: section.topic.description,
            category: section.topic.category,
            difficulty: section.topic.difficulty,
          },
        })
      : await prisma.topic.create({
          data: {
            title: section.topic.title,
            description: section.topic.description,
            category: section.topic.category,
            difficulty: section.topic.difficulty,
          },
        });
    topics++;
    topicIdBySlug.set(section.topic.slug, topic.id);

    // ── Lesson (upsert by topicId+title) ──
    const lessonContent = `${section.lesson.hook}\n\n${section.lesson.body}`;
    const realLifeExample = section.lesson.examples.join("\n\n") || null;
    const existingLesson = await prisma.lesson.findFirst({
      where: { topicId: topic.id, title: section.lesson.title },
    });
    const lesson = existingLesson
      ? await prisma.lesson.update({
          where: { id: existingLesson.id },
          data: {
            content: lessonContent,
            realLifeExample,
            status: ContentStatus.PUBLISHED,
          },
        })
      : await prisma.lesson.create({
          data: {
            topicId: topic.id,
            title: section.lesson.title,
            content: lessonContent,
            realLifeExample,
            status: ContentStatus.PUBLISHED,
          },
        });
    lessons++;

    // ── Quiz (1 per lesson; replace questions on re-run) ──
    const quizTitle = `Quiz: ${section.topic.title}`;
    const existingQuiz = await prisma.quiz.findFirst({
      where: { lessonId: lesson.id, title: quizTitle },
    });
    if (existingQuiz) {
      await prisma.quizQuestion.deleteMany({ where: { quizId: existingQuiz.id } });
    }
    const quizId =
      existingQuiz?.id ??
      (
        await prisma.quiz.create({
          data: { lessonId: lesson.id, title: quizTitle, quizType: "ôn tập" },
        })
      ).id;
    for (const q of section.quiz) {
      await prisma.quizQuestion.create({
        data: {
          quizId,
          question: q.prompt,
          questionType: q.type,
          explanation: q.explanation ?? null,
          options: {
            create: q.options.map((optionText, i) => ({
              optionText,
              isCorrect: i === q.correctIndex,
            })),
          },
        },
      });
    }
    quizzes++;

    // ── RealLifeScenario (upsert by title; delete+recreate perspectives) ──
    const scenarioTitle = `Tình huống: ${section.topic.title}`;
    const existingScenario = await prisma.realLifeScenario.findFirst({
      where: { title: scenarioTitle },
    });
    const scenarioId = existingScenario
      ? (
          await prisma.realLifeScenario.update({
            where: { id: existingScenario.id },
            data: {
              topicId: topic.id,
              situation: section.scenario.situation,
              context: section.scenario.discussionQuestion ?? null,
            },
          })
        ).id
      : (
          await prisma.realLifeScenario.create({
            data: {
              topicId: topic.id,
              title: scenarioTitle,
              situation: section.scenario.situation,
              context: section.scenario.discussionQuestion ?? null,
            },
          })
        ).id;
    await prisma.scenarioPerspective.deleteMany({ where: { scenarioId } });
    if (section.scenario.perspectives.length > 0) {
      await prisma.scenarioPerspective.createMany({
        data: section.scenario.perspectives.map((p) => ({
          scenarioId,
          perspectiveType: p.type,
          content: p.content,
        })),
      });
      perspectives += section.scenario.perspectives.length;
    }
    scenarios++;

    // ── Debate (upsert by title) + 2 arguments (authored by admin) ──
    const debateTitle = `Tranh luận: ${section.topic.title}`;
    const existingDebate = await prisma.debate.findFirst({ where: { title: debateTitle } });
    const debate = existingDebate
      ? await prisma.debate.update({
          where: { id: existingDebate.id },
          data: { topicId: topic.id, description: section.topic.description },
        })
      : await prisma.debate.create({
          data: {
            topicId: topic.id,
            title: debateTitle,
            description: section.topic.description,
          },
        });
    if (admin) {
      const argumentData: {
        debateId: string;
        userId: string;
        stance: DebateStance;
        argumentText: string;
      }[] = [
        {
          debateId: debate.id,
          userId: admin.id,
          stance: DebateStance.AGREE,
          argumentText: section.debate.positionA,
        },
        {
          debateId: debate.id,
          userId: admin.id,
          stance: DebateStance.DISAGREE,
          argumentText: section.debate.positionB,
        },
      ];
      if ((section.debate as any).positionC) {
        argumentData.push({
          debateId: debate.id,
          userId: admin.id,
          stance: DebateStance.NEUTRAL,
          argumentText: (section.debate as any).positionC,
        });
      }
      if ((section.debate as any).positionD) {
        argumentData.push({
          debateId: debate.id,
          userId: admin.id,
          stance: DebateStance.ALTERNATIVE,
          argumentText: (section.debate as any).positionD,
        });
      }
      await prisma.debateArgument.deleteMany({ where: { debateId: debate.id } });
      await prisma.debateArgument.createMany({
        data: argumentData,
      });
    }
    debates++;

    // ── CriticalQuestion from openQuestions (upsert by question text) ──
    for (const question of section.debate.openQuestions) {
      const existingCq = await prisma.criticalQuestion.findFirst({ where: { question } });
      if (existingCq) {
        await prisma.criticalQuestion.update({
          where: { id: existingCq.id },
          data: { topicId: topic.id, questionType: "OPEN_TEXT" },
        });
      } else {
        await prisma.criticalQuestion.create({
          data: { topicId: topic.id, question, questionType: "OPEN_TEXT" },
        });
      }
      critical++;
    }
  }

  // ── Flashcards → MiniGame (upsert by topicId+title+gameType) ──
  const flashcards = readJson<FlashcardsFile>("chapter-01/flashcards.json");
  let miniGames = 0;
  for (const deck of flashcards.decks) {
    const topicId = topicIdBySlug.get(deck.topicSlug) ?? null;
    if (!topicId) {
      console.warn(
        `    ⚠ Flashcard deck "${deck.title}" — topic slug "${deck.topicSlug}" not found`,
      );
    }
    const data = {
      topicId,
      title: deck.title,
      gameType: "flashcard",
      description: deck.axis,
      config: deck.cards as unknown as Prisma.InputJsonValue,
    };
    const existing = await prisma.miniGame.findFirst({
      where: { topicId, title: deck.title, gameType: "flashcard" },
    });
    if (existing) {
      await prisma.miniGame.update({ where: { id: existing.id }, data });
    } else {
      await prisma.miniGame.create({ data });
    }
    miniGames++;
  }

  seedLog("Chapter1 Topic", topics);
  seedLog("Chapter1 Lesson", lessons);
  seedLog("Chapter1 Quiz", quizzes);
  seedLog("Chapter1 RealLifeScenario", scenarios);
  seedLog("Chapter1 ScenarioPerspective", perspectives);
  seedLog("Chapter1 Debate", debates);
  seedLog("Chapter1 CriticalQuestion", critical);
  seedLog("Chapter1 MiniGame (flashcard)", miniGames);
  if (!admin) {
    seedSkip("Chapter1 DebateArgument", "admin user missing");
  }
}
