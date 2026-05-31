import { z } from "zod";

// ── T-D04: Choice Validation Schemas ─────────────────────────

export const getConsequenceByChoiceSchema = z.object({
  params: z.object({
    choiceId: z.string().uuid("Choice ID không hợp lệ"),
  }),
});

export type GetConsequenceByChoiceInput = z.infer<typeof getConsequenceByChoiceSchema>;
