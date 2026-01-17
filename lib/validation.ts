import { z } from "zod";

export const schedulePostSchema = z.object({
  content: z.string().min(1),
  postAt: z.string(), // ISO timestamp
  userId: z.string()
});
