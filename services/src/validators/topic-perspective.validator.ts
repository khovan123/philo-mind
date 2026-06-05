import { z } from "zod";

// ── T-H01: TopicPerspective Validation Schemas ────────────────

export const PerspectiveTypeEnum = z.enum([
  "TECH",
  "ETHICAL",
  "ECONOMIC",
  "SOCIAL",
  "PHILOSOPHICAL",
]);

export const createTopicPerspectiveSchema = z.object({
  params: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
  }),
  body: z.object({
    perspectiveType: PerspectiveTypeEnum,
    content: z.string().trim().min(1, "Nội dung perspective là bắt buộc"),
  }),
});

export const updateTopicPerspectiveSchema = z.object({
  params: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
    id: z.string().uuid("Perspective id không hợp lệ"),
  }),
  body: z.object({
    content: z.string().trim().min(1, "Nội dung perspective là bắt buộc"),
  }),
});

export const topicPerspectiveIdSchema = z.object({
  params: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
    id: z.string().uuid("Perspective id không hợp lệ"),
  }),
});

export const listTopicPerspectivesSchema = z.object({
  params: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
  }),
});

export type CreateTopicPerspectiveInput = z.infer<typeof createTopicPerspectiveSchema>["body"];
export type UpdateTopicPerspectiveInput = z.infer<typeof updateTopicPerspectiveSchema>["body"];
