import { z } from "zod";

export const proposalSectionsSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export type ProposalSectionsRow = z.infer<typeof proposalSectionsSchema>;
