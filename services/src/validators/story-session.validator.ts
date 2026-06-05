import { z } from "zod";

// ── T-D03: StorySession Validation Schemas ────────────────────

export const startStorySessionSchema = z.object({
  params: z.object({
    storyId: z.string().uuid("Story ID không hợp lệ"),
  }),
});

export const decideStorySessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid("Session ID không hợp lệ"),
  }),
  body: z.object({
    choiceId: z.string().uuid("Choice ID không hợp lệ"),
    userReason: z.string().trim().max(1000, "Lý do tối đa 1000 ký tự").optional(),
  }),
});

export const completeStorySessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid("Session ID không hợp lệ"),
  }),
});

export type StartStorySessionInput = z.infer<typeof startStorySessionSchema>;
export type DecideStorySessionInput = z.infer<typeof decideStorySessionSchema>;
export type CompleteStorySessionInput = z.infer<typeof completeStorySessionSchema>;
