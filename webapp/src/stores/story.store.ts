import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchStories,
  loadStoryDetail,
  startOrResumeSession,
  submitDecision,
  completeActiveSessionThunk,
  setStep as setStepAction,
  resetStoryStore,
} from "./slices/story.slice";
import type { ListStoriesFilters } from "@/types/story";
import type { StoryStep } from "./slices/story.slice";
export type { StoryStep };

export function useStoryStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.story);

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
    resetStore: () => {
      dispatch(resetStoryStore());
    },
  };
}
