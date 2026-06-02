import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createChatSession: build.mutation<
      { id: string; title?: string },
      { characterId: string; title?: string }
    >({
      query: (body) => ({
        url: "/api/v1/ai/chat/sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),

    getChatSession: build.query<{ id: string; title?: string; meta?: any }, string>({
      query: (sessionId) => ({ url: `/api/v1/ai/chat/sessions/${sessionId}` }),
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    sendMessage: build.mutation<
      { messageId: string; content: string; role: string },
      { sessionId: string; prompt: string }
    >({
      query: ({ sessionId, prompt }) => ({
        url: `/api/v1/ai/chat/sessions/${sessionId}/messages`,
        method: "POST",
        body: { prompt },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Chat", id: arg.sessionId }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateChatSessionMutation, useGetChatSessionQuery, useSendMessageMutation } =
  chatApi;

export default chatApi;
