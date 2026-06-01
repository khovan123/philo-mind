export type ReflectionTopic = {
  id: string;
  title: string;
  category: string | null;
};

export type CriticalQuestion = {
  id: string;
  topicId: string;
  question: string;
  questionType: "OPEN_TEXT" | "MORAL_DILEMMA" | "LOGIC";
};

export type ReflectionEntry = {
  id: string;
  userId: string;
  topicId: string | null;
  questionId: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
  topic?: ReflectionTopic | null;
  question?: CriticalQuestion | null;
};

export type ListReflectionsFilters = {
  page?: number;
  limit?: number;
  topicId?: string;
  questionId?: string;
};

export type CreateReflectionInput = {
  content: string;
  topicId?: string | null;
  questionId?: string | null;
};

export type UpdateReflectionInput = Partial<CreateReflectionInput>;
