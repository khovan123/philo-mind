import { z } from "zod";

// ── T-A14: Bookmark Validation Schemas ───────────────────────

export const bookmarkTargetTypes = ["LESSON", "SHORT_LESSON", "STORY", "TOPIC"] as const;

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");
const bookmarkTargetSchema = z.object({
  targetType: z.enum(bookmarkTargetTypes),
  targetId: z.string().uuid("Target id không hợp lệ"),
});

export const listBookmarksSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    targetType: z.enum(bookmarkTargetTypes).optional(),
  }),
});

export const bookmarkStatusSchema = z.object({
  query: bookmarkTargetSchema,
});

export const toggleBookmarkSchema = z.object({
  body: bookmarkTargetSchema,
});

export const bookmarkIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Bookmark id không hợp lệ"),
  }),
});

export type BookmarkTargetType = (typeof bookmarkTargetTypes)[number];
export type ListBookmarksQuery = z.infer<typeof listBookmarksSchema>["query"];
export type BookmarkTargetInput = z.infer<typeof toggleBookmarkSchema>["body"];
