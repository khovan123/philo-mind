import type { QuizDetail, QuizSummary } from "@/features/quiz/types";
import { baseApi } from "./baseApi";

export type QuizAttemptStart = {
  attemptId: string;
  quizId: string;
  totalQuestions: number;
  startedAt: string;
};

export type QuizAnswerResult = {
  answer: unknown;
  isCorrect: boolean;
  correctOptionId: string | null;
  explanation: string;
};

export type QuizCompleteResult = {
  score: number;
  accuracy: number;
  correctCount: number;
  totalQuestions: number;
  newlyEarnedBadges: unknown[];
};

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listQuizzes: builder.query<QuizSummary[], { search?: string; status?: string } | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.set("search", filters.search);
        if (filters?.status) params.set("status", filters.status);
        const query = params.toString();
        return { url: `/quizzes${query ? `?${query}` : ""}`, method: "GET" };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((quiz) => ({ type: "Quiz" as const, id: quiz.id })),
              { type: "Quiz", id: "LIST" },
            ]
          : [{ type: "Quiz", id: "LIST" }],
    }),

    getQuizByLesson: builder.query<QuizDetail, string>({
      query: (lessonId) => ({ url: `/quizzes/by-lesson/${lessonId}`, method: "GET" }),
      providesTags: (result, error, lessonId) => [{ type: "Quiz", id: `LESSON-${lessonId}` }],
    }),

    startQuizAttempt: builder.mutation<QuizAttemptStart, string>({
      query: (quizId) => ({ url: `/quizzes/${quizId}/attempts`, method: "POST", body: {} }),
      invalidatesTags: [{ type: "Quiz", id: "LIST" }],
    }),

    submitQuizAnswer: builder.mutation<
      QuizAnswerResult,
      { attemptId: string; questionId: string; selectedOptionId?: string; textAnswer?: string }
    >({
      query: ({ attemptId, ...body }) => ({
        url: `/quizzes/attempts/${attemptId}/answers`,
        method: "POST",
        body,
      }),
    }),

    completeQuizAttempt: builder.mutation<QuizCompleteResult, string>({
      query: (attemptId) => ({
        url: `/quizzes/attempts/${attemptId}/complete`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: [
        { type: "Quiz", id: "LIST" },
        { type: "Profile", id: "SUMMARY" },
        { type: "Learning", id: "DASHBOARD" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListQuizzesQuery,
  useGetQuizByLessonQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAnswerMutation,
  useCompleteQuizAttemptMutation,
} = quizApi;
