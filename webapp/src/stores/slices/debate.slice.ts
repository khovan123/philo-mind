import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type StanceType = "AGREE" | "DISAGREE" | "NEUTRAL";

export interface DebateUiState {
  /** Active tab on the debate detail screen */
  activeTab: "OVERVIEW" | "ARGUMENTS";
  /** Stance filter in the arguments tab */
  selectedStanceFilter: string;
  /** ID of the expanded argument card (showing comments) */
  expandedArgumentId: string | null;
  /** Whether the argument-writing modal/screen is open */
  isWritingArgument: boolean;
  /** Stance chosen for the new argument being composed */
  argumentStance: StanceType;
  /** Argument form - title field */
  argumentTitle: string;
  /** Argument form - body field */
  argumentBody: string;
  /** Self-assessed convincing rating (20-100) */
  convincingRating: number;
  /** Whether the user is previewing their argument */
  isPreviewMode: boolean;
}

const initialState: DebateUiState = {
  activeTab: "OVERVIEW",
  selectedStanceFilter: "ALL",
  expandedArgumentId: null,
  isWritingArgument: false,
  argumentStance: "AGREE",
  argumentTitle: "",
  argumentBody: "",
  convincingRating: 80,
  isPreviewMode: false,
};

const debateSlice = createSlice({
  name: "debate",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<"OVERVIEW" | "ARGUMENTS">) {
      state.activeTab = action.payload;
    },
    setSelectedStanceFilter(state, action: PayloadAction<string>) {
      state.selectedStanceFilter = action.payload;
    },
    setExpandedArgumentId(state, action: PayloadAction<string | null>) {
      state.expandedArgumentId = action.payload;
    },
    openWriteArgument(state) {
      state.isWritingArgument = true;
    },
    closeWriteArgument(state) {
      state.isWritingArgument = false;
    },
    setArgumentStance(state, action: PayloadAction<StanceType>) {
      state.argumentStance = action.payload;
    },
    setArgumentTitle(state, action: PayloadAction<string>) {
      state.argumentTitle = action.payload;
    },
    setArgumentBody(state, action: PayloadAction<string>) {
      state.argumentBody = action.payload;
    },
    setConvincingRating(state, action: PayloadAction<number>) {
      state.convincingRating = action.payload;
    },
    setIsPreviewMode(state, action: PayloadAction<boolean>) {
      state.isPreviewMode = action.payload;
    },
    /** Reset the compose form after successful submission */
    resetArgumentForm(state) {
      state.argumentTitle = "";
      state.argumentBody = "";
      state.isPreviewMode = false;
      state.isWritingArgument = false;
      state.convincingRating = 80;
      state.argumentStance = "AGREE";
    },
  },
});

export const {
  setActiveTab,
  setSelectedStanceFilter,
  setExpandedArgumentId,
  openWriteArgument,
  closeWriteArgument,
  setArgumentStance,
  setArgumentTitle,
  setArgumentBody,
  setConvincingRating,
  setIsPreviewMode,
  resetArgumentForm,
} = debateSlice.actions;

export const debateReducer = debateSlice.reducer;
