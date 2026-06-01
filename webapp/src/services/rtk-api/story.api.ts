import { baseApi } from "./baseApi";
import type {
  ListStoriesFilters,
  ListStoriesResponse,
  StorySummary,
  StorySession,
  StoryDecision,
} from "@/types/story";

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listStories: builder.query<ListStoriesResponse, ListStoriesFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};

        if (f.page !== undefined) params.set("page", String(f.page));
        if (f.limit !== undefined) params.set("limit", String(f.limit));
        if (f.difficulty) params.set("difficulty", f.difficulty);
        if (f.search) params.set("search", f.search);
        if (f.topicId) params.set("topicId", f.topicId);

        const query = params.toString();
        return {
          url: `/stories${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (data: unknown) => {
        if (Array.isArray(data)) {
          return { stories: data as StorySummary[], total: data.length };
        }
        const obj = data as { stories?: StorySummary[]; total?: number } | null;
        return { stories: obj?.stories ?? [], total: obj?.total ?? 0 };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.stories.map(({ id }) => ({ type: "Story" as const, id })),
              { type: "Story", id: "LIST" },
            ]
          : [{ type: "Story", id: "LIST" }],
    }),

    getStoryDetail: builder.query<StorySummary, string>({
      query: (id) => ({
        url: `/stories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Story", id }],
    }),

    startSession: builder.mutation<StorySession, string>({
      query: (storyId) => ({
        url: `/stories/${storyId}/sessions`,
        method: "POST",
      }),
      invalidatesTags: (result, error, storyId) => [
        { type: "Story", id: `SESSION-${storyId}` },
        { type: "Story", id: "LIST" },
      ],
    }),

    makeDecision: builder.mutation<
      StoryDecision,
      { sessionId: string; choiceId: string; userReason?: string }
    >({
      query: ({ sessionId, choiceId, userReason }) => ({
        url: `/story-sessions/${sessionId}/decide`,
        method: "POST",
        body: { choiceId, userReason },
      }),
      invalidatesTags: () => [{ type: "Story", id: "SESSION-ACTIVE" }],
    }),

    completeSession: builder.mutation<StorySession, string>({
      query: (sessionId) => ({
        url: `/story-sessions/${sessionId}/complete`,
        method: "POST",
      }),
      invalidatesTags: () => [
        { type: "Story", id: "LIST" },
        { type: "Story", id: "SESSION-ACTIVE" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListStoriesQuery,
  useGetStoryDetailQuery,
  useStartSessionMutation,
  useMakeDecisionMutation,
  useCompleteSessionMutation,
} = storyApi;
