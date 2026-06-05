import { z } from "zod";

// ── T-F02: Scenario Validation Schemas ────────────────────────

export const listScenariosSchema = z.object({
  query: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getScenarioDetailSchema = z.object({
  params: z.object({
    id: z.string().uuid("Scenario id không hợp lệ"),
  }),
});

export const respondScenarioSchema = z.object({
  params: z.object({
    id: z.string().uuid("Scenario id không hợp lệ"),
  }),
  body: z.object({
    initialPosition: z.string().trim().min(1, "Lập trường ban đầu là bắt buộc"),
    reasoning: z.string().trim().optional(),
  }),
});

export const rethinkScenarioSchema = z.object({
  params: z.object({
    id: z.string().uuid("Scenario id không hợp lệ"),
  }),
  body: z.object({
    revisedPosition: z.string().trim().min(1, "Lập trường điều chỉnh là bắt buộc"),
    reflection: z.string().trim().optional(),
  }),
});

export type ListScenariosQuery = z.infer<typeof listScenariosSchema>["query"];
export type RespondScenarioInput = z.infer<typeof respondScenarioSchema>["body"];
export type RethinkScenarioInput = z.infer<typeof rethinkScenarioSchema>["body"];
