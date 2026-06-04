/**
 * T-E05: AI Chat RTK Query service
 * Closes #87
 *
 * Full RTK Query endpoints for AI Chat:
 * - Character listing + detail
 * - Session CRUD
 * - Message sending
 */
import { baseApi } from "./baseApi";

// ── Types ────────────────────────────────────────────────
export interface AiCharacter {
  id: string;
  name: string;
  type: string;
  bio: string | null;
  worldview: string | null;
  promptInstruction: string;
  createdAt: string;
}

export interface AiCharacterDetail extends AiCharacter {
  starterPrompts: string[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: "USER" | "AI";
  message: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  characterId: string;
  title: string;
  createdAt: string;
  character: AiCharacter;
  lastMessage?: ChatMessage | null;
}

export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

interface SendMessageResult {
  sessionId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

// ── API ──────────────────────────────────────────────────
export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Characters ──
    getCharacters: build.query<AiCharacter[], void>({
      query: () => ({ url: "/ai/characters" }),
      transformResponse: (res: SuccessResponse<AiCharacter[]>) => {
        // Handle both unwrapped array and full response
        if (Array.isArray(res)) {
          return res;
        }
        return (res && (res as any).data) ? (res as any).data : [];
      },
      providesTags: ["Chat"],
    }),

    getCharacterById: build.query<AiCharacterDetail, string>({
      query: (id) => ({ url: `/ai/characters/${id}` }),
      transformResponse: (res: SuccessResponse<AiCharacterDetail>) => {
        if (res && typeof res === 'object' && 'data' in res) {
          return (res as any).data;
        }
        return res as AiCharacterDetail;
      },
      providesTags: (_r, _e, id) => [{ type: "Chat", id: `char-${id}` }],
    }),

    // ── Sessions ──
    createChatSession: build.mutation<ChatSession, { characterId: string; title?: string }>({
      query: (body) => ({
        url: "/ai/chat/sessions",
        method: "POST",
        body,
      }),
      transformResponse: (res: SuccessResponse<ChatSession>) => {
        if (res && typeof res === 'object' && 'data' in res) {
          return (res as any).data;
        }
        return res as ChatSession;
      },
      invalidatesTags: ["Chat"],
    }),

    listChatSessions: build.query<
      { sessions: ChatSession[]; total: number },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/ai/chat/sessions",
        params: params ?? { page: 1, limit: 20 },
      }),
      transformResponse: (res: PaginatedResponse<ChatSession>) => ({
        sessions: res.data || [],
        total: res.meta?.total ?? 0,
      }),
      providesTags: ["Chat"],
    }),

    getChatSession: build.query<ChatSessionDetail, string>({
      query: (sessionId) => ({
        url: `/ai/chat/sessions/${sessionId}`,
      }),
      transformResponse: (res: SuccessResponse<ChatSessionDetail>) => {
        if (res && typeof res === 'object' && 'data' in res) {
          return (res as any).data;
        }
        return res as ChatSessionDetail;
      },
      providesTags: (_r, _e, id) => [{ type: "Chat", id }],
    }),

    // ── Messages ──
    sendMessage: build.mutation<SendMessageResult, { sessionId: string; message: string }>({
      query: ({ sessionId, message }) => ({
        url: `/ai/chat/sessions/${sessionId}/messages`,
        method: "POST",
        body: { message },
      }),
      transformResponse: (res: SuccessResponse<SendMessageResult>) => {
        if (res && typeof res === 'object' && 'data' in res) {
          return (res as any).data;
        }
        return res as SendMessageResult;
      },
      invalidatesTags: (_r, _e, arg) => [{ type: "Chat", id: arg.sessionId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useCreateChatSessionMutation,
  useListChatSessionsQuery,
  useGetChatSessionQuery,
  useSendMessageMutation,
} = chatApi;

export default chatApi;
