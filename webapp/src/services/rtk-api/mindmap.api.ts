import { baseApi } from "./baseApi";
import type { MindmapGraph, TopicSummary } from "@/types/mindmap";

export const mindmapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTopics: builder.query<TopicSummary[], void>({
      query: () => ({
        url: "/topics",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Mindmap" as const, id })),
              { type: "Mindmap", id: "LIST" },
            ]
          : [{ type: "Mindmap", id: "LIST" }],
    }),

    getGraphByTopic: builder.query<MindmapGraph, string>({
      query: (topicId) => ({
        url: `/mindmaps/topics/${topicId}`,
        method: "GET",
      }),
      providesTags: (result, error, topicId) => [{ type: "Mindmap", id: `GRAPH-${topicId}` }],
    }),
  }),
  overrideExisting: true,
});

export const { useListTopicsQuery, useGetGraphByTopicQuery, useLazyGetGraphByTopicQuery } =
  mindmapApi;
