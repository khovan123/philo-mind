import { z } from "zod";

export const createChatSessionSchema = z.object({
  body: z.object({
    characterId: z.string().uuid(),
    title: z.string().max(200).optional(),
  }),
});

export const listChatSessionsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const sessionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const sendChatMessageSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    message: z.string().min(1).max(5000),
  }),
});

export const streamChatMessageSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    message: z.string().min(1).max(5000),
  }),
});
