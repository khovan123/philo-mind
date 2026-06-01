import { create } from "zustand";

import { minigameService } from "@/services/minigame.service";
import type {
  MiniGame,
  MiniGameAnswers,
  MiniGameLeaderboardEntry,
  MiniGamePlayResult,
  MiniGameType,
} from "@/types/minigame";

type MiniGameFilter = MiniGameType | "ALL";

type MiniGameState = {
  games: MiniGame[];
  game: MiniGame | null;
  leaderboard: MiniGameLeaderboardEntry[];
  playResult: MiniGamePlayResult | null;
  filter: MiniGameFilter;
  loadingList: boolean;
  loadingGame: boolean;
  submitting: boolean;
  error: string | null;
  successMessage: string | null;
  loadList: (filter?: MiniGameFilter) => Promise<void>;
  setFilter: (filter: MiniGameFilter) => Promise<void>;
  loadGame: (id: string) => Promise<void>;
  submitAttempt: (answers: MiniGameAnswers, timeSpentSeconds: number) => Promise<void>;
  resetAttempt: () => void;
  retry: () => Promise<void>;
};

export const useMiniGameStore = create<MiniGameState>((set, get) => ({
  games: [],
  game: null,
  leaderboard: [],
  playResult: null,
  filter: "ALL",
  loadingList: false,
  loadingGame: false,
  submitting: false,
  error: null,
  successMessage: null,

  async loadList(filter = get().filter) {
    set({ loadingList: true, error: null, successMessage: null, filter });

    try {
      const games = await minigameService.list({ type: filter });
      set({
        games,
        loadingList: false,
        successMessage: games.length ? `Đã tải ${games.length} mini game` : "Chưa có mini game",
      });
    } catch (err) {
      set({
        loadingList: false,
        error: err instanceof Error ? err.message : "Không thể tải mini game",
      });
    }
  },

  async setFilter(filter) {
    await get().loadList(filter);
  },

  async loadGame(id) {
    set({
      game: null,
      leaderboard: [],
      playResult: null,
      loadingGame: true,
      error: null,
      successMessage: null,
    });

    try {
      const [game, leaderboard] = await Promise.all([
        minigameService.getById(id),
        minigameService.leaderboard(id).catch(() => []),
      ]);
      set({
        game,
        leaderboard,
        loadingGame: false,
        successMessage: "Mini game sẵn sàng",
      });
    } catch (err) {
      set({
        loadingGame: false,
        error: err instanceof Error ? err.message : "Không thể tải mini game",
      });
    }
  },

  async submitAttempt(answers, timeSpentSeconds) {
    const game = get().game;
    if (!game) return;

    set({ submitting: true, error: null, successMessage: null });

    try {
      const playResult = await minigameService.play(game.id, { answers, timeSpentSeconds });
      const leaderboard = await minigameService.leaderboard(game.id).catch(() => get().leaderboard);
      set({
        playResult,
        leaderboard,
        submitting: false,
        successMessage: `Hoàn thành với ${playResult.score} điểm`,
      });
    } catch (err) {
      set({
        submitting: false,
        error: err instanceof Error ? err.message : "Không thể lưu lượt chơi",
      });
    }
  },

  resetAttempt() {
    set({ playResult: null, error: null, successMessage: "Bắt đầu lượt chơi mới" });
  },

  async retry() {
    const game = get().game;
    if (game) {
      await get().loadGame(game.id);
      return;
    }
    await get().loadList(get().filter);
  },
}));
