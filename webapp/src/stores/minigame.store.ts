import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchMiniGames,
  fetchMiniGameDetail,
  submitMiniGameAttempt,
  setMiniGameFilter,
  resetAttempt as resetAttemptAction,
} from "./slices/minigame.slice";
import type { MiniGameAnswers } from "@/types/minigame";
import type { MiniGameFilter } from "./slices/minigame.slice";

export function useMiniGameStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.minigame);

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
