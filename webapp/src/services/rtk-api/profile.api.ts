import type { AuthUser } from "@/types/auth";
import { baseApi } from "./baseApi";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ProfileSummary = {
  user: AuthUser;
  stats: {
    streakDays: number;
    points: number;
    stories: number;
    completedLessons: number;
    quizAccuracy: number;
  };
  badges: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    isEarned: boolean;
    progress: number;
    target: number;
  }[];
  earnedBadges: unknown[];
  activity: {
    streak: { currentStreak: number; longestStreak: number; lastActive: string | null };
    heatmap: { date: string; count: number }[];
    recent: unknown[];
  };
  reflections: { id: string; content?: string; text?: string; createdAt: string }[];
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileSummary: builder.query<ProfileSummary, void>({
      query: () => ({ url: "/profile/summary", method: "GET" }),
      transformResponse: (response: ProfileSummary | ApiSuccessResponse<ProfileSummary>) => {
        if (response && typeof response === "object" && "data" in response) {
          return response.data;
        }

        return response;
      },
      providesTags: [{ type: "Profile", id: "SUMMARY" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProfileSummaryQuery } = profileApi;
