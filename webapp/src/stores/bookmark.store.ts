import type { BookmarkItem } from "@/types/bookmark";
import { useAppDispatch, useAppSelector } from "./hooks";
import type { BookmarkFilter } from "./slices/bookmark.slice";
import {
  fetchBookmarks,
  removeBookmark,
  setFilter as setFilterAction,
} from "./slices/bookmark.slice";

export function useBookmarkStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.bookmark);

  return {
    ...state,
    load: async (filter?: BookmarkFilter) => {
      await dispatch(fetchBookmarks(filter)).unwrap();
    },
    setFilter: async (filter: BookmarkFilter) => {
      dispatch(setFilterAction(filter));
      await dispatch(fetchBookmarks(filter)).unwrap();
    },
    remove: async (bookmark: BookmarkItem) => {
      await dispatch(removeBookmark(bookmark)).unwrap();
    },
    retry: async () => {
      await dispatch(fetchBookmarks(state.filter)).unwrap();
    },
  };
}
