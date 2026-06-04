import { z } from "zod";

const uuid = z.string().uuid("ID khong hop le");
const positiveIntegerString = z.string().regex(/^\d+$/, "Phai la so nguyen duong");

export const listQuizzesSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    search: z.string().trim().optional(),
    topicId: uuid.optional(),
    lessonId: uuid.optional(),
    status: z.enum(["not-started", "in-progress", "completed"]).optional(),
  }),
});

export const quizIdSchema = z.object({
  params: z.object({
    quizId: uuid,
  }),
});

export const lessonQuizSchema = z.object({
  params: z.object({
    lessonId: uuid,
  }),
});

export const attemptIdSchema = z.object({
  params: z.object({
    attemptId: uuid,
  }),
});

export const submitQuizAnswerSchema = z.object({
  params: z.object({
    attemptId: uuid,
  }),
  body: z.object({
    questionId: uuid,
    selectedOptionId: uuid.optional(),
    textAnswer: z.string().trim().max(2000).optional(),
  }),
});

export type ListQuizzesInput = z.infer<typeof listQuizzesSchema>["query"];
export type SubmitQuizAnswerInput = z.infer<typeof submitQuizAnswerSchema>["body"];

export type ListQuizzesQuery = ListQuizzesInput;
export type SubmitAnswerInput = SubmitQuizAnswerInput;
