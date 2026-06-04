import { baseApi } from "./baseApi";

// ── T-G01: Badge RTK Query API ──────────────────────────────────

// ── DTOs ─────────────────────────────────────────────────────────

export interface BadgeDefinitionDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  category: "streak" | "quiz" | "story" | "debate" | "reflection" | "general";
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
        url: "/badges/gallery",
        method: "GET",
      }),
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
});

export const { useGetBadgeGalleryQuery, useGetUserBadgesQuery, useMarkBadgeSeenMutation } =
  badgeApi;
