import { baseApi } from "./baseApi";

// ── T-G01: Badge RTK Query API ──────────────────────────────────

// ── DTOs ─────────────────────────────────────────────────────────

export interface BadgeDefinitionDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  category: "streak" | "quiz" | "story" | "reflection" | "general";
  threshold: number;
  createdAt: string;
}

export interface UserBadgeDTO {
  id: string;
  userId: string;
  badgeId: string;
  badge: BadgeDefinitionDTO;
  earnedAt: string;
  isNew: boolean;
}

export interface BadgeGalleryResponse {
  earned: UserBadgeDTO[];
  locked: BadgeDefinitionDTO[];
  totalEarned: number;
  totalAvailable: number;
}

// ── API Endpoints ───────────────────────────────────────────────

export const badgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBadgeGallery: builder.query<BadgeGalleryResponse, void>({
      query: () => ({
        url: "/badges",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const badges = Array.isArray(response) ? response : [];

        const mapConditionToIcon = (cond: string) => {
          switch (cond) {
            case "first_learning_day":
              return "sparkles";
            case "lesson_finish_3":
              return "book_open";
            case "quiz_complete_5":
              return "trophy";
            case "reflection_write_3":
              return "brain";
            case "story_decision_3":
              return "scroll_text";
            case "minigame_complete_5":
              return "puzzle";
            case "short_lesson_7":
              return "sparkles";
            case "learning_streak_3":
              return "flame";
            case "learning_streak_7":
              return "shield_check";
            case "balanced_core_5":
              return "award";
            default:
              return "award";
          }
        };

        const earned = badges
          .filter((b: any) => b.isEarned)
          .map((b: any) => ({
            id: b.id,
            userId: "",
            badgeId: b.id,
            badge: {
              id: b.id,
              name: b.name,
              description: b.description,
              icon: mapConditionToIcon(b.conditionType),
              condition: b.description,
              category: "general" as const,
              threshold: b.target,
              createdAt: b.earnedAt || new Date().toISOString(),
            },
            earnedAt: b.earnedAt || new Date().toISOString(),
            isNew: false,
          }));

        const locked = badges
          .filter((b: any) => !b.isEarned)
          .map((b: any) => ({
            id: b.id,
            name: b.name,
            description: b.description,
            icon: mapConditionToIcon(b.conditionType),
            condition: `${b.description} (Tiến độ: ${b.progress}/${b.target})`,
            category: "general" as const,
            threshold: b.target,
            createdAt: new Date().toISOString(),
          }));

        return {
          earned,
          locked,
          totalEarned: earned.length,
          totalAvailable: badges.length,
        };
      },
      providesTags: [{ type: "Badge", id: "GALLERY" }],
    }),

    getUserBadges: builder.query<UserBadgeDTO[], void>({
      query: () => ({
        url: "/badges/earned",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Badge" as const, id })),
              { type: "Badge", id: "LIST" },
            ]
          : [{ type: "Badge", id: "LIST" }],
    }),

    markBadgeSeen: builder.mutation<void, string>({
      query: (badgeId) => ({
        url: `/badges/${badgeId}/seen`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, badgeId) => [
        { type: "Badge", id: badgeId },
        { type: "Badge", id: "GALLERY" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetBadgeGalleryQuery, useGetUserBadgesQuery, useMarkBadgeSeenMutation } =
  badgeApi;
