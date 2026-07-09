import { prisma } from "../config/prisma.js";

async function check() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: true,
    },
  });

  console.log("═".repeat(80));
  console.log(
    `| ${"Quiz Title".padEnd(45)} | ${"Questions".padEnd(10)} | ${"Lesson ID".padEnd(15)} |`,
  );
  console.log("═".repeat(80));

  for (const quiz of quizzes) {
    console.log(
      `| ${quiz.title.substring(0, 45).padEnd(45)} | ${String(quiz.questions.length).padEnd(10)} | ${quiz.lessonId.substring(0, 15)}... |`,
    );
  }
  console.log("═".repeat(80));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
