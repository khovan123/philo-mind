// ── T-D06: Story types (matches backend GET /api/v1/stories response) ──

export type StoryDifficulty = "EASY" | "MEDIUM" | "HARD";

export type StoryTopic = {
  id: string;
  title: string;
  category: string;
};

export type StoryChoiceDistribution = {
  choiceId: string;
  choiceText: string;
  count: number;
  percentage: number;
};

export type StoryStats = {
  totalPlayCount: number;
  completedPlayCount: number;
  completionRate: number;
  choicesDistribution: StoryChoiceDistribution[];
};

export type StoryChoice = {
  id: string;
  choiceText: string;
};

/** Shape returned by GET /api/v1/stories (list item) */
export type StorySummary = {
  id: string;
  title: string;
  description: string;
  difficulty: StoryDifficulty;
  estimatedMinutes: number | null;
  coverImageUrl: string | null;
  createdAt: string;
  topic: StoryTopic;
  choices: StoryChoice[];
  stats: StoryStats;
};

/** Pagination wrapper returned by GET /api/v1/stories */
export type ListStoriesResponse = {
  stories: StorySummary[];
  total: number;
};

/** Query params accepted by GET /api/v1/stories */
export type ListStoriesFilters = {
  topicId?: string;
  difficulty?: StoryDifficulty;
  search?: string;
  page?: number;
  limit?: number;
};
