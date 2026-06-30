import z from "zod";

const recentCustomersSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  plan: z.string(),
  status: z.string(),
  billing: z.string(),
  joined: z.string(),
});

export type RecentCustomerRow = z.infer<typeof recentCustomersSchema>;
