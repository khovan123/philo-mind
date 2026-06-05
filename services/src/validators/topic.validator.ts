import { z } from "zod";

// ── T-A06: Topic Validation Schemas ──────────────────────────

const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

export const listTopicsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z.string().regex(/^\d+$/).default("10").transform(Number),
    search: z.string().optional(),
    category: z.string().optional(),
    difficulty: DifficultyEnum.optional(),
  }),
});

export const topicIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ"),
  }),
});

export const createTopicSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title là bắt buộc"),
    description: z.string().optional(),
    category: z.string().optional(),
    difficulty: DifficultyEnum.default("EASY"),
  }),
});

export const updateTopicSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ"),
  }),
  body: z.object({
    title: z.string().trim().min(1, "Title không được trống").optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    difficulty: DifficultyEnum.optional(),
  }),
});

export type ListTopicsInput = z.infer<typeof listTopicsSchema>["query"];
export type CreateTopicInput = z.infer<typeof createTopicSchema>["body"];
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>["body"];
