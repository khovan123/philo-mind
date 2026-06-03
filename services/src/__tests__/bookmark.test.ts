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
const mockBookmarkFindMany = jest.fn() as any;
const mockBookmarkFindUnique = jest.fn() as any;
const mockBookmarkCount = jest.fn() as any;
const mockBookmarkCreate = jest.fn() as any;
const mockBookmarkDeleteMany = jest.fn() as any;

const mockLessonFindUnique = jest.fn() as any;
const mockShortLessonFindUnique = jest.fn() as any;
const mockStoryScenarioFindUnique = jest.fn() as any;
const mockDebateFindUnique = jest.fn() as any;
const mockTopicFindUnique = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    bookmark: {
      findMany: mockBookmarkFindMany,
      findUnique: mockBookmarkFindUnique,
      count: mockBookmarkCount,
      create: mockBookmarkCreate,
      deleteMany: mockBookmarkDeleteMany,
    },
    lesson: { findUnique: mockLessonFindUnique },
    shortLesson: { findUnique: mockShortLessonFindUnique },
    storyScenario: { findUnique: mockStoryScenarioFindUnique },
    debate: { findUnique: mockDebateFindUnique },
    topic: { findUnique: mockTopicFindUnique },
  },
}));

const { listBookmarksSchema, bookmarkStatusSchema, toggleBookmarkSchema, bookmarkIdSchema } =
  await import("../validators/bookmark.validator.js");

