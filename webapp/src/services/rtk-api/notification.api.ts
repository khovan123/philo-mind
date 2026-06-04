import { baseApi } from "./baseApi";

// ── T-G02: Notification RTK Query API ───────────────────────────

// ── DTOs ─────────────────────────────────────────────────────────

export type NotificationType =
  | "badge_earned"
  | "streak_milestone"
  | "debate_reply"
  | "quiz_result"
  | "story_complete"
  | "system";

export interface NotificationDTO {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Deep-link route path, e.g. "/debates/abc123" */
  deepLink: string | null;
  /** Related entity metadata */
  metadata: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: NotificationDTO[];
  unreadCount: number;
  total: number;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}

// ── API Endpoints ───────────────────────────────────────────────

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<NotificationListResponse, NotificationFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};
        if (f.page) params.set("page", String(f.page));
        if (f.limit) params.set("limit", String(f.limit));
        if (f.type) params.set("type", f.type);
        if (f.unreadOnly) params.set("unreadOnly", "true");
        return {
          url: `/notifications?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: [{ type: "Notification", id: "UNREAD" }],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),

    markAllRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
} = notificationApi;
