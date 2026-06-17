import { z } from "zod";

// ── T-F05: Debate Validation Schemas ────────────────────────

export const listDebatesSchema = z.object({
  query: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ").optional(),
    stance: z.enum(["AGREE", "DISAGREE", "NEUTRAL", "ALTERNATIVE", "FOR", "AGAINST"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getDebateDetailSchema = z.object({
  params: z.object({
    id: z.string().uuid("Debate id không hợp lệ"),
  }),
});

export const createArgumentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Debate id không hợp lệ"),
  }),
  body: z.object({
    stance: z.enum(["AGREE", "DISAGREE", "NEUTRAL", "ALTERNATIVE", "FOR", "AGAINST"]),
    content: z.string().trim().min(1, "Nội dung lập luận là bắt buộc"),
    sources: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const voteArgumentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Argument id không hợp lệ"),
  }),
  body: z.object({
    value: z.enum(["UP", "DOWN"]),
  }),
});

export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Argument id không hợp lệ"),
  }),
  body: z.object({
    commentText: z.string().trim().min(1, "Nội dung bình luận là bắt buộc"),
  }),
});

export type ListDebatesQuery = z.infer<typeof listDebatesSchema>["query"];
export type CreateArgumentInput = z.infer<typeof createArgumentSchema>["body"];
export type VoteArgumentInput = z.infer<typeof voteArgumentSchema>["body"];
export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
