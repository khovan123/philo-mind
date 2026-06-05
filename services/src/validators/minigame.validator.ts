import { z } from "zod";

// ── T-H03: MiniGame Validation Schemas ───────────────────────

export const miniGameTypes = ["matching", "guess-who", "logic-puzzle"] as const;

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");
const miniGameTypeSchema = z.enum(miniGameTypes);
const jsonObjectSchema = z.record(z.string(), z.unknown());

const miniGameBodySchema = z.object({
  topicId: z.string().uuid("Topic id không hợp lệ").nullable().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Tiêu đề mini game là bắt buộc")
    .max(200, "Tiêu đề mini game tối đa 200 ký tự"),
  gameType: miniGameTypeSchema,
  description: z.string().trim().max(2000, "Mô tả tối đa 2000 ký tự").nullable().optional(),
  config: jsonObjectSchema.optional(),
});

export const listMiniGamesSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    type: miniGameTypeSchema.optional(),
  }),
});

export const miniGameIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Mini game id không hợp lệ"),
  }),
});

export const createMiniGameSchema = z.object({
  body: miniGameBodySchema,
});

export const updateMiniGameSchema = z.object({
  params: z.object({
    id: z.string().uuid("Mini game id không hợp lệ"),
  }),
  body: miniGameBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Cần ít nhất một trường để cập nhật",
  }),
});

export const playMiniGameSchema = z.object({
  params: z.object({
    id: z.string().uuid("Mini game id không hợp lệ"),
  }),
  body: z.object({
    answers: z.unknown(),
    timeSpentSeconds: z.number().int().min(0, "Thời gian chơi không hợp lệ").max(86400),
  }),
});

export type MiniGameType = (typeof miniGameTypes)[number];
export type ListMiniGamesQuery = z.infer<typeof listMiniGamesSchema>["query"];
export type CreateMiniGameInput = z.infer<typeof createMiniGameSchema>["body"];
export type UpdateMiniGameInput = z.infer<typeof updateMiniGameSchema>["body"];
export type PlayMiniGameInput = z.infer<typeof playMiniGameSchema>["body"];
