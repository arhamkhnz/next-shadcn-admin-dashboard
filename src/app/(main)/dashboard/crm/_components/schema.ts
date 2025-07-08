import z from "zod";

export const recentLeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  status: z.string(),
  source: z.string(),
  lastActivity: z.string(),
});
