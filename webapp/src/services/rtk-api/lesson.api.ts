import type {
  LessonAnswerDTO,
  LessonDTO,
  LessonDetailDTO,
  ListLessonsFilters,
  ProgressUpdateResponse,
} from "@/types/learning";
import { baseApi } from "./baseApi";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listLessons: builder.query<LessonDTO[], ListLessonsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};

        if (f.page !== undefined) params.set("page", String(f.page));
        if (f.limit !== undefined) params.set("limit", String(f.limit));
        if (f.search) params.set("search", f.search);
        if (f.topicId) params.set("topicId", f.topicId);
        if (f.status) params.set("status", f.status);

        const query = params.toString();
        return {
          url: `/lessons${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Lesson" as const, id })),
              { type: "Lesson", id: "LIST" },
            ]
          : [{ type: "Lesson", id: "LIST" }],
    }),

    getLessonById: builder.query<LessonDetailDTO, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Lesson", id }],
    }),

    updateLessonProgress: builder.mutation<
      ProgressUpdateResponse,
      { id: string; status: "IN_PROGRESS" | "COMPLETED"; progressPercent: number }
    >({
      query: ({ id, status, progressPercent }) => ({
        url: `/lessons/${id}/progress`,
        method: "POST",
        body: { status, progressPercent },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lesson", id },
        { type: "User", id: "PROFILE" }, // Badge count or progress stats could update
      ],
    }),

    submitQuestionAnswer: builder.mutation<
      LessonAnswerDTO,
      { questionId: string; answerText: string }
    >({
      query: ({ questionId, answerText }) => ({
        url: `/lessons/questions/${questionId}/answers`,
        method: "POST",
        body: { answerText },
      }),
      invalidatesTags: () => [
        { type: "Lesson", id: "LIST" }, // answer list might need refresh
      ],
    }),

    createLesson: builder.mutation<LessonDTO, Partial<LessonDTO> & { questions?: unknown[] }>({
      query: (body) => ({
        url: "/lessons",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),

    updateLesson: builder.mutation<LessonDTO, { id: string; body: Partial<LessonDTO> }>({
      query: ({ id, body }) => ({
        url: `/lessons/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lesson", id },
        { type: "Lesson", id: "LIST" },
      ],
    }),

    deleteLesson: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListLessonsQuery,
  useGetLessonByIdQuery,
  useUpdateLessonProgressMutation,
  useSubmitQuestionAnswerMutation,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
