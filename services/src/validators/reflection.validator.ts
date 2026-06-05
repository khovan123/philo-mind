import { z } from "zod";

// ── T-A11: Reflection Validation Schemas ───────────────────────

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");
const nullableUuid = z.string().uuid("Id không hợp lệ").nullable();

const reflectionBodySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Nội dung phản tư là bắt buộc")
    .max(10000, "Nội dung phản tư tối đa 10000 ký tự"),
  topicId: nullableUuid.optional(),
  questionId: nullableUuid.optional(),
});

export const listReflectionsSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    questionId: z.string().uuid("Critical question id không hợp lệ").optional(),
  }),
});

export const reflectionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Reflection id không hợp lệ"),
  }),
});

export const createReflectionSchema = z.object({
  body: reflectionBodySchema,
});

export const updateReflectionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Reflection id không hợp lệ"),
  }),
  body: reflectionBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Cần ít nhất một trường để cập nhật",
  }),
});

export type ListReflectionsQuery = z.infer<typeof listReflectionsSchema>["query"];
export type CreateReflectionInput = z.infer<typeof createReflectionSchema>["body"];
export type UpdateReflectionInput = z.infer<typeof updateReflectionSchema>["body"];
