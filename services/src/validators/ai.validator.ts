import { z } from "zod";

export const generateSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(5000),
  }),
});
