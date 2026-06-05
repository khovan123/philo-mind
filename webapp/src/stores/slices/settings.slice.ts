import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── Settings UI State ──────────────────────────────────────────

export interface SettingsState {
  /** Selected application language */
  language: "en" | "vi";
}

const initialState: SettingsState = {
  language: "vi", // Default language is Vietnamese as requested
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<"en" | "vi">) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
