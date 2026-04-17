import { z } from "zod";

export const proposalSectionsSchema = z.object({
  id: z.number(),
  customer: z.string(),
  plan: z.string(),
  status: z.string(),
  revenue: z.string(),
  accounts: z.string(),
  owner: z.string(),
});

export type ProposalSectionsRow = z.infer<typeof proposalSectionsSchema>;
