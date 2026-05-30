export interface TopicDTO {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonDTO {
  id: string;
  topicId: string;
  title: string;
  content: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttemptDTO {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  completedAt: string;
}
