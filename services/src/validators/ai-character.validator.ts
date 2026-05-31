import { z } from "zod";

export const createCharacterSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    type: z.string().min(2).max(100),
    bio: z.string().optional(),
    worldview: z.string().optional(),
    promptInstruction: z.string().min(10),
  }),
});

export const updateCharacterSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    type: z.string().min(2).max(100).optional(),
    bio: z.string().optional(),
    worldview: z.string().optional(),
    promptInstruction: z.string().min(10).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const characterIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});