import type { Message, Session } from "@/services/aiChat.service";
import { aiChatService } from "@/services/aiChat.service";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ChatState = {
  sessions: Record<string, Session>;
  messages: Record<string, Message[]>;
  activeSessionId: string | null;
  creatingSession: boolean;
  sending: boolean;
  streamingText: Record<string, string>; // messageId -> partial text
  error: string | null;
};

const initialState: ChatState = {
  sessions: {},
  messages: {},
  activeSessionId: null,
  creatingSession: false,
  sending: false,
  streamingText: {},
  error: null,
};

export const createOrOpenSession = createAsyncThunk<
  Session,
  { characterId: string; title?: string },
  { rejectValue: string }
>("chat/createOrOpenSession", async (payload, { rejectWithValue }) => {
  try {
    const res = await aiChatService.createSession(payload);
    return res as Session;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Không thể tạo session");
  }
});

export const sendMessage = createAsyncThunk<
  Message,
  { sessionId: string; prompt: string },
  { rejectValue: string }
>("chat/sendMessage", async ({ sessionId, prompt }, { dispatch, rejectWithValue }) => {
  try {
    const assistant = await aiChatService.sendMessage(sessionId, prompt, (chunk) => {
      // dispatch partial updates; we use a synthetic key per session
      dispatch(appendStreamingText({ sessionId, text: chunk }));
    });

    // clear streamingText for session after finished
    dispatch(clearStreamingText({ sessionId }));
    return assistant as Message;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Không thể gửi tin nhắn");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveSession: (state, action: PayloadAction<string | null>) => {
      state.activeSessionId = action.payload;
      state.error = null;
    },
    appendMessage: (state, action: PayloadAction<{ sessionId: string; message: Message }>) => {
      const { sessionId, message } = action.payload;
      if (!state.messages[sessionId]) state.messages[sessionId] = [];
      state.messages[sessionId].push(message);
    },
    appendStreamingText: (state, action: PayloadAction<{ sessionId: string; text: string }>) => {
      const { sessionId, text } = action.payload;
      state.streamingText[sessionId] = (state.streamingText[sessionId] ?? "") + text;
    },
    clearStreamingText: (state, action: PayloadAction<{ sessionId: string }>) => {
      delete state.streamingText[action.payload.sessionId];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrOpenSession.pending, (state) => {
        state.creatingSession = true;
        state.error = null;
      })
      .addCase(createOrOpenSession.fulfilled, (state, action) => {
        state.creatingSession = false;
        state.sessions[action.payload.id] = action.payload;
        state.activeSessionId = action.payload.id;
      })
      .addCase(createOrOpenSession.rejected, (state, action) => {
        state.creatingSession = false;
        state.error = action.payload ?? "Không thể tạo session";
      })

      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const m = action.payload;
        if (!state.messages[m.sessionId]) state.messages[m.sessionId] = [];
        state.messages[m.sessionId].push(m);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload ?? "Không thể gửi tin nhắn";
      });
  },
});

export const {
  setActiveSession,
  appendMessage,
  appendStreamingText,
  clearStreamingText,
  clearError,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

export default chatSlice;
