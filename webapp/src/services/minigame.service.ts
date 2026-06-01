import { apiRequest } from "@/services/api";
import type {
  MiniGame,
  MiniGameAnswers,
  MiniGameLeaderboardEntry,
  MiniGamePlayResult,
  MiniGameType,
} from "@/types/minigame";

type ListMiniGamesParams = {
  page?: number;
  limit?: number;
  topicId?: string;
  type?: MiniGameType | "ALL";
};

function buildListPath(params: ListMiniGamesParams = {}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 20));

  if (params.topicId) query.set("topicId", params.topicId);
  if (params.type && params.type !== "ALL") query.set("type", params.type);

  return `/minigames?${query.toString()}`;
}

export const minigameService = {
  async list(params?: ListMiniGamesParams): Promise<MiniGame[]> {
    return apiRequest<MiniGame[]>(buildListPath(params), { method: "GET" });
  },

  async getById(id: string): Promise<MiniGame> {
    return apiRequest<MiniGame>(`/minigames/${id}`, { method: "GET" });
  },

  async play(
    id: string,
    input: { answers: MiniGameAnswers; timeSpentSeconds: number },
  ): Promise<MiniGamePlayResult> {
    return apiRequest<MiniGamePlayResult>(`/minigames/${id}/play`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async leaderboard(id: string): Promise<MiniGameLeaderboardEntry[]> {
    return apiRequest<MiniGameLeaderboardEntry[]>(`/minigames/${id}/leaderboard`, {
      method: "GET",
    });
  },
};
