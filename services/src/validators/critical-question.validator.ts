import { z } from "zod";

// ── T-A12: Critical Question Validation Schemas ────────────────

export const criticalQuestionTypes = ["OPEN_TEXT", "MORAL_DILEMMA", "LOGIC"] as const;

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");
const criticalQuestionTypeSchema = z.enum(criticalQuestionTypes);

const questionBodySchema = z.object({
  topicId: z.string().uuid("Topic id không hợp lệ"),
  question: z.string().trim().min(1, "Câu hỏi là bắt buộc").max(2000, "Câu hỏi tối đa 2000 ký tự"),
  questionType: criticalQuestionTypeSchema,
});

export const listCriticalQuestionsSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    questionType: criticalQuestionTypeSchema.optional(),
  }),
});

export const randomCriticalQuestionSchema = z.object({
  query: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    questionType: criticalQuestionTypeSchema.optional(),
  }),
});

export const adminListCriticalQuestionsSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    questionType: criticalQuestionTypeSchema.optional(),
    sortBy: z.enum(["createdAt", "questionType"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const criticalQuestionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Critical question id không hợp lệ"),
  }),
});

export const createCriticalQuestionSchema = z.object({
  body: questionBodySchema,
});

export const updateCriticalQuestionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Critical question id không hợp lệ"),
  }),
  body: questionBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Cần ít nhất một trường để cập nhật",
  }),
});

export type CriticalQuestionType = (typeof criticalQuestionTypes)[number];
export type ListCriticalQuestionsQuery = z.infer<typeof listCriticalQuestionsSchema>["query"];
export type RandomCriticalQuestionQuery = z.infer<typeof randomCriticalQuestionSchema>["query"];
export type AdminListCriticalQuestionsQuery = z.infer<typeof adminListCriticalQuestionsSchema>["query"];
export type CreateCriticalQuestionInput = z.infer<typeof createCriticalQuestionSchema>["body"];
export type UpdateCriticalQuestionInput = z.infer<typeof updateCriticalQuestionSchema>["body"];
