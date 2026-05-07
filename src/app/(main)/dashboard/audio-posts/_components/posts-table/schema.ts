import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  duration: z.string(),
  replies: z.number(),
  likes: z.number(),
  listens: z.number(),
  timestamp: z.string(),
  status: z.enum(["Published", "Flagged", "Archived"]),
});

export type PostRow = z.infer<typeof postSchema>;
