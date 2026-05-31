import { Prisma, type TargetType } from "../prisma/generated/client";
import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, parsePagination } from "../utils/response.js";
import type { BookmarkTargetInput, ListBookmarksQuery } from "../validators/bookmark.validator.js";

// ── T-A14: Bookmark Service ──────────────────────────────────

export class BookmarkService {
  async listForUser(userId: string, query: ListBookmarksQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = {
      userId,
      ...(query.targetType ? { targetType: query.targetType as TargetType } : {}),
    };

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where }),
    ]);

    return {
      bookmarks,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getStatus(userId: string, input: BookmarkTargetInput) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: input.targetType,
          targetId: input.targetId,
        },
      },
    });

    return {
      bookmarked: Boolean(bookmark),
      bookmark,
    };
  }

  async toggle(userId: string, input: BookmarkTargetInput) {
    try {
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          targetType: input.targetType,
          targetId: input.targetId,
        },
      });

      return {
        bookmarked: true,
        bookmark,
      };
    } catch (err) {
      if (this.isUniqueConstraintError(err)) {
        const bookmark = await prisma.bookmark.findUnique({
          where: {
            userId_targetType_targetId: {
              userId,
              targetType: input.targetType,
              targetId: input.targetId,
            },
          },
          select: { id: true },
        });

        if (!bookmark) {
          throw new BookmarkError("BOOKMARK_CONFLICT", "Không thể cập nhật bookmark", 409);
        }

        await prisma.bookmark.delete({
          where: { id: bookmark.id },
        });

        return {
          bookmarked: false,
          bookmark: null,
        };
      }

      throw err;
    }
  }

  async deleteForUser(userId: string, bookmarkId: string) {
    const result = await prisma.bookmark.deleteMany({
      where: { id: bookmarkId, userId },
    });

    if (result.count === 0) {
      throw new BookmarkError("BOOKMARK_NOT_FOUND", "Không tìm thấy bookmark", 404);
    }
  }

  private isUniqueConstraintError(err: unknown): boolean {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
  }
}

export class BookmarkError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "BookmarkError";
  }
}

export const bookmarkService = new BookmarkService();
