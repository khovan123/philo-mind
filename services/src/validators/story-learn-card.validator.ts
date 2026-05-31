import { z } from "zod";

// ── T-D01: StoryLearnCard Validation Schemas ──────────────────

export const createStoryLearnCardSchema = z.object({
  params: z.object({
    storyId: z.string().uuid("Story id không hợp lệ"),
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Tiêu đề card là bắt buộc")
      .max(200, "Tiêu đề card tối đa 200 ký tự"),
    body: z.string().trim().min(1, "Nội dung card là bắt buộc"),
    sourceRef: z.string().trim().max(200, "Nguồn tham khảo tối đa 200 ký tự").optional(),
    order: z.number().int().min(0, "Order phải >= 0").default(0),
    tagIds: z.array(z.string().uuid("Tag id không hợp lệ")).optional(),
  }),
});

export const updateStoryLearnCardSchema = z.object({
  params: z.object({
    storyId: z.string().uuid("Story id không hợp lệ"),
    id: z.string().uuid("Card id không hợp lệ"),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Tiêu đề card là bắt buộc")
        .max(200, "Tiêu đề card tối đa 200 ký tự")
        .optional(),
      body: z.string().trim().min(1, "Nội dung card là bắt buộc").optional(),
      sourceRef: z
        .string()
        .trim()
        .max(200, "Nguồn tham khảo tối đa 200 ký tự")
        .nullable()
        .optional(),
      order: z.number().int().min(0, "Order phải >= 0").optional(),
      tagIds: z.array(z.string().uuid("Tag id không hợp lệ")).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    }),
});

export const storyLearnCardIdSchema = z.object({
  params: z.object({
    storyId: z.string().uuid("Story id không hợp lệ"),
    id: z.string().uuid("Card id không hợp lệ"),
  }),
});

export const listStoryLearnCardsSchema = z.object({
  params: z.object({
    storyId: z.string().uuid("Story id không hợp lệ"),
  }),
});

export type CreateStoryLearnCardInput = z.infer<typeof createStoryLearnCardSchema>["body"];
export type UpdateStoryLearnCardInput = z.infer<typeof updateStoryLearnCardSchema>["body"];
