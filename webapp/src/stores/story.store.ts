import { create } from "zustand";

import { storyService } from "@/services/story.service";
import type { ListStoriesFilters, StoryDecision, StorySession, StorySummary } from "@/types/story";

export type StoryStep =
  | "intro"
  | "learn"
  | "dilemma"
  | "choose"
  | "result"
  | "knowledge"
  | "reflect";

export type StoryState = {
  stories: StorySummary[];
  totalStories: number;
  currentStory: StorySummary | null;
  activeSession: StorySession | null;
  currentStep: StoryStep;
  loadingStories: boolean;
  loadingStoryDetail: boolean;
  loadingSession: boolean;
  submittingDecision: boolean;
  completingSession: boolean;
  error: string | null;

  // Actions
  fetchStories: (filters?: ListStoriesFilters) => Promise<void>;
  loadStoryDetail: (storyId: string) => Promise<void>;
  startOrResumeSession: (storyId: string) => Promise<void>;
  submitDecision: (choiceId: string, userReason?: string) => Promise<StoryDecision>;
  completeActiveSession: () => Promise<void>;
  setStep: (step: StoryStep) => void;
  resetStore: () => void;
};

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  totalStories: 0,
  currentStory: null,
  activeSession: null,
  currentStep: "intro",
  loadingStories: false,
  loadingStoryDetail: false,
  loadingSession: false,
  submittingDecision: false,
  completingSession: false,
  error: null,

  async fetchStories(filters = {}) {
    set({ loadingStories: true, error: null });
    try {
      const response = await storyService.listStories(filters);
      set({
        stories: response.stories,
        totalStories: response.total,
        loadingStories: false,
      });
    } catch (err) {
      set({
        loadingStories: false,
        error: err instanceof Error ? err.message : "Failed to fetch stories",
      });
    }
  },

  async loadStoryDetail(storyId) {
    set({ loadingStoryDetail: true, error: null });
    try {
      const story = await storyService.getStoryDetail(storyId);
      set({
        currentStory: story,
        loadingStoryDetail: false,
      });
    } catch (err) {
      set({
        loadingStoryDetail: false,
        error: err instanceof Error ? err.message : "Failed to load story details",
      });
    }
  },

  async startOrResumeSession(storyId) {
    set({ loadingSession: true, error: null });
    try {
      // 1. Start or resume session from backend
      const session = await storyService.startSession(storyId);

      // 2. Fetch latest details (containing learn cards, choices, and consequences)
      const story = await storyService.getStoryDetail(storyId);

      // 3. Check decisions to see where to place user
      const hasDecided = session.decisions && session.decisions.length > 0;
      const step: StoryStep = hasDecided ? "result" : "intro";

      set({
        activeSession: session,
        currentStory: story,
        currentStep: step,
        loadingSession: false,
      });
    } catch (err) {
      set({
        loadingSession: false,
        error: err instanceof Error ? err.message : "Failed to start story session",
      });
    }
  },

  async submitDecision(choiceId, userReason) {
    const { activeSession } = get();
    if (!activeSession) {
      throw new Error("No active story session found");
    }

    set({ submittingDecision: true, error: null });
    try {
      const decision = await storyService.makeDecision(activeSession.id, choiceId, userReason);

      // Update decisions list inside activeSession in store
      const updatedDecisions = [
        decision,
        ...(activeSession.decisions || []).filter((d) => d.id !== decision.id),
      ];

      set({
        activeSession: {
          ...activeSession,
          decisions: updatedDecisions,
        },
        currentStep: "result",
        submittingDecision: false,
      });

      return decision;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to submit decision";
      set({
        submittingDecision: false,
        error: errMsg,
      });
      throw err;
    }
  },

  async completeActiveSession() {
    const { activeSession } = get();
    if (!activeSession) return;

    set({ completingSession: true, error: null });
    try {
      await storyService.completeSession(activeSession.id);
      set({
        activeSession: null,
        currentStory: null,
        currentStep: "intro",
        completingSession: false,
      });
    } catch (err) {
      set({
        completingSession: false,
        error: err instanceof Error ? err.message : "Failed to complete story session",
      });
    }
  },

  setStep(step) {
    set({ currentStep: step });
  },

  resetStore() {
    set({
      currentStory: null,
      activeSession: null,
      currentStep: "intro",
      error: null,
    });
  },
}));
