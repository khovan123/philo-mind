import { create } from "zustand";

import { bookmarkService } from "@/services/bookmark.service";
import type { BookmarkItem, BookmarkTargetType } from "@/types/bookmark";

type BookmarkFilter = BookmarkTargetType | "ALL";

type BookmarkState = {
  items: BookmarkItem[];
  filter: BookmarkFilter;
  loading: boolean;
  deletingId: string | null;
  error: string | null;
  successMessage: string | null;
  load: (filter?: BookmarkFilter) => Promise<void>;
  setFilter: (filter: BookmarkFilter) => Promise<void>;
  remove: (bookmark: BookmarkItem) => Promise<void>;
  retry: () => Promise<void>;
};

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  items: [],
  filter: "ALL",
  loading: false,
  deletingId: null,
  error: null,
  successMessage: null,

  async load(filter = get().filter) {
    set({ loading: true, error: null, successMessage: null, filter });

    try {
      const items = await bookmarkService.list({ targetType: filter });
      set({
        items,
        loading: false,
        successMessage: items.length
          ? `Đã tải ${items.length} bookmark`
          : "Chưa có bookmark trong nhóm này",
      });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Không thể tải bookmarks",
      });
    }
  },

  async setFilter(filter) {
    await get().load(filter);
  },

  async remove(bookmark) {
    set({ deletingId: bookmark.id, error: null, successMessage: null });

    try {
      await bookmarkService.remove(bookmark.id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== bookmark.id),
        deletingId: null,
        successMessage: "Đã bỏ bookmark",
      }));
    } catch (err) {
      set({
        deletingId: null,
        error: err instanceof Error ? err.message : "Không thể bỏ bookmark",
      });
    }
  },

  async retry() {
    await get().load(get().filter);
  },
}));
