import { z } from "zod";

// ── T-A07: Lesson Validation Schemas ──────────────────────────

const ContentStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const QuestionTypeEnum = z.enum([
  "OPEN_TEXT",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "MORAL_DILEMMA",
  "LOGIC",
]);

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");

export const listLessonsSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    topicId: z.string().uuid("Topic ID không hợp lệ").optional(),
    status: ContentStatusEnum.optional(),
    search: z.string().optional(),
  }),
});

export const lessonIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Lesson ID không hợp lệ"),
  }),
});

export const createLessonSchema = z.object({
  body: z.object({
    topicId: z.string().uuid("Topic ID không hợp lệ"),
    title: z.string().trim().min(1, "Tiêu đề là bắt buộc").max(200, "Tiêu đề tối đa 200 ký tự"),
    content: z.string().trim().min(1, "Nội dung bài học là bắt buộc"),
    realLifeExample: z.string().trim().optional(),
    conflict: z.string().trim().optional(),
    estimatedMinutes: z
      .number()
      .int()
      .positive("Thời lượng ước tính phải là số nguyên dương")
      .optional(),
    status: ContentStatusEnum.default("DRAFT"),
    questions: z
      .array(
        z.object({
          question: z.string().trim().min(1, "Nội dung câu hỏi không được để trống"),
          questionType: QuestionTypeEnum.default("OPEN_TEXT"),
        }),
      )
      .optional(),
  }),
});

export const updateLessonSchema = z.object({
  params: z.object({
    id: z.string().uuid("Lesson ID không hợp lệ"),
  }),
  body: z
    .object({
      topicId: z.string().uuid("Topic ID không hợp lệ").optional(),
      title: z
        .string()
        .trim()
        .min(1, "Tiêu đề không được trống")
        .max(200, "Tiêu đề tối đa 200 ký tự")
        .optional(),
      content: z.string().trim().min(1, "Nội dung bài học không được trống").optional(),
      realLifeExample: z.string().trim().optional(),
      conflict: z.string().trim().optional(),
      estimatedMinutes: z
        .number()
        .int()
        .positive("Thời lượng ước tính phải là số nguyên dương")
        .optional(),
      status: ContentStatusEnum.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    }),
});

export const submitAnswerSchema = z.object({
  params: z.object({
    questionId: z.string().uuid("Question ID không hợp lệ"),
  }),
  body: z.object({
    answerText: z.string().trim().min(1, "Nội dung trả lời không được trống"),
  }),
});

export type ListLessonsInput = z.infer<typeof listLessonsSchema>["query"];
export type CreateLessonInput = z.infer<typeof createLessonSchema>["body"];
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>["body"];
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>["body"];
