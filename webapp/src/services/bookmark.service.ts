import { apiRequest } from "@/services/api";
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

function buildListPath(params: ListBookmarksParams = {}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 100));

  if (params.targetType && params.targetType !== "ALL") {
    query.set("targetType", params.targetType);
  }

  return `/bookmarks?${query.toString()}`;
}

function buildStatusPath(target: BookmarkTarget) {
  const query = new URLSearchParams({
    targetType: target.targetType,
    targetId: target.targetId,
  });

  return `/bookmarks/status?${query.toString()}`;
}

export const bookmarkService = {
  async list(params?: ListBookmarksParams): Promise<BookmarkItem[]> {
    return apiRequest<BookmarkItem[]>(buildListPath(params), { method: "GET" });
  },

  async status(target: BookmarkTarget): Promise<BookmarkStatus> {
    return apiRequest<BookmarkStatus>(buildStatusPath(target), { method: "GET" });
  },

  async toggle(target: BookmarkTarget): Promise<BookmarkStatus> {
    return apiRequest<BookmarkStatus>("/bookmarks/toggle", {
      method: "POST",
      body: JSON.stringify(target),
    });
  },

  async remove(bookmarkId: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/bookmarks/${bookmarkId}`, { method: "DELETE" });
  },
};
