import { z } from "zod";

// ── T-A13: Mindmap Validation Schemas ────────────────────────

export const mindmapTopicIdSchema = z.object({
  params: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
  }),
});

export const nodeIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Node id không hợp lệ"),
  }),
});

export const edgeIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Edge id không hợp lệ"),
  }),
});

export const createMindmapNodeSchema = z.object({
  body: z.object({
    topicId: z.string().uuid("Topic id không hợp lệ"),
    title: z
      .string()
      .trim()
      .min(1, "Tiêu đề node là bắt buộc")
      .max(200, "Tiêu đề node tối đa 200 ký tự"),
    description: z.string().trim().max(2000, "Mô tả tối đa 2000 ký tự").optional(),
    nodeType: z
      .string()
      .trim()
      .min(1, "Loại node là bắt buộc")
      .max(100, "Loại node tối đa 100 ký tự"),
  }),
});

export const updateMindmapNodeSchema = z.object({
  params: z.object({
    id: z.string().uuid("Node id không hợp lệ"),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Tiêu đề node là bắt buộc")
        .max(200, "Tiêu đề node tối đa 200 ký tự")
        .optional(),
      description: z.string().trim().max(2000, "Mô tả tối đa 2000 ký tự").nullable().optional(),
      nodeType: z
        .string()
        .trim()
        .min(1, "Loại node là bắt buộc")
        .max(100, "Loại node tối đa 100 ký tự")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    }),
});

export const createMindmapEdgeSchema = z.object({
  body: z
    .object({
      sourceNodeId: z.string().uuid("Source node id không hợp lệ"),
      targetNodeId: z.string().uuid("Target node id không hợp lệ"),
      relationType: z
        .string()
        .trim()
        .min(1, "Loại quan hệ là bắt buộc")
        .max(100, "Loại quan hệ tối đa 100 ký tự"),
    })
    .refine((data) => data.sourceNodeId !== data.targetNodeId, {
      message: "Source node và target node phải khác nhau",
      path: ["targetNodeId"],
    }),
});

export const updateMindmapEdgeSchema = z.object({
  params: z.object({
    id: z.string().uuid("Edge id không hợp lệ"),
  }),
  body: z
    .object({
      sourceNodeId: z.string().uuid("Source node id không hợp lệ").optional(),
      targetNodeId: z.string().uuid("Target node id không hợp lệ").optional(),
      relationType: z
        .string()
        .trim()
        .min(1, "Loại quan hệ là bắt buộc")
        .max(100, "Loại quan hệ tối đa 100 ký tự")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    })
    .refine(
      (data) => !data.sourceNodeId || !data.targetNodeId || data.sourceNodeId !== data.targetNodeId,
      {
        message: "Source node và target node phải khác nhau",
        path: ["targetNodeId"],
      },
    ),
});

export type CreateMindmapNodeInput = z.infer<typeof createMindmapNodeSchema>["body"];
export type UpdateMindmapNodeInput = z.infer<typeof updateMindmapNodeSchema>["body"];
export type CreateMindmapEdgeInput = z.infer<typeof createMindmapEdgeSchema>["body"];
export type UpdateMindmapEdgeInput = z.infer<typeof updateMindmapEdgeSchema>["body"];
