import { baseApi } from "./baseApi";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type LearningDashboard = {
  greeting: string;
  streak: { currentStreak: number; longestStreak: number; lastActive: string | null };
  points: number;
  dailyHook: {
    id: string;
    title: string;
    topic: string;
    primaryChoice: string;
    secondaryChoice: string;
  } | null;
  continueLearning: {
    lessonId: string;
    title: string;
    subtitle: string;
    difficulty: string;
    progress: number;
    status: string;
  }[];
  stats: {
    learnedLessons: number;
    badges: number;
    quizAccuracy: number;
    totalLessons: number;
  };
  newStory: {
    id: string;
    title: string;
    subtitle: string;
    topic: string;
    duration: string;
  } | null;
  quote: { text: string; author: string };
};

export const learningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLearningDashboard: builder.query<LearningDashboard, void>({
      query: () => ({ url: "/learning/dashboard", method: "GET" }),
      transformResponse: (response: LearningDashboard | ApiSuccessResponse<LearningDashboard>) => {
        if (response && typeof response === "object" && "data" in response) {
          return response.data;
        }

        return response;
      },
      providesTags: [{ type: "Learning", id: "DASHBOARD" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetLearningDashboardQuery } = learningApi;
