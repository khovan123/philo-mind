import { storyService } from "@/services/story.service";
import type { ListStoriesFilters, StoryDecision, StorySession, StorySummary } from "@/types/story";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  selectedRoleId: string | null;
  currentStep: StoryStep;
  npcEncounterCompleted: boolean;
  minigameScore: number | null;
  /** The choiceId from the most recent decision in this session */
  lastDecisionChoiceId: string | null;
  loadingStories: boolean;
  loadingStoryDetail: boolean;
  loadingSession: boolean;
  submittingDecision: boolean;
  completingSession: boolean;
  error: string | null;
};

const initialState: StoryState = {
  stories: [],
  totalStories: 0,
  currentStory: null,
  activeSession: null,
  selectedRoleId: null,
  currentStep: "intro",
  npcEncounterCompleted: false,
  minigameScore: null,
  lastDecisionChoiceId: null,
  loadingStories: false,
  loadingStoryDetail: false,
  loadingSession: false,
  submittingDecision: false,
  completingSession: false,
  error: null,
};

export const fetchStories = createAsyncThunk<
  { stories: StorySummary[]; total: number },
  ListStoriesFilters | undefined,
  { rejectValue: string }
>("story/fetchStories", async (filters, { rejectWithValue }) => {
  try {
    return await storyService.listStories(filters ?? {});
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch stories");
  }
});

export const loadStoryDetail = createAsyncThunk<StorySummary, string, { rejectValue: string }>(
  "story/loadStoryDetail",
  async (storyId, { rejectWithValue }) => {
    try {
      return await storyService.getStoryDetail(storyId);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to load story details");
    }
  },
);

export const startOrResumeSession = createAsyncThunk<
  { session: StorySession; story: StorySummary },
  string,
  { rejectValue: string }
>("story/startOrResumeSession", async (storyId, { rejectWithValue }) => {
  try {
    const session = await storyService.startSession(storyId);
    const story = await storyService.getStoryDetail(storyId);
    return { session, story };
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to start story session");
  }
});

export const submitDecision = createAsyncThunk<
  StoryDecision,
  { choiceId: string; userReason?: string },
  { rejectValue: string }
>("story/submitDecision", async ({ choiceId, userReason }, { getState, rejectWithValue }) => {
  try {
    const activeSession = (getState() as any).story.activeSession;
    if (!activeSession) {
      throw new Error("No active story session found");
    }
    return await storyService.makeDecision(activeSession.id, choiceId, userReason);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to submit decision");
  }
});

export const completeActiveSessionThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  "story/completeActiveSession",
  async (_, { getState, rejectWithValue }) => {
    try {
      const activeSession = (getState() as any).story.activeSession;
      if (!activeSession) return;
      await storyService.completeSession(activeSession.id);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to complete story session",
      );
    }
  },
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<StoryStep>) => {
      state.currentStep = action.payload;
    },
    setSelectedRoleId: (state, action: PayloadAction<string | null>) => {
      state.selectedRoleId = action.payload;
    },
    setNpcEncounterCompleted: (state, action: PayloadAction<boolean>) => {
      state.npcEncounterCompleted = action.payload;
    },
    setMinigameScore: (state, action: PayloadAction<number | null>) => {
      state.minigameScore = action.payload;
    },
    resetStoryStore: (state) => {
      state.currentStory = null;
      state.activeSession = null;
      state.selectedRoleId = null;
      state.currentStep = "intro";
      state.npcEncounterCompleted = false;
      state.minigameScore = null;
      state.lastDecisionChoiceId = null;
      state.error = null;
    },
    clearStoryMessages: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stories
      .addCase(fetchStories.pending, (state) => {
        state.loadingStories = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.stories = action.payload.stories;
        state.totalStories = action.payload.total;
        state.loadingStories = false;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loadingStories = false;
        state.error = action.payload ?? "Failed to fetch stories";
      })
      // Load Story Detail
      .addCase(loadStoryDetail.pending, (state) => {
        state.loadingStoryDetail = true;
        state.error = null;
      })
      .addCase(loadStoryDetail.fulfilled, (state, action) => {
        state.currentStory = action.payload;
        state.loadingStoryDetail = false;
      })
      .addCase(loadStoryDetail.rejected, (state, action) => {
        state.loadingStoryDetail = false;
        state.error = action.payload ?? "Failed to load story details";
      })
      // Start or Resume Session
      .addCase(startOrResumeSession.pending, (state) => {
        state.loadingSession = true;
        state.error = null;
      })
      .addCase(startOrResumeSession.fulfilled, (state, action) => {
        state.activeSession = action.payload.session;
        state.currentStory = action.payload.story;
        const hasDecided =
          action.payload.session.decisions && action.payload.session.decisions.length > 0;
        state.currentStep = hasDecided ? "result" : "intro";
        state.loadingSession = false;
      })
      .addCase(startOrResumeSession.rejected, (state, action) => {
        state.loadingSession = false;
        state.error = action.payload ?? "Failed to start story session";
      })
      // Submit Decision
      .addCase(submitDecision.pending, (state) => {
        state.submittingDecision = true;
        state.error = null;
      })
      .addCase(submitDecision.fulfilled, (state, action) => {
        const decision = action.payload;
        if (state.activeSession) {
          const updatedDecisions = [
            decision,
            ...(state.activeSession.decisions || []).filter((d) => d.id !== decision.id),
          ];
          state.activeSession.decisions = updatedDecisions;
        }
        state.lastDecisionChoiceId = decision.choiceId;
        state.currentStep = "result";
        state.submittingDecision = false;
      })
      .addCase(submitDecision.rejected, (state, action) => {
        state.submittingDecision = false;
        state.error = action.payload ?? "Failed to submit decision";
      })
      // Complete Session
      .addCase(completeActiveSessionThunk.pending, (state) => {
        state.completingSession = true;
        state.error = null;
      })
      .addCase(completeActiveSessionThunk.fulfilled, (state) => {
        state.activeSession = null;
        state.currentStory = null;
        state.currentStep = "intro";
        state.lastDecisionChoiceId = null;
        state.completingSession = false;
      })
      .addCase(completeActiveSessionThunk.rejected, (state, action) => {
        state.completingSession = false;
        state.error = action.payload ?? "Failed to complete story session";
      });
  },
});

export const {
  setStep,
  resetStoryStore,
  clearStoryMessages,
  setSelectedRoleId,
  setNpcEncounterCompleted,
  setMinigameScore,
} = storySlice.actions;
export const storyReducer = storySlice.reducer;
