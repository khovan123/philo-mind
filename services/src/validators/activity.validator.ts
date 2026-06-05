import { z } from "zod";
import { ActivityType, TargetType } from "../types/activity.js";

const positiveIntegerString = z.string().regex(/^\d+$/, "Phải là số nguyên dương");

export const createActivitySchema = z.object({
  body: z.object({
    activityType: z.nativeEnum(ActivityType),
    targetType: z.nativeEnum(TargetType),
    targetId: z.string().uuid("Target id phải là UUID hợp lệ").optional().nullable(),
    metadata: z.any().optional().nullable(),
  }),
});

export const listActivitiesSchema = z.object({
  query: z.object({
    page: positiveIntegerString.optional(),
    limit: positiveIntegerString.optional(),
  }),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>["body"];
export type ListActivitiesQuery = z.infer<typeof listActivitiesSchema>["query"];
