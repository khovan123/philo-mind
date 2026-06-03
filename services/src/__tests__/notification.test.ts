import { jest } from "@jest/globals";

// ── Mock env ────────────────────────────────────────────────────
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
  },
}));

// ── Mock Prisma ─────────────────────────────────────────────────
const mockNotificationFindMany = jest.fn() as any;
const mockNotificationFindFirst = jest.fn() as any;
const mockNotificationFindUnique = jest.fn() as any;
const mockNotificationCount = jest.fn() as any;
const mockNotificationCreate = jest.fn() as any;
const mockNotificationUpdate = jest.fn() as any;
const mockNotificationUpdateMany = jest.fn() as any;
const mockNotificationDeleteMany = jest.fn() as any;

const mockUserFindUnique = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    notification: {
      findMany: mockNotificationFindMany,
      findFirst: mockNotificationFindFirst,
      findUnique: mockNotificationFindUnique,
      count: mockNotificationCount,
      create: mockNotificationCreate,
      update: mockNotificationUpdate,
      updateMany: mockNotificationUpdateMany,
      deleteMany: mockNotificationDeleteMany,
    },
    user: {
      findUnique: mockUserFindUnique,
    },
  },
}));

const {
  listNotificationsSchema,
  notificationIdSchema,
  createNotificationSchema,
  updateNotificationSchema,
} = await import("../validators/notification.validator.js");

