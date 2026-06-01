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
  reasoningPrompt?: string | null;
  consequences?: StoryConsequence[];
};

/** Shape returned by GET /api/v1/stories (list item) */
export type StorySummary = {
  id: string;
  title: string;
  description: string;
  characterRole?: string | null;
  historicalContext?: string | null;
  difficulty: StoryDifficulty;
  estimatedMinutes: number | null;
  coverImageUrl: string | null;
  createdAt: string;
  topic: StoryTopic;
  choices: StoryChoice[];
  stats: StoryStats;
  learnCards?: StoryLearnCard[];
};

export type StorySessionStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type StorySession = {
  id: string;
  userId: string;
  storyId: string;
  status: StorySessionStatus;
  startedAt: string;
  completedAt: string | null;
  decisions: StoryDecision[];
};

export type StoryDecision = {
  id: string;
  sessionId: string;
  userId: string;
  choiceId: string;
  userReason: string | null;
  createdAt: string;
  choice?: StoryChoice & {
    consequences?: StoryConsequence[];
  };
};

export type StoryConsequence = {
  id: string;
  choiceId: string;
  resultText: string;
  ethicalAnalysis: string | null;
  philosophicalAnalysis: string | null;
  politicalEconomicAnalysis: string | null;
  historicalImpact: string | null;
  analysisTabs?: AnalysisTab[];
};

export type AnalysisTabType = "ETHICAL" | "PHILOSOPHICAL" | "POLITICAL_ECONOMIC" | "HISTORICAL";

export type AnalysisTab = {
  id: string;
  consequenceId: string;
  tabType: AnalysisTabType;
  content: string;
  order: number;
};

export type PhilosophyTag = {
  id: string;
  name: string;
  description: string | null;
};

export type StoryLearnCardTag = {
  cardId: string;
  tagId: string;
  tag: PhilosophyTag;
};

export type StoryLearnCard = {
  id: string;
  storyId: string;
  title: string;
  body: string;
  sourceRef: string | null;
  order: number;
  tags: StoryLearnCardTag[];
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
