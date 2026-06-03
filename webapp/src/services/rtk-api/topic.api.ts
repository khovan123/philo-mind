import type { ListTopicsFilters, TopicDTO, TopicDetailDTO } from "@/types/learning";
import { baseApi } from "./baseApi";

export const topicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTopics: builder.query<TopicDTO[], ListTopicsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};

        if (f.page !== undefined) params.set("page", String(f.page));
        if (f.limit !== undefined) params.set("limit", String(f.limit));
        if (f.search) params.set("search", f.search);
        if (f.category) params.set("category", f.category);
        if (f.difficulty) params.set("difficulty", f.difficulty);

        const query = params.toString();
        return {
          url: `/topics${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Topic" as const, id })),
              { type: "Topic", id: "LIST" },
            ]
          : [{ type: "Topic", id: "LIST" }],
    }),

    getTopicById: builder.query<TopicDetailDTO, string>({
      query: (id) => ({
        url: `/topics/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Topic", id }],
    }),

    createTopic: builder.mutation<TopicDTO, Partial<TopicDTO>>({
      query: (body) => ({
        url: "/topics",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Topic", id: "LIST" }],
    }),

    updateTopic: builder.mutation<TopicDTO, { id: string; body: Partial<TopicDTO> }>({
      query: ({ id, body }) => ({
        url: `/topics/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Topic", id },
        { type: "Topic", id: "LIST" },
      ],
    }),

    deleteTopic: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/topics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Topic", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListTopicsQuery,
  useGetTopicByIdQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicApi;
