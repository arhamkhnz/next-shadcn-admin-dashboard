import z from "zod";

const opportunitySchema = z.object({
  id: z.string(),
  account: z.string(),
  stage: z.string(),
  priority: z.number(),
  health: z.string(),
  value: z.number(),
  ownerId: z.string(),
  createdAt: z.string(),
  expectedClose: z.string(),
  lastActivity: z.string(),
});

export const opportunitiesSchema = z.array(opportunitySchema);

export type OpportunityRow = z.infer<typeof opportunitySchema>;
