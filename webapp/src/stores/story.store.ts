import { RootState } from "@/stores";
import type { ListStoriesFilters } from "@/types/story";
import { useAppDispatch, useAppSelector } from "./hooks";
import type { StoryStep } from "./slices/story.slice";
import {
  completeActiveSessionThunk,
  fetchStories,
  loadStoryDetail,
  resetStoryStore,
  setStep as setStepAction,
  setSelectedRoleId,
  setNpcEncounterCompleted as setNpcEncounterCompletedAction,
  setMinigameScore as setMinigameScoreAction,
  startOrResumeSession,
  submitDecision,
} from "./slices/story.slice";
export type { StoryStep };

export function useStoryStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s: RootState) => s.story);

  return {
    ...state,
    fetchStories: async (filters?: ListStoriesFilters) => {
      await dispatch(fetchStories(filters)).unwrap();
    },
    loadStoryDetail: async (storyId: string) => {
      await dispatch(loadStoryDetail(storyId)).unwrap();
    },
    startOrResumeSession: async (storyId: string) => {
      await dispatch(startOrResumeSession(storyId)).unwrap();
    },
    submitDecision: async (choiceId: string, userReason?: string) => {
      return await dispatch(submitDecision({ choiceId, userReason })).unwrap();
    },
    completeActiveSession: async () => {
      await dispatch(completeActiveSessionThunk()).unwrap();
    },
    setStep: (step: StoryStep) => {
      dispatch(setStepAction(step));
    },
    setSelectedRoleId: (roleId: string | null) => {
      dispatch(setSelectedRoleId(roleId));
    },
    setNpcEncounterCompleted: (completed: boolean) => {
      dispatch(setNpcEncounterCompletedAction(completed));
    },
    setMinigameScore: (score: number | null) => {
      dispatch(setMinigameScoreAction(score));
    },
    resetStore: () => {
      dispatch(resetStoryStore());
    },
  };
}
