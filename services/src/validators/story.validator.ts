import { z } from "zod";

// ── T-D02: StoryScenario Validation Schemas ──────────────────

export const listStoryScenariosSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page phải là số nguyên dương").optional(),
    limit: z.string().regex(/^\d+$/, "Limit phải là số nguyên dương").optional(),
    topicId: z.string().uuid("Topic ID không hợp lệ").optional(),
    difficulty: z
      .enum(["EASY", "MEDIUM", "HARD"], {
        message: "Độ khó không hợp lệ",
      })
      .optional(),
    search: z.string().trim().optional(),
  }),
});

export const getStoryScenarioDetailSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID story scenario không hợp lệ"),
  }),
});

export type ListStoryScenariosInput = z.infer<typeof listStoryScenariosSchema>["query"];
export type GetStoryScenarioDetailInput = z.infer<typeof getStoryScenarioDetailSchema>["params"];
