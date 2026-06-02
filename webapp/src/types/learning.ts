import { Difficulty, ContentStatus } from "@philo-mind/shared";
export { Difficulty, ContentStatus };

export interface TopicDTO {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
  _count?: {
    lessons: number;
    shortLessons: number;
    storyScenarios: number;
  };
}

export interface TopicDetailDTO extends TopicDTO {
  _count?: {
    lessons: number;
    shortLessons: number;
    storyScenarios: number;
    realLifeScenarios: number;
    debates: number;
    criticalQuestions: number;
    mindmapNodes: number;
    miniGames: number;
    reflections: number;
    perspectives: number;
  };
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

export interface LessonQuestionDTO {
  id: string;
  lessonId: string;
  question: string;
  questionType: string;
  createdAt: string;
  updatedAt: string;
  answers?: {
    id: string;
    answerText: string;
    createdAt: string;
  }[];
}

export interface LessonDetailDTO extends LessonDTO {
  topic: {
    id: string;
    title: string;
    category: string | null;
  };
  questions: LessonQuestionDTO[];
}

export interface ListLessonsFilters {
  page?: number;
  limit?: number;
  search?: string;
  topicId?: string;
  status?: ContentStatus;
}

export interface ListTopicsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: Difficulty;
}

export interface UserProgressDTO {
  id: string;
  userId: string;
  lessonId: string;
  status: "IN_PROGRESS" | "COMPLETED";
  progressPercent: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressUpdateResponse {
  progress: UserProgressDTO;
  newlyEarnedBadges: unknown[];
}

export interface LessonAnswerDTO {
  id: string;
  userId: string;
  questionId: string;
  answerText: string;
  createdAt: string;
  updatedAt: string;
}

// ── T-A08: Short Lesson DTOs ─────────────────────────────────────────

export interface ShortLessonDTO {
  id: string;
  topicId: string;
  title: string;
  dilemmaContent: string;
  stanceA: string;
  stanceB: string;
  stanceACount: number;
  stanceBCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShortLessonDetailDTO extends ShortLessonDTO {
  topic: {
    id: string;
    title: string;
  };
  myStance?: {
    selectedStance: "STANCE_A" | "STANCE_B";
    reason?: string | null;
    createdAt: string;
  } | null;
}

export interface ShortLessonCommentDTO {
  id: string;
  shortLessonId: string;
  userId: string;
  user: {
    fullName: string;
  };
  commentText: string;
  createdAt: string;
}

export interface ListShortLessonsFilters {
  page?: number;
  limit?: number;
  topicId?: string;
}

