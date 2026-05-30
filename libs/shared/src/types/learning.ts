export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface TopicDTO {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
}

export interface LessonDTO {
  id: string;
  topicId: string;
  title: string;
  content: string;
  realLifeExample: string | null;
  conflict: string | null;
  estimatedMinutes: number | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttemptDTO {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  completedAt: string | null;
  createdAt: string;
}
