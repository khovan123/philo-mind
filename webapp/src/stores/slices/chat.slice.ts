/**
 * T-E05: AI Chat Redux slice
 * Closes #87
 *
 * Local UI state for chat: streaming text, active session, error state.
 * Data fetching is handled by RTK Query (chatApi.ts).
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatUIState {
  activeSessionId: string | null;
  activeCharacterId: string | null;

  /** Partial streaming text per session */
  streamingText: Record<string, string>;
  isStreaming: boolean;

  error: string | null;
}

const initialState: ChatUIState = {
  activeSessionId: null,
  activeCharacterId: null,
  streamingText: {},
  isStreaming: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveSession(state, action: PayloadAction<string | null>) {
      state.activeSessionId = action.payload;
      state.error = null;
    },

    setActiveCharacter(state, action: PayloadAction<string | null>) {
      state.activeCharacterId = action.payload;
    },

    startStreaming(state, action: PayloadAction<string>) {
      state.isStreaming = true;
      state.streamingText[action.payload] = "";
    },

    appendStreamingText(
      state,
      action: PayloadAction<{ sessionId: string; text: string }>,
    ) {
      const { sessionId, text } = action.payload;
      state.streamingText[sessionId] =
        (state.streamingText[sessionId] ?? "") + text;
    },

    finishStreaming(state, action: PayloadAction<string>) {
      state.isStreaming = false;
      delete state.streamingText[action.payload];
    },

    clearStreamingText(state, action: PayloadAction<string>) {
      delete state.streamingText[action.payload];
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    clearChat() {
      return initialState;
    },
  },
});

export const {
  setActiveSession,
  setActiveCharacter,
  startStreaming,
  appendStreamingText,
  finishStreaming,
  clearStreamingText,
  setError,
  clearChat,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

export default chatSlice;
