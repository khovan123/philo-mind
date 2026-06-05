import { z } from "zod";

// ── T-A08: Short Lesson Validation Schemas ──────────────────────────

export const listShortLessonsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z.string().regex(/^\d+$/).default("10").transform(Number),
    topicId: z.string().uuid("Topic ID không hợp lệ").optional(),
  }),
});

export const shortLessonIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID bài học ngắn không hợp lệ"),
  }),
});

export const respondShortLessonSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID bài học ngắn không hợp lệ"),
  }),
  body: z.object({
    stance: z.enum(["STANCE_A", "STANCE_B"], {
      message: "Lựa chọn quan điểm chỉ có thể là STANCE_A hoặc STANCE_B",
    }),
    reason: z.string().trim().max(1000, "Lý do không được vượt quá 1000 ký tự").optional(),
  }),
});

export const commentShortLessonSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID bài học ngắn không hợp lệ"),
  }),
  body: z.object({
    commentText: z
      .string()
      .trim()
      .min(1, "Nội dung bình luận không được để trống")
      .max(2000, "Bình luận không được vượt quá 2000 ký tự"),
  }),
});

export type ListShortLessonsInput = z.infer<typeof listShortLessonsSchema>["query"];
export type RespondShortLessonInput = z.infer<typeof respondShortLessonSchema>["body"];
export type CommentShortLessonInput = z.infer<typeof commentShortLessonSchema>["body"];
