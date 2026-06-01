export type QuizStatus = "not-started" | "in-progress" | "completed" | "locked";
export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizSummary = {
  id: string;
  lessonId: string;
  title: string;
  topic: string;
  description: string;
  questions: number;
  timeMinutes: number;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  progress?: number;
  score?: number;
  image: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  context?: string;
  image?: string;
  options: { id: string; label: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  concept: string;
};

export type QuizDetail = {
  id: string;
  lessonId: string;
  title: string;
  topic: string;
  difficulty: QuizDifficulty;
  durationSeconds: number;
  questions: QuizQuestion[];
};

export const quizSummaries: QuizSummary[] = [
  {
    id: "trial-socrates",
    lessonId: "trial-socrates",
    title: "The Trial of Socrates Quiz",
    topic: "Justice • Moral Integrity",
    description: "Test your understanding of Socrates' defense of truth and moral integrity.",
    questions: 4,
    timeMinutes: 5,
    difficulty: "medium",
    status: "not-started",
    image:
      "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "money-happiness",
    lessonId: "money-happiness",
    title: "Can Money Buy Happiness?",
    topic: "Happiness • Virtue",
    description: "Review wealth, virtue, purpose, and the flourishing life.",
    questions: 5,
    timeMinutes: 4,
    difficulty: "easy",
    status: "completed",
    score: 80,
    image:
      "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "power-obedience",
    lessonId: "power-obedience",
    title: "Power and Obedience",
    topic: "Politics • Authority",
    description: "Continue the political philosophy quiz about authority and consent.",
    questions: 6,
    timeMinutes: 6,
    difficulty: "hard",
    status: "in-progress",
    progress: 50,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cave-allegory",
    lessonId: "cave-allegory",
    title: "The Cave Allegory",
    topic: "Epistemology • Plato",
    description: "Locked until you finish the foundations of logic path.",
    questions: 8,
    timeMinutes: 7,
    difficulty: "medium",
    status: "locked",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What value does Socrates mainly defend in the trial?",
    context:
      "Socrates refuses to abandon his philosophical mission, even when faced with execution by the Athenian court.",
    options: [
      { id: "a", label: "A", text: "Wealth" },
      { id: "b", label: "B", text: "Truth" },
      { id: "c", label: "C", text: "Popularity" },
      { id: "d", label: "D", text: "Power" },
    ],
    correctOptionId: "b",
    explanation: "Socrates defends truth and moral integrity even when personal safety is at risk.",
    concept: "Moral Integrity",
  },
  {
    id: "q2",
    prompt: 'In the "Apology," why does Socrates refuse emotional appeals?',
    options: [
      { id: "a", label: "A", text: "Self-preservation" },
      { id: "b", label: "B", text: "Truth" },
      { id: "c", label: "C", text: "Wealth" },
      { id: "d", label: "D", text: "Political power" },
    ],
    correctOptionId: "b",
    explanation:
      "He believes persuasion should serve truth rather than manipulate the jury through pity.",
    concept: "Socratic Method",
  },
  {
    id: "q3",
    prompt: "According to Marcus Aurelius, which thing truly belongs to an individual?",
    options: [
      { id: "a", label: "A", text: "Wealth" },
      { id: "b", label: "B", text: "The choice of will" },
      { id: "c", label: "C", text: "Reputation" },
      { id: "d", label: "D", text: "Public office" },
    ],
    correctOptionId: "b",
    explanation:
      "Stoics treat externals as indifferent. Your faculty of choice is within your control.",
    concept: "Stoic Insight",
  },
  {
    id: "q4",
    prompt: "What is the ultimate goal of persistent questioning in the Socratic Method?",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    options: [
      { id: "a", label: "A", text: "Validation" },
      { id: "b", label: "B", text: "Truth" },
      { id: "c", label: "C", text: "Reputation" },
      { id: "d", label: "D", text: "Rhetoric" },
    ],
    correctOptionId: "b",
    explanation: "Questioning exposes contradictions so a learner can move closer to truth.",
    concept: "Aletheia",
  },
];

export function getQuizByLessonId(lessonId: string): QuizDetail | null {
  const summary = quizSummaries.find((quiz) => quiz.lessonId === lessonId);

  if (!summary || summary.status === "locked") {
    return null;
  }

  return {
    id: summary.id,
    lessonId: summary.lessonId,
    title: summary.title,
    topic: summary.topic,
    difficulty: summary.difficulty,
    durationSeconds: summary.timeMinutes * 60,
    questions: quizQuestions,
  };
}