const { BookmarkService, BookmarkError } = await import("../services/bookmark.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const USER_ID = "660e8400-e29b-41d4-a716-446655440099";
const TARGET_ID = "770e8400-e29b-41d4-a716-446655440011";

// ── T-A14: Bookmark Validator Tests ─────────────────────────────

describe("T-A14: Bookmark Validators", () => {
  describe("listBookmarksSchema", () => {
    it("accepts empty query", () => {
      expect(listBookmarksSchema.safeParse({ query: {} }).success).toBe(true);
    });

    it("accepts valid targetType filter", () => {
      const result = listBookmarksSchema.safeParse({
        query: { targetType: "LESSON", page: "1", limit: "10" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid targetType", () => {
      const result = listBookmarksSchema.safeParse({
        query: { targetType: "INVALID" },
      });
      expect(result.success).toBe(false);
    });

    it("accepts all 5 target types", () => {
      const types = ["LESSON", "SHORT_LESSON", "STORY", "DEBATE", "TOPIC"];
      for (const t of types) {
        expect(listBookmarksSchema.safeParse({ query: { targetType: t } }).success).toBe(true);
      }
    });
  });

  describe("bookmarkStatusSchema", () => {
    it("accepts valid targetType and targetId", () => {
      const result = bookmarkStatusSchema.safeParse({
        query: { targetType: "LESSON", targetId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing targetId", () => {
      const result = bookmarkStatusSchema.safeParse({
        query: { targetType: "LESSON" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("toggleBookmarkSchema", () => {
    it("accepts valid toggle input", () => {
      const result = toggleBookmarkSchema.safeParse({
        body: { targetType: "DEBATE", targetId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid targetType", () => {
      const result = toggleBookmarkSchema.safeParse({
        body: { targetType: "QUIZ", targetId: VALID_UUID },
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid targetId", () => {
      const result = toggleBookmarkSchema.safeParse({
        body: { targetType: "LESSON", targetId: "not-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("bookmarkIdSchema", () => {
    it("accepts valid UUID", () => {
      expect(bookmarkIdSchema.safeParse({ params: { id: VALID_UUID } }).success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      expect(bookmarkIdSchema.safeParse({ params: { id: "bad" } }).success).toBe(false);
    });
  });
});

// ── T-A14: BookmarkService Unit Tests ───────────────────────────

describe("T-A14: BookmarkService", () => {
  let service: InstanceType<typeof BookmarkService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookmarkService();
  });

  describe("listForUser", () => {
    it("returns paginated bookmarks", async () => {
      const mockData = [{ id: "b1", targetType: "LESSON", targetId: TARGET_ID }];
      mockBookmarkFindMany.mockResolvedValue(mockData);
      mockBookmarkCount.mockResolvedValue(1);

      const result = await service.listForUser(USER_ID, {});
      expect(result.bookmarks).toEqual(mockData);
      expect(result.meta.total).toBe(1);
    });

    it("filters by targetType", async () => {
      mockBookmarkFindMany.mockResolvedValue([]);
      mockBookmarkCount.mockResolvedValue(0);

      await service.listForUser(USER_ID, { targetType: "DEBATE" });
      expect(mockBookmarkFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ targetType: "DEBATE" }),
        }),
      );
    });
  });

  describe("getStatus", () => {
    it("returns bookmarked=true when bookmark exists", async () => {
      const mockBm = { id: "b1", userId: USER_ID };
      mockBookmarkFindUnique.mockResolvedValue(mockBm);

      const result = await service.getStatus(USER_ID, {
        targetType: "LESSON",
        targetId: TARGET_ID,
      });
      expect(result.bookmarked).toBe(true);
      expect(result.bookmark).toEqual(mockBm);
    });

    it("returns bookmarked=false when no bookmark", async () => {
      mockBookmarkFindUnique.mockResolvedValue(null);

      const result = await service.getStatus(USER_ID, {
        targetType: "LESSON",
        targetId: TARGET_ID,
      });
      expect(result.bookmarked).toBe(false);
    });
  });

  describe("toggle", () => {
    it("creates bookmark when target exists and not bookmarked", async () => {
      mockLessonFindUnique.mockResolvedValue({ id: TARGET_ID });
      const created = { id: "b1", userId: USER_ID };
      mockBookmarkCreate.mockResolvedValue(created);

      const result = await service.toggle(USER_ID, {
        targetType: "LESSON",
        targetId: TARGET_ID,
      });
      expect(result.bookmarked).toBe(true);
    });

    it("removes bookmark on duplicate (toggle off)", async () => {
      mockLessonFindUnique.mockResolvedValue({ id: TARGET_ID });

      // Simulate Prisma unique constraint error
      const prismaModule = await import("../prisma/generated/client.js");
      const uniqueError = new (prismaModule.Prisma as any).PrismaClientKnownRequestError(
        "Unique constraint",
        { code: "P2002", clientVersion: "5.0.0" },
      );
      mockBookmarkCreate.mockRejectedValue(uniqueError);
      mockBookmarkDeleteMany.mockResolvedValue({ count: 1 });

      const result = await service.toggle(USER_ID, {
        targetType: "LESSON",
        targetId: TARGET_ID,
      });
      expect(result.bookmarked).toBe(false);
      expect(result.bookmark).toBeNull();
    });

    it("throws BOOKMARK_TARGET_NOT_FOUND for non-existent target", async () => {
      mockLessonFindUnique.mockResolvedValue(null);

      await expect(
        service.toggle(USER_ID, { targetType: "LESSON", targetId: TARGET_ID }),
      ).rejects.toThrow(BookmarkError);
    });

    it("checks correct model per targetType", async () => {
      // Test STORY target type
      mockStoryScenarioFindUnique.mockResolvedValue({ id: TARGET_ID });
      mockBookmarkCreate.mockResolvedValue({ id: "b2" });

      await service.toggle(USER_ID, { targetType: "STORY", targetId: TARGET_ID });
      expect(mockStoryScenarioFindUnique).toHaveBeenCalled();

      // Test DEBATE target type
      jest.clearAllMocks();
      mockDebateFindUnique.mockResolvedValue({ id: TARGET_ID });
      mockBookmarkCreate.mockResolvedValue({ id: "b3" });

      await service.toggle(USER_ID, { targetType: "DEBATE", targetId: TARGET_ID });
      expect(mockDebateFindUnique).toHaveBeenCalled();
    });
  });

  describe("deleteForUser", () => {
    it("deletes when bookmark exists", async () => {
      mockBookmarkDeleteMany.mockResolvedValue({ count: 1 });
      await expect(service.deleteForUser(USER_ID, VALID_UUID)).resolves.toBeUndefined();
    });

    it("throws BOOKMARK_NOT_FOUND when not found", async () => {
      mockBookmarkDeleteMany.mockResolvedValue({ count: 0 });
      await expect(service.deleteForUser(USER_ID, VALID_UUID)).rejects.toThrow(BookmarkError);
    });
  });
});
