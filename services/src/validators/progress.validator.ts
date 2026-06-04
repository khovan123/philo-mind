import { z } from "zod";

// ── T-A09: User Progress Validation Schemas ─────────────────

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");

export const upsertProgressSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid("Lesson id không hợp lệ"),
  }),
  body: z.object({
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
    progressPercent: z
      .number()
      .int()
      .min(0, "Tiến độ tối thiểu 0%")
      .max(100, "Tiến độ tối đa 100%")
      .optional(),
  }),
});

export const listProgressSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
  }),
});

export const progressByLessonSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid("Lesson id không hợp lệ"),
  }),
});

export const progressByTopicSchema = z.object({
  params: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
  }),
});

export type UpsertProgressInput = z.infer<typeof upsertProgressSchema>["body"];
export type ListProgressQuery = z.infer<typeof listProgressSchema>["query"];
