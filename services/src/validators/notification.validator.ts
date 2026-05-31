import { z } from "zod";

// ── T-A15: Notification Validation Schemas ───────────────────

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");
const jsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonSchema), z.record(z.string(), jsonSchema)]),
);
const notificationMetadataSchema = z.record(z.string(), jsonSchema).nullable().optional();

export const listNotificationsSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
    isRead: z.enum(["true", "false"]).optional(),
    type: z.string().max(100, "Loại thông báo tối đa 100 ký tự").optional(),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Notification id không hợp lệ"),
  }),
});

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.string().uuid("User id không hợp lệ"),
    type: z
      .string()
      .trim()
      .min(1, "Loại thông báo là bắt buộc")
      .max(100, "Loại thông báo tối đa 100 ký tự"),
    content: z
      .string()
      .trim()
      .min(1, "Nội dung thông báo là bắt buộc")
      .max(1000, "Nội dung thông báo tối đa 1000 ký tự"),
    metadata: notificationMetadataSchema,
  }),
});

export const updateNotificationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Notification id không hợp lệ"),
  }),
  body: z
    .object({
      type: z
        .string()
        .trim()
        .min(1, "Loại thông báo là bắt buộc")
        .max(100, "Loại thông báo tối đa 100 ký tự")
        .optional(),
      content: z
        .string()
        .trim()
        .min(1, "Nội dung thông báo là bắt buộc")
        .max(1000, "Nội dung thông báo tối đa 1000 ký tự")
        .optional(),
      metadata: notificationMetadataSchema,
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    }),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>["query"];
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>["body"];
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>["body"];
