import type {
  CreateReflectionInput,
  CriticalQuestion,
  ListReflectionsFilters,
  ReflectionEntry,
  UpdateReflectionInput,
} from "@/types/reflection";
import { baseApi } from "./baseApi";

export const reflectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReflections: builder.query<ReflectionEntry[], ListReflectionsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};

        if (f.page !== undefined) params.set("page", String(f.page));
        if (f.limit !== undefined) params.set("limit", String(f.limit));
        if (f.topicId) params.set("topicId", f.topicId);
        if (f.questionId) params.set("questionId", f.questionId);

        const query = params.toString();
        return {
          url: `/reflections${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reflection" as const, id })),
              { type: "Reflection", id: "LIST" },
            ]
          : [{ type: "Reflection", id: "LIST" }],
    }),

    getReflection: builder.query<ReflectionEntry, string>({
      query: (id) => ({
        url: `/reflections/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Reflection", id }],
    }),

    createReflection: builder.mutation<ReflectionEntry, CreateReflectionInput>({
      query: (input) => ({
        url: "/reflections",
        method: "POST",
        body: input,
      }),
      invalidatesTags: [{ type: "Reflection", id: "LIST" }],
    }),

    updateReflection: builder.mutation<
      ReflectionEntry,
      { id: string; input: UpdateReflectionInput }
    >({
      query: ({ id, input }) => ({
        url: `/reflections/${id}`,
        method: "PATCH",
        body: input,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reflection", id },
        { type: "Reflection", id: "LIST" },
      ],
    }),

    listCriticalQuestions: builder.query<CriticalQuestion[], string | void>({
      query: (topicId) => {
        const params = new URLSearchParams({ limit: "8" });
        if (topicId) params.set("topicId", topicId);

        return {
          url: `/critical-questions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reflection" as const, id })),
              { type: "Reflection", id: "QUESTIONS" },
            ]
          : [{ type: "Reflection", id: "QUESTIONS" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListReflectionsQuery,
  useGetReflectionQuery,
  useCreateReflectionMutation,
  useUpdateReflectionMutation,
  useListCriticalQuestionsQuery,
} = reflectionApi;
