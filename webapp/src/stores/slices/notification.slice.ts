import type { NotificationType } from "@/services/rtk-api/notification.api";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── T-G02: Notification UI State ────────────────────────────────

export interface NotificationUiState {
  /** Active type filter */
  activeTypeFilter: NotificationType | "all";
  /** Whether showing unread only */
  showUnreadOnly: boolean;
  /** Currently expanded notification (showing full body) */
  expandedNotificationId: string | null;
}

const initialState: NotificationUiState = {
  activeTypeFilter: "all",
  showUnreadOnly: false,
  expandedNotificationId: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setActiveTypeFilter(state, action: PayloadAction<NotificationType | "all">) {
      state.activeTypeFilter = action.payload;
    },
    toggleUnreadOnly(state) {
      state.showUnreadOnly = !state.showUnreadOnly;
    },
    setExpandedNotificationId(state, action: PayloadAction<string | null>) {
      state.expandedNotificationId = action.payload;
    },
    resetNotificationUi() {
      return initialState;
    },
  },
});

export const {
  setActiveTypeFilter,
  toggleUnreadOnly,
  setExpandedNotificationId,
  resetNotificationUi,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
