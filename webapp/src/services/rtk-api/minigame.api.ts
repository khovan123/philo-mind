import { baseApi } from "./baseApi";
import type {
  MiniGame,
  MiniGameAnswers,
  MiniGameLeaderboardEntry,
  MiniGamePlayResult,
  MiniGameType,
} from "@/types/minigame";

type ListMiniGamesParams = {
  page?: number;
  limit?: number;
  topicId?: string;
  type?: MiniGameType | "ALL";
};

export const minigameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMiniGames: builder.query<MiniGame[], ListMiniGamesParams | void>({
      query: (params) => {
        const query = new URLSearchParams();
        const p = params || {};
        query.set("page", String(p.page ?? 1));
        query.set("limit", String(p.limit ?? 20));

        if (p.topicId) query.set("topicId", p.topicId);
        if (p.type && p.type !== "ALL") query.set("type", p.type);

        return {
          url: `/minigames?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Minigame" as const, id })),
              { type: "Minigame", id: "LIST" },
            ]
          : [{ type: "Minigame", id: "LIST" }],
    }),

    getMiniGameById: builder.query<MiniGame, string>({
      query: (id) => ({
        url: `/minigames/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Minigame", id }],
    }),

    playMiniGame: builder.mutation<
      MiniGamePlayResult,
      { id: string; answers: MiniGameAnswers; timeSpentSeconds: number }
    >({
      query: ({ id, answers, timeSpentSeconds }) => ({
        url: `/minigames/${id}/play`,
        method: "POST",
        body: { answers, timeSpentSeconds },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Minigame", id: `LEADERBOARD-${id}` },
        { type: "Minigame", id },
      ],
    }),

    getMiniGameLeaderboard: builder.query<MiniGameLeaderboardEntry[], string>({
      query: (id) => ({
        url: `/minigames/${id}/leaderboard`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Minigame", id: `LEADERBOARD-${id}` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListMiniGamesQuery,
  useGetMiniGameByIdQuery,
  usePlayMiniGameMutation,
  useGetMiniGameLeaderboardQuery,
} = minigameApi;
