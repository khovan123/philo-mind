import { Prisma, type TargetType } from "../prisma/generated/client.js";
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
    const targetExists = await this.targetExists(input);
    if (!targetExists) {
      throw new BookmarkError("BOOKMARK_TARGET_NOT_FOUND", "Không tìm thấy nội dung để bookmark", 404);
    }

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
        await prisma.bookmark.deleteMany({
          where: {
            userId,
            targetType: input.targetType,
            targetId: input.targetId,
          },
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

  private async targetExists(input: BookmarkTargetInput): Promise<boolean> {
    switch (input.targetType) {
      case "LESSON":
        return Boolean(await prisma.lesson.findUnique({ where: { id: input.targetId }, select: { id: true } }));
      case "SHORT_LESSON":
        return Boolean(await prisma.shortLesson.findUnique({ where: { id: input.targetId }, select: { id: true } }));
      case "STORY":
        return Boolean(await prisma.storyScenario.findUnique({ where: { id: input.targetId }, select: { id: true } }));
      case "DEBATE":
        return Boolean(await prisma.debate.findUnique({ where: { id: input.targetId }, select: { id: true } }));
      case "TOPIC":
        return Boolean(await prisma.topic.findUnique({ where: { id: input.targetId }, select: { id: true } }));
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
