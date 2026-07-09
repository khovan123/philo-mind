import { baseApi } from "./baseApi";

export type SearchItemType = "lesson" | "video" | "quiz";

export type SearchResultItem = {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  routeParams: any;
  score: number;
};

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    semanticSearch: builder.query<SearchResultItem[], { q: string; type?: string }>({
      query: ({ q, type }) => ({
        url: "/search/semantic",
        method: "GET",
        params: { q, type },
      }),
      // We don't want to keep query cache for too long to ensure clean results
      keepUnusedDataFor: 5,
    }),
  }),
  overrideExisting: true,
});

export const { useSemanticSearchQuery } = searchApi;
