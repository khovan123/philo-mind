import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ── T-F03/T-F04: Scenario UI State ─────────────────────────────

export interface ScenarioUiState {
  /** Active perspective card index for swipeable views */
  activePerspectiveIndex: number;
  /** Active framework index for stepper timeline */
  activeFrameworkIndex: number;
  /** Current step in the scenario flow: situation → perspectives → framework → rethink */
  currentPhase: "situation" | "perspectives" | "framework" | "rethink";
  /** User's initial position input (preserved across navigation) */
  initialPosition: string;
  /** User's reasoning text */
  reasoning: string;
  /** Revised position for rethink phase */
  revisedPosition: string;
  /** Reflection text for rethink phase */
  reflection: string;
}

const initialState: ScenarioUiState = {
  activePerspectiveIndex: 0,
  activeFrameworkIndex: 0,
  currentPhase: "situation",
  initialPosition: "",
  reasoning: "",
  revisedPosition: "",
  reflection: "",
};

const scenarioSlice = createSlice({
  name: "scenario",
  initialState,
  reducers: {
    setActivePerspectiveIndex(state, action: PayloadAction<number>) {
      state.activePerspectiveIndex = action.payload;
    },
    setActiveFrameworkIndex(state, action: PayloadAction<number>) {
      state.activeFrameworkIndex = action.payload;
    },
    setCurrentPhase(state, action: PayloadAction<ScenarioUiState["currentPhase"]>) {
      state.currentPhase = action.payload;
    },
    setInitialPosition(state, action: PayloadAction<string>) {
      state.initialPosition = action.payload;
    },
    setReasoning(state, action: PayloadAction<string>) {
      state.reasoning = action.payload;
    },
    setRevisedPosition(state, action: PayloadAction<string>) {
      state.revisedPosition = action.payload;
    },
    setReflection(state, action: PayloadAction<string>) {
      state.reflection = action.payload;
    },
    resetScenarioUi() {
      return initialState;
    },
  },
});

export const {
  setActivePerspectiveIndex,
  setActiveFrameworkIndex,
  setCurrentPhase,
  setInitialPosition,
  setReasoning,
  setRevisedPosition,
  setReflection,
  resetScenarioUi,
} = scenarioSlice.actions;

export const scenarioReducer = scenarioSlice.reducer;
