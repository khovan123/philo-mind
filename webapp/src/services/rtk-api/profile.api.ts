import type { AuthUser } from "@/types/auth";
import { baseApi } from "./baseApi";

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
    conditionType: string;
    earnedAt: string | null;
  }[];
  earnedBadges: unknown[];
  activity: {
    streak: { currentStreak: number; longestStreak: number; lastActive: string | null };
    heatmap: { date: string; count: number }[];
    recent: unknown[];
  };
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileSummary: builder.query<ProfileSummary, void>({
      query: () => ({ url: "/profile/summary", method: "GET" }),
      providesTags: [{ type: "Profile", id: "SUMMARY" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetProfileSummaryQuery } = profileApi;
