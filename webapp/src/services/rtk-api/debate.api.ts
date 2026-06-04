import type { DebateStatus, DebateStance, VoteValue } from "@philo-mind/shared";
import { baseApi } from "./baseApi";

export interface DebateListItemDTO {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  status: DebateStatus;
  createdAt: string;
  counts: {
    total: number;
    agree: number;
    disagree: number;
    neutral: number;
  };
}

export interface DebateUserDTO {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface DebateCommentDTO {
  id: string;
  argumentId: string;
  userId: string;
  commentText: string;
  createdAt: string;
  user: DebateUserDTO;
}

export interface DebateArgumentDetailDTO {
  id: string;
  debateId: string;
  userId: string;
  stance: DebateStance;
  argumentText: string;
  voteCount: number;
  createdAt: string;
  user: DebateUserDTO;
  comments: DebateCommentDTO[];
  userVote: VoteValue | null;
  voteStats: {
    up: number;
    down: number;
  };
}

export interface DebateDetailDTO {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  status: DebateStatus;
  createdAt: string;
  arguments: DebateArgumentDetailDTO[];
}

export interface ListDebatesFilters {
  topicId?: string;
  stance?: string;
  page?: number;
  limit?: number;
}

export interface CreateArgumentInput {
  stance: string; // "AGREE" | "DISAGREE" | "NEUTRAL" or "FOR" | "AGAINST"
  content: string;
}

export const debateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDebates: builder.query<DebateListItemDTO[], ListDebatesFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};

        if (f.topicId) params.set("topicId", f.topicId);
        if (f.stance) params.set("stance", f.stance);
        if (f.page !== undefined) params.set("page", String(f.page));
        if (f.limit !== undefined) params.set("limit", String(f.limit));

        const query = params.toString();
        return {
          url: `/debates${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Debate" as const, id })),
              { type: "Debate", id: "LIST" },
            ]
          : [{ type: "Debate", id: "LIST" }],
    }),

    getDebateDetail: builder.query<DebateDetailDTO, string>({
      query: (id) => ({
        url: `/debates/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Debate", id }],
    }),

    createArgument: builder.mutation<
      DebateArgumentDetailDTO,
      { debateId: string; body: CreateArgumentInput }
    >({
      query: ({ debateId, body }) => ({
        url: `/debates/${debateId}/arguments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { debateId }) => [
        { type: "Debate", id: debateId },
        { type: "Debate", id: "LIST" },
      ],
    }),

    voteArgument: builder.mutation<
      { argumentId: string; voteCount: number; userVote: VoteValue },
      { argumentId: string; value: VoteValue }
    >({
      query: ({ argumentId, value }) => ({
        url: `/debate-arguments/${argumentId}/votes`,
        method: "POST",
        body: { value },
      }),
      invalidatesTags: (result, error, { argumentId }) => [
        { type: "Debate", id: "LIST" },
        // Since vote is inside a debate detail, we might want to invalidate the detail or list.
        // Usually, RTK query cache tags can be updated. We invalidate the whole "Debate" list to be safe,
        // but since we don't have the debateId here, invalidating "Debate LIST" triggers refetch of detail.
        // Actually, invalidating "LIST" and refetching works. Let's make sure it refreshes.
        { type: "Debate", id: "LIST" },
      ],
    }),

    createComment: builder.mutation<DebateCommentDTO, { argumentId: string; commentText: string }>({
      query: ({ argumentId, commentText }) => ({
        url: `/debate-arguments/${argumentId}/comments`,
        method: "POST",
        body: { commentText },
      }),
      invalidatesTags: () => [{ type: "Debate", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListDebatesQuery,
  useGetDebateDetailQuery,
  useCreateArgumentMutation,
  useVoteArgumentMutation,
  useCreateCommentMutation,
} = debateApi;