const { NotificationService, NotificationError } =
  await import("../services/notification.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const USER_ID = "660e8400-e29b-41d4-a716-446655440099";
const NOTIF_ID = "770e8400-e29b-41d4-a716-446655440011";

// ── T-A15: Notification Validator Tests ─────────────────────────

describe("T-A15: Notification Validators", () => {
  describe("listNotificationsSchema", () => {
    it("accepts empty query", () => {
      expect(listNotificationsSchema.safeParse({ query: {} }).success).toBe(true);
    });

    it("accepts isRead filter", () => {
      const result = listNotificationsSchema.safeParse({
        query: { isRead: "true", page: "1", limit: "10" },
      });
      expect(result.success).toBe(true);
    });

    it("accepts isRead=false", () => {
      const result = listNotificationsSchema.safeParse({
        query: { isRead: "false" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid isRead value", () => {
      const result = listNotificationsSchema.safeParse({
        query: { isRead: "maybe" },
      });
      expect(result.success).toBe(false);
    });

    it("accepts type filter", () => {
      const result = listNotificationsSchema.safeParse({
        query: { type: "BADGE_EARNED" },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("notificationIdSchema", () => {
    it("accepts valid UUID", () => {
      expect(notificationIdSchema.safeParse({ params: { id: VALID_UUID } }).success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      expect(notificationIdSchema.safeParse({ params: { id: "bad" } }).success).toBe(false);
    });
  });

  describe("createNotificationSchema", () => {
    it("accepts valid input", () => {
      const result = createNotificationSchema.safeParse({
        body: {
          userId: VALID_UUID,
          type: "BADGE_EARNED",
          content: "You earned a new badge!",
        },
      });
      expect(result.success).toBe(true);
    });

    it("accepts metadata with deep-link data", () => {
      const result = createNotificationSchema.safeParse({
        body: {
          userId: VALID_UUID,
          type: "NEW_LESSON",
          content: "New lesson available",
          metadata: { screen: "lesson", params: { lessonId: VALID_UUID } },
        },
      });
      expect(result.success).toBe(true);
    });

    it("accepts null metadata", () => {
      const result = createNotificationSchema.safeParse({
        body: {
          userId: VALID_UUID,
          type: "INFO",
          content: "System update",
          metadata: null,
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty content", () => {
      const result = createNotificationSchema.safeParse({
        body: {
          userId: VALID_UUID,
          type: "INFO",
          content: "",
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects content exceeding 1000 chars", () => {
      const result = createNotificationSchema.safeParse({
        body: {
          userId: VALID_UUID,
          type: "INFO",
          content: "x".repeat(1001),
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing userId", () => {
      const result = createNotificationSchema.safeParse({
        body: { type: "INFO", content: "Test" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateNotificationSchema", () => {
    it("accepts partial update", () => {
      const result = updateNotificationSchema.safeParse({
        params: { id: VALID_UUID },
        body: { content: "Updated content" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty body", () => {
      const result = updateNotificationSchema.safeParse({
        params: { id: VALID_UUID },
        body: {},
      });
      expect(result.success).toBe(false);
    });
  });
});

// ── T-A15: NotificationService Unit Tests ───────────────────────

describe("T-A15: NotificationService", () => {
  let service: InstanceType<typeof NotificationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationService();
  });

  describe("listForUser", () => {
    it("returns paginated notifications", async () => {
      const mockData = [{ id: NOTIF_ID, type: "INFO", content: "Test" }];
      mockNotificationFindMany.mockResolvedValue(mockData);
      mockNotificationCount.mockResolvedValue(1);

      const result = await service.listForUser(USER_ID, {});
      expect(result.notifications).toEqual(mockData);
      expect(result.meta.total).toBe(1);
    });

    it("filters by isRead=true", async () => {
      mockNotificationFindMany.mockResolvedValue([]);
      mockNotificationCount.mockResolvedValue(0);

      await service.listForUser(USER_ID, { isRead: "true" });
      expect(mockNotificationFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isRead: true }),
        }),
      );
    });

    it("filters by isRead=false", async () => {
      mockNotificationFindMany.mockResolvedValue([]);
      mockNotificationCount.mockResolvedValue(0);

      await service.listForUser(USER_ID, { isRead: "false" });
      expect(mockNotificationFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isRead: false }),
        }),
      );
    });
  });

  describe("getForUser", () => {
    it("returns notification when found", async () => {
      const mockN = { id: NOTIF_ID, userId: USER_ID };
      mockNotificationFindFirst.mockResolvedValue(mockN);

      const result = await service.getForUser(USER_ID, NOTIF_ID);
      expect(result).toEqual(mockN);
    });

    it("throws NOTIFICATION_NOT_FOUND when not found", async () => {
      mockNotificationFindFirst.mockResolvedValue(null);
      await expect(service.getForUser(USER_ID, NOTIF_ID)).rejects.toThrow(NotificationError);
    });
  });

  describe("getUnreadCount", () => {
    it("returns unread count", async () => {
      mockNotificationCount.mockResolvedValue(5);

      const result = await service.getUnreadCount(USER_ID);
      expect(result.count).toBe(5);
      expect(mockNotificationCount).toHaveBeenCalledWith({
        where: { userId: USER_ID, isRead: false },
      });
    });
  });

  describe("markAsRead", () => {
    it("marks notification as read", async () => {
      mockNotificationUpdateMany.mockResolvedValue({ count: 1 });
      mockNotificationFindFirst.mockResolvedValue({ id: NOTIF_ID, isRead: true });

      const result = await service.markAsRead(USER_ID, NOTIF_ID);
      expect(result.isRead).toBe(true);
    });

    it("throws when notification not found", async () => {
      mockNotificationUpdateMany.mockResolvedValue({ count: 0 });
      await expect(service.markAsRead(USER_ID, NOTIF_ID)).rejects.toThrow(NotificationError);
    });
  });

  describe("markAllAsRead", () => {
    it("returns count of updated notifications", async () => {
      mockNotificationUpdateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead(USER_ID);
      expect(result.updatedCount).toBe(3);
    });
  });

  describe("create", () => {
    it("creates notification when user exists", async () => {
      mockUserFindUnique.mockResolvedValue({ id: USER_ID });
      const created = { id: NOTIF_ID, type: "INFO", content: "Test" };
      mockNotificationCreate.mockResolvedValue(created);

      const result = await service.create({
        userId: USER_ID,
        type: "INFO",
        content: "Test notification",
      });
      expect(result).toEqual(created);
    });

    it("throws USER_NOT_FOUND when user doesn't exist", async () => {
      mockUserFindUnique.mockResolvedValue(null);
      await expect(
        service.create({ userId: USER_ID, type: "INFO", content: "Test" }),
      ).rejects.toThrow(NotificationError);
    });
  });

  describe("update", () => {
    it("updates when notification exists", async () => {
      mockNotificationFindUnique.mockResolvedValue({ id: NOTIF_ID });
      const updated = { id: NOTIF_ID, content: "Updated" };
      mockNotificationUpdate.mockResolvedValue(updated);

      const result = await service.update(NOTIF_ID, { content: "Updated" });
      expect(result.content).toBe("Updated");
    });

    it("throws when notification doesn't exist", async () => {
      mockNotificationFindUnique.mockResolvedValue(null);
      await expect(service.update(NOTIF_ID, { content: "Updated" })).rejects.toThrow(
        NotificationError,
      );
    });
  });

  describe("deleteForUser", () => {
    it("deletes when notification exists", async () => {
      mockNotificationDeleteMany.mockResolvedValue({ count: 1 });
      await expect(service.deleteForUser(USER_ID, NOTIF_ID)).resolves.toBeUndefined();
    });

    it("throws when notification not found", async () => {
      mockNotificationDeleteMany.mockResolvedValue({ count: 0 });
      await expect(service.deleteForUser(USER_ID, NOTIF_ID)).rejects.toThrow(NotificationError);
    });
  });
});
