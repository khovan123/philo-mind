import { z } from "zod";

// ── T-D01: PhilosophyTag Validation Schemas ───────────────────

export const createPhilosophyTagSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Tên tag là bắt buộc").max(100, "Tên tag tối đa 100 ký tự"),
    description: z.string().trim().max(2000, "Mô tả tối đa 2000 ký tự").optional(),
  }),
});

export const tagIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Tag id không hợp lệ"),
  }),
});

export type CreatePhilosophyTagInput = z.infer<typeof createPhilosophyTagSchema>["body"];
