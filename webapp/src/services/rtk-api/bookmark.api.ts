import { baseApi } from "./baseApi";
import type {
  BookmarkItem,
  BookmarkStatus,
  BookmarkTarget,
  BookmarkTargetType,
} from "@/types/bookmark";

type ListBookmarksParams = {
  page?: number;
  limit?: number;
  targetType?: BookmarkTargetType | "ALL";
};

export const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBookmarks: builder.query<BookmarkItem[], ListBookmarksParams | void>({
      query: (params) => {
        const { page = 1, limit = 100, targetType } = params || {};
        const query = new URLSearchParams();
        query.set("page", String(page));
        query.set("limit", String(limit));

        if (targetType && targetType !== "ALL") {
          query.set("targetType", targetType);
        }

        return {
          url: `/bookmarks?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Bookmark" as const, id })),
              { type: "Bookmark", id: "LIST" },
            ]
          : [{ type: "Bookmark", id: "LIST" }],
    }),

    getBookmarkStatus: builder.query<BookmarkStatus, BookmarkTarget>({
      query: (target) => {
        const query = new URLSearchParams({
          targetType: target.targetType,
          targetId: target.targetId,
        });

        return {
          url: `/bookmarks/status?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, target) => [
        { type: "Bookmark", id: `STATUS-${target.targetId}` },
      ],
    }),

    toggleBookmark: builder.mutation<BookmarkStatus, BookmarkTarget>({
      query: (target) => ({
        url: "/bookmarks/toggle",
        method: "POST",
        body: target,
      }),
      invalidatesTags: (result, error, target) => [
        { type: "Bookmark", id: "LIST" },
        { type: "Bookmark", id: `STATUS-${target.targetId}` },
      ],
    }),

    removeBookmark: builder.mutation<{ message: string }, string>({
      query: (bookmarkId) => ({
        url: `/bookmarks/${bookmarkId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Bookmark", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListBookmarksQuery,
  useGetBookmarkStatusQuery,
  useToggleBookmarkMutation,
  useRemoveBookmarkMutation,
} = bookmarkApi;
