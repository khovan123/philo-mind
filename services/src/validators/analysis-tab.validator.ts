import { z } from "zod";

// ── T-D01: AnalysisTab Validation Schemas ─────────────────────

export const analysisTabTypes = [
  "ETHICAL",
  "PHILOSOPHICAL",
  "POLITICAL_ECONOMIC",
  "HISTORICAL",
] as const;

export const createAnalysisTabSchema = z.object({
  params: z.object({
    consequenceId: z.string().uuid("Consequence id không hợp lệ"),
  }),
  body: z.object({
    tabType: z.enum(analysisTabTypes, {
      error: "tabType không hợp lệ",
    }),
    content: z.string().trim().min(1, "Nội dung tab là bắt buộc"),
    order: z.number().int().min(0, "Order phải >= 0").default(0),
  }),
});

export const updateAnalysisTabSchema = z.object({
  params: z.object({
    consequenceId: z.string().uuid("Consequence id không hợp lệ"),
    id: z.string().uuid("Tab id không hợp lệ"),
  }),
  body: z
    .object({
      content: z.string().trim().min(1, "Nội dung tab là bắt buộc").optional(),
      order: z.number().int().min(0, "Order phải >= 0").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    }),
});

export const analysisTabIdSchema = z.object({
  params: z.object({
    consequenceId: z.string().uuid("Consequence id không hợp lệ"),
    id: z.string().uuid("Tab id không hợp lệ"),
  }),
});

export const listAnalysisTabsSchema = z.object({
  params: z.object({
    consequenceId: z.string().uuid("Consequence id không hợp lệ"),
  }),
});

export type AnalysisTabTypeValue = (typeof analysisTabTypes)[number];
export type CreateAnalysisTabInput = z.infer<typeof createAnalysisTabSchema>["body"];
export type UpdateAnalysisTabInput = z.infer<typeof updateAnalysisTabSchema>["body"];
