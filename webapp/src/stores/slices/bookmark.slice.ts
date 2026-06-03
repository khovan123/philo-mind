import { bookmarkService } from "@/services/bookmark.service";
import type { BookmarkItem, BookmarkTargetType } from "@/types/bookmark";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BookmarkFilter = BookmarkTargetType | "ALL";

export type BookmarkState = {
  items: BookmarkItem[];
  filter: BookmarkFilter;
  loading: boolean;
  deletingId: string | null;
  error: string | null;
  successMessage: string | null;
};

const initialState: BookmarkState = {
  items: [],
  filter: "ALL",
  loading: false,
  deletingId: null,
  error: null,
  successMessage: null,
};

export const fetchBookmarks = createAsyncThunk<
  BookmarkItem[],
  BookmarkFilter | undefined,
  { rejectValue: string }
>("bookmark/fetchBookmarks", async (filterParam, { getState, rejectWithValue }) => {
  try {
    const filter = filterParam ?? (getState() as any).bookmark.filter;
    return await bookmarkService.list({ targetType: filter });
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Không thể tải bookmarks");
  }
});

export const removeBookmark = createAsyncThunk<
  string, // Returns bookmark ID on success
  BookmarkItem,
  { rejectValue: string }
>("bookmark/removeBookmark", async (bookmark, { rejectWithValue }) => {
  try {
    await bookmarkService.remove(bookmark.id);
    return bookmark.id;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Không thể bỏ bookmark");
  }
});

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<BookmarkFilter>) => {
      state.filter = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookmarks
      .addCase(fetchBookmarks.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        if (action.meta.arg !== undefined) {
          state.filter = action.meta.arg;
        }
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.successMessage = action.payload.length
          ? `Đã tải ${action.payload.length} bookmark`
          : "Chưa có bookmark trong nhóm này";
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Không thể tải bookmarks";
      })
      // Remove Bookmark
      .addCase(removeBookmark.pending, (state, action) => {
        state.deletingId = action.meta.arg.id;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.deletingId = null;
        state.successMessage = "Đã bỏ bookmark";
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload ?? "Không thể bỏ bookmark";
      });
  },
});

export const { setFilter, clearMessages } = bookmarkSlice.actions;
export const bookmarkReducer = bookmarkSlice.reducer;
