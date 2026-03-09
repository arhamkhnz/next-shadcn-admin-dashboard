import z from "zod";

export const recentLeadsSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  status: z.string(),
  source: z.string(),
  lastActivity: z.string(),
});

export type RecentLeadRow = z.infer<typeof recentLeadsSchema>;
