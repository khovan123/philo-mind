import { minigameService } from "@/services/minigame.service";
import type {
  MiniGame,
  MiniGameAnswers,
  MiniGameLeaderboardEntry,
  MiniGamePlayResult,
  MiniGameType,
} from "@/types/minigame";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type MiniGameFilter = MiniGameType | "ALL";

export type MiniGameState = {
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
};

const initialState: MiniGameState = {
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
};

export const fetchMiniGames = createAsyncThunk<
  MiniGame[],
  MiniGameFilter | undefined,
  { rejectValue: string }
>("minigame/fetchMiniGames", async (filterParam, { getState, rejectWithValue }) => {
  try {
    const filter = filterParam ?? (getState() as any).minigame.filter;
    return await minigameService.list({ type: filter });
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Không thể tải mini game");
  }
});

export const fetchMiniGameDetail = createAsyncThunk<
  { game: MiniGame; leaderboard: MiniGameLeaderboardEntry[] },
  string,
  { rejectValue: string }
>("minigame/fetchMiniGameDetail", async (id, { rejectWithValue }) => {
  try {
    const [game, leaderboard] = await Promise.all([
      minigameService.getById(id),
      minigameService.leaderboard(id).catch(() => []),
    ]);
    return { game, leaderboard };
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Không thể tải mini game");
  }
});

export const submitMiniGameAttempt = createAsyncThunk<
  { playResult: MiniGamePlayResult; leaderboard: MiniGameLeaderboardEntry[] },
  { answers: MiniGameAnswers; timeSpentSeconds: number },
  { rejectValue: string }
>(
  "minigame/submitMiniGameAttempt",
  async ({ answers, timeSpentSeconds }, { getState, rejectWithValue }) => {
    try {
      const game = (getState() as any).minigame.game;
      if (!game) throw new Error("Không có game hiện tại");
      const playResult = await minigameService.play(game.id, { answers, timeSpentSeconds });
      const leaderboard = await minigameService
        .leaderboard(game.id)
        .catch(() => (getState() as any).minigame.leaderboard);
      return { playResult, leaderboard };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Không thể lưu lượt chơi");
    }
  },
);

const minigameSlice = createSlice({
  name: "minigame",
  initialState,
  reducers: {
    setMiniGameFilter: (state, action: PayloadAction<MiniGameFilter>) => {
      state.filter = action.payload;
    },
    resetAttempt: (state) => {
      state.playResult = null;
      state.error = null;
      state.successMessage = "Bắt đầu lượt chơi mới";
    },
    clearMiniGameMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchMiniGames.pending, (state, action) => {
        state.loadingList = true;
        state.error = null;
        state.successMessage = null;
        if (action.meta.arg !== undefined) {
          state.filter = action.meta.arg;
        }
      })
      .addCase(fetchMiniGames.fulfilled, (state, action) => {
        state.games = action.payload;
        state.loadingList = false;
        state.successMessage = action.payload.length
          ? `Đã tải ${action.payload.length} mini game`
          : "Chưa có mini game";
      })
      .addCase(fetchMiniGames.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload ?? "Không thể tải mini game";
      })
      // Fetch detail
      .addCase(fetchMiniGameDetail.pending, (state) => {
        state.game = null;
        state.leaderboard = [];
        state.playResult = null;
        state.loadingGame = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchMiniGameDetail.fulfilled, (state, action) => {
        state.game = action.payload.game;
        state.leaderboard = action.payload.leaderboard;
        state.loadingGame = false;
        state.successMessage = "Mini game sẵn sàng";
      })
      .addCase(fetchMiniGameDetail.rejected, (state, action) => {
        state.loadingGame = false;
        state.error = action.payload ?? "Không thể tải mini game";
      })
      // Submit attempt
      .addCase(submitMiniGameAttempt.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitMiniGameAttempt.fulfilled, (state, action) => {
        state.playResult = action.payload.playResult;
        state.leaderboard = action.payload.leaderboard;
        state.submitting = false;
        state.successMessage = `Hoàn thành với ${action.payload.playResult.score} điểm`;
      })
      .addCase(submitMiniGameAttempt.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Không thể lưu lượt chơi";
      });
  },
});

export const { setMiniGameFilter, resetAttempt, clearMiniGameMessages } = minigameSlice.actions;
export const minigameReducer = minigameSlice.reducer;
