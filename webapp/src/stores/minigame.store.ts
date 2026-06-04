import { RootState } from "@/stores";
import type { MiniGameAnswers } from "@/types/minigame";
import { useAppDispatch, useAppSelector } from "./hooks";
import type { MiniGameFilter } from "./slices/minigame.slice";
import {
  fetchMiniGameDetail,
  fetchMiniGames,
  resetAttempt as resetAttemptAction,
  setMiniGameFilter,
  submitMiniGameAttempt,
} from "./slices/minigame.slice";

export function useMiniGameStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s: RootState) => s.minigame);

  return {
    ...state,
    loadList: async (filter?: MiniGameFilter) => {
      await dispatch(fetchMiniGames(filter)).unwrap();
    },
    setFilter: async (filter: MiniGameFilter) => {
      dispatch(setMiniGameFilter(filter));
      await dispatch(fetchMiniGames(filter)).unwrap();
    },
    loadGame: async (id: string) => {
      await dispatch(fetchMiniGameDetail(id)).unwrap();
    },
    submitAttempt: async (answers: MiniGameAnswers, timeSpentSeconds: number) => {
      await dispatch(submitMiniGameAttempt({ answers, timeSpentSeconds })).unwrap();
    },
    resetAttempt: () => {
      dispatch(resetAttemptAction());
    },
    retry: async () => {
      if (state.game) {
        await dispatch(fetchMiniGameDetail(state.game.id)).unwrap();
      } else {
        await dispatch(fetchMiniGames(state.filter)).unwrap();
      }
    },
  };
}
