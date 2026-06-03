import type { ListShortLessonsFilters, ShortLessonDTO, ShortLessonDetailDTO } from "@/types/learning";
import { baseApi } from "./baseApi";

export const shortLessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listShortLessons: builder.query<ShortLessonDTO[], ListShortLessonsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.page !== undefined) params.set("page", String(filters.page));
        if (filters?.limit !== undefined) params.set("limit", String(filters.limit));
        if (filters?.topicId) params.set("topicId", filters.topicId);
        const query = params.toString();
        return { url: `/short-lessons${query ? `?${query}` : ""}`, method: "GET" };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((lesson) => ({ type: "ShortLesson" as const, id: lesson.id })),
              { type: "ShortLesson", id: "LIST" },
            ]
          : [{ type: "ShortLesson", id: "LIST" }],
    }),

    getShortLessonById: builder.query<ShortLessonDetailDTO, string>({
      query: (id) => ({ url: `/short-lessons/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "ShortLesson", id }],
    }),
  }),
  overrideExisting: true,
});

export const { useListShortLessonsQuery, useGetShortLessonByIdQuery } = shortLessonApi;
