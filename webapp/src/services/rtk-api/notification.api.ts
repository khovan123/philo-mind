import { baseApi } from "./baseApi";

export type NotificationType =
  | "badge_earned"
  | "streak_milestone"
  | "quiz_result"
  | "story_complete"
  | "system";

export interface NotificationDTO {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  deepLink: string | null;
  metadata: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}

type RawNotificationDTO = Omit<NotificationDTO, "title" | "body" | "deepLink" | "metadata"> & {
  content?: string;
  title?: string;
  body?: string;
  deepLink?: string | null;
  metadata?: Record<string, string> | null;
};

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

type QueryMeta = {
  apiMeta?: {
    total?: number;
  };
};

function normalizeNotification(raw: RawNotificationDTO): NotificationDTO {
  const content = raw.content ?? raw.body ?? raw.title ?? "";
  const lines = content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title = raw.title ?? lines[0] ?? "Thông báo";
  const body = raw.body ?? (lines.length > 1 ? lines.slice(1).join("\n") : content);

  return {
    ...raw,
    title,
    body,
    deepLink: raw.deepLink ?? raw.metadata?.deepLink ?? null,
    metadata: raw.metadata ?? null,
  };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<NotificationListResponse, NotificationFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};
        if (f.page) params.set("page", String(f.page));
        if (f.limit) params.set("limit", String(f.limit));
        if (f.type) params.set("type", f.type);
        if (f.unreadOnly) params.set("isRead", "false");

        return {
          url: `/notifications?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: RawNotificationDTO[] | NotificationListResponse, meta) => {
        if (!Array.isArray(response)) {
          return {
            notifications: response.notifications.map(normalizeNotification),
            unreadCount: response.unreadCount,
            total: response.total,
          };
        }

        const apiMeta = meta as QueryMeta | undefined;

        return {
          notifications: response.map(normalizeNotification),
          unreadCount: response.filter((item) => !item.isRead).length,
          total: apiMeta?.apiMeta?.total ?? response.length,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.notifications ?? []).map(({ id }) => ({
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
