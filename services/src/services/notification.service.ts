import { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type {
  CreateNotificationInput,
  ListNotificationsQuery,
  UpdateNotificationInput,
} from "../validators/notification.validator.js";

// ── T-A15: Notification Service ──────────────────────────────

function toPrismaJson(metadata: unknown) {
  if (metadata === null) {
    return Prisma.DbNull;
  }
  return metadata as Prisma.InputJsonValue | undefined;
}

export class NotificationService {
  async listForUser(userId: string, query: ListNotificationsQuery) {
    const { page, limit, skip } = parsePagination(query);
    const isRead = query.isRead === undefined ? undefined : query.isRead === "true";

    const where = {
      userId,
      ...(isRead !== undefined ? { isRead } : {}),
      ...(query.type ? { type: query.type } : {}),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getForUser(userId: string, notificationId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotificationError("NOTIFICATION_NOT_FOUND", "Không tìm thấy thông báo", 404);
    }

    return notification;
  }

  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }

  async markAsRead(userId: string, notificationId: string) {
    const result = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });

    if (result.count === 0) {
      throw new NotificationError("NOTIFICATION_NOT_FOUND", "Không tìm thấy thông báo", 404);
    }

    return this.getForUser(userId, notificationId);
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { updatedCount: result.count };
  }

  async deleteForUser(userId: string, notificationId: string) {
    const result = await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });

    if (result.count === 0) {
      throw new NotificationError("NOTIFICATION_NOT_FOUND", "Không tìm thấy thông báo", 404);
    }
  }

  async create(input: CreateNotificationInput) {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotificationError("USER_NOT_FOUND", "Không tìm thấy người dùng", 404);
    }

    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        content: input.content,
        metadata: toPrismaJson(input.metadata),
      },
    });
  }

  async update(notificationId: string, input: UpdateNotificationInput) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { id: true },
    });

    if (!notification) {
      throw new NotificationError("NOTIFICATION_NOT_FOUND", "Không tìm thấy thông báo", 404);
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: {
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.metadata !== undefined ? { metadata: toPrismaJson(input.metadata) } : {}),
      },
    });
  }
}

export class NotificationError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "NotificationError";
  }
}

export const notificationService = new NotificationService();
