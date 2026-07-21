export const miniGameTypes = ["matching", "guess-who", "logic-puzzle"] as const;

export type MiniGameType = (typeof miniGameTypes)[number];

export type MiniGameTopic = {
  id: string;
  title: string;
  category: string;
};

export type MatchingPair = {
  left: string;
  right: string;
};

export type GuessWhoCharacter = {
  name: string;
  hints: string[];
  answer?: string;
  acceptedAnswers?: string[];
};

export type LogicPuzzleItem = {
  id: string;
  text: string;
};

export type MiniGameConfig = {
  pairs?: Record<string, unknown>[];
  characters?: GuessWhoCharacter[];
  prompt?: string;
  items?: LogicPuzzleItem[];
  solution?: string;
  timeLimit?: string | null;
};

export type MiniGame = {
  id: string;
  topicId: string | null;
  title: string;
  gameType: MiniGameType;
  description: string | null;
  config: MiniGameConfig | null;
  topic?: MiniGameTopic | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MiniGameResult = {
  isCorrect: boolean;
  correctCount: number;
  total: number;
  accuracy: number;
  gameType: MiniGameType;
  feedback: "correct" | "try_again" | string;
};

export type MiniGamePlayResult = {
  attemptId: string;
  miniGameId: string;
  userId: string;
  score: number;
  result: MiniGameResult;
  leaderboardRank: number;
  timeSpentSeconds: number;
  completedAt: string;
  newlyEarnedBadges?: unknown[];
};

export type MiniGameLeaderboardEntry = {
  rank: number;
  attemptId: string;
  userId: string;
  user?: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  score: number;
  resultData?: unknown;
  completedAt: string | null;
  createdAt: string;
};

export type MiniGameAnswers =
  | { matches: MatchingPair[] }
  | { characterAnswers: { name: string; answer: string }[] }
  | { solution: string };
