export type LoadState = "loading" | "ready" | "empty" | "error";
export type FeedbackState = "idle" | "submitting" | "correct" | "wrong" | "timeout";
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
