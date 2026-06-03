import { z } from "zod";

// ── T-A10: Quiz Validation Schemas ──────────────────────────

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");

export const listQuizzesSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    lessonId: z.string().uuid("Lesson id không hợp lệ").optional(),
  }),
});

export const quizIdSchema = z.object({
  params: z.object({
    quizId: z.string().uuid("Quiz id không hợp lệ"),
  }),
});

export const startAttemptSchema = z.object({
  params: z.object({
    quizId: z.string().uuid("Quiz id không hợp lệ"),
  }),
});

export const submitAnswerSchema = z.object({
  params: z.object({
    attemptId: z.string().uuid("Attempt id không hợp lệ"),
  }),
  body: z.object({
    questionId: z.string().uuid("Question id không hợp lệ"),
    selectedOptionId: z.string().uuid("Option id không hợp lệ").nullable().optional(),
    textAnswer: z.string().trim().max(5000, "Câu trả lời tối đa 5000 ký tự").nullable().optional(),
  }),
});

export const completeAttemptSchema = z.object({
  params: z.object({
    attemptId: z.string().uuid("Attempt id không hợp lệ"),
  }),
});

export const attemptIdSchema = z.object({
  params: z.object({
    attemptId: z.string().uuid("Attempt id không hợp lệ"),
  }),
});

export type ListQuizzesQuery = z.infer<typeof listQuizzesSchema>["query"];
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>["body"];
