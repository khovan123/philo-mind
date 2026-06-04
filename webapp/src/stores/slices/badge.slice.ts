import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── T-G01: Badge UI State ───────────────────────────────────────

export interface BadgeToast {
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
}

export interface BadgeUiState {
  /** Active filter for the badge gallery */
  activeFilter: "all" | "earned" | "locked";
  /** Whether the earn-toast is visible */
  isToastVisible: boolean;
  /** Queue of badge-earn toasts to display */
  toastQueue: BadgeToast[];
  /** Currently showing toast */
  currentToast: BadgeToast | null;
}

const initialState: BadgeUiState = {
  activeFilter: "all",
  isToastVisible: false,
  toastQueue: [],
  currentToast: null,
};

const badgeSlice = createSlice({
  name: "badge",
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<BadgeUiState["activeFilter"]>) {
      state.activeFilter = action.payload;
    },
    enqueueBadgeToast(state, action: PayloadAction<BadgeToast>) {
      state.toastQueue.push(action.payload);
      if (!state.isToastVisible) {
        state.currentToast = state.toastQueue.shift() ?? null;
        state.isToastVisible = !!state.currentToast;
      }
    },
    dismissBadgeToast(state) {
      state.isToastVisible = false;
      state.currentToast = null;
      // Show next toast in queue if any
      if (state.toastQueue.length > 0) {
        state.currentToast = state.toastQueue.shift() ?? null;
        state.isToastVisible = !!state.currentToast;
      }
    },
    clearToastQueue(state) {
      state.toastQueue = [];
      state.currentToast = null;
      state.isToastVisible = false;
    },
  },
});

export const { setActiveFilter, enqueueBadgeToast, dismissBadgeToast, clearToastQueue } =
  badgeSlice.actions;

export const badgeReducer = badgeSlice.reducer;
