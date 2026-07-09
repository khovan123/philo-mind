import { prisma } from "../config/prisma.js";
import { aiService } from "../services/ai.service.js";

async function backfill() {
  console.log("\n🌱 Starting Semantic Search Embedding Backfill...");
  console.log("═".repeat(60));

  let chapterNodesUpdated = 0;
  let moviesUpdated = 0;
  let quizzesUpdated = 0;

  // 1. Backfill Chapter Nodes (Lessons)
  console.log("Processing Chapter Nodes...");
  const nodes = await prisma.chapterNode.findMany({
    include: { chapter: true },
  });

  for (const node of nodes) {
    const data = node.data as any;
    const theoryCards = data?.theoryCards || [];
    const theoryText = theoryCards.map((c: any) => c.body).join(" ");
    const searchText = `Lesson: ${node.title}. Muc: ${node.muc}. Chapter: ${node.chapter.title}. Content: ${theoryText}`;

    console.log(`  → Embedding Lesson: "${node.title}"`);
    try {
      const embedding = await aiService.getEmbedding(searchText);
      await prisma.chapterNode.update({
        where: { id: node.id },
        data: { embedding },
      });
      chapterNodesUpdated++;
    } catch (err) {
      console.error(`  ❌ Failed to embed lesson "${node.title}":`, err);
    }
  }

  // 2. Backfill Movies (Videos)
  console.log("\nProcessing Movies...");
  const movies = await prisma.movie.findMany();
  for (const movie of movies) {
    const searchText = `Interactive Movie Video: ${movie.title}. Muc: ${movie.muc}`;
    console.log(`  → Embedding Movie: "${movie.title}"`);
    try {
      const embedding = await aiService.getEmbedding(searchText);
      await prisma.movie.update({
        where: { id: movie.id },
        data: { embedding },
      });
      moviesUpdated++;
    } catch (err) {
      console.error(`  ❌ Failed to embed movie "${movie.title}":`, err);
    }
  }

  // 3. Backfill Quizzes
  console.log("\nProcessing Quizzes...");
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: {
        include: { options: true },
      },
    },
  });

  for (const quiz of quizzes) {
    const questionsText = quiz.questions
      .map((q) => `${q.question} ${q.explanation || ""}`)
      .join(" ");
    const searchText = `Quiz Trắc nghiệm: ${quiz.title}. Questions: ${questionsText}`;
    console.log(`  → Embedding Quiz: "${quiz.title}"`);
    try {
      const embedding = await aiService.getEmbedding(searchText);
      await prisma.quiz.update({
        where: { id: quiz.id },
        data: { embedding },
      });
      quizzesUpdated++;
    } catch (err) {
      console.error(`  ❌ Failed to embed quiz "${quiz.title}":`, err);
    }
  }

  console.log("═".repeat(60));
  console.log("✅ Backfill Completed successfully!");
  console.log(`  → Chapter Nodes (Lessons) updated: ${chapterNodesUpdated}`);
  console.log(`  → Movies (Videos) updated: ${moviesUpdated}`);
  console.log(`  → Quizzes updated: ${quizzesUpdated}\n`);
}

backfill()
  .catch((err) => {
    console.error("❌ Backfill failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
