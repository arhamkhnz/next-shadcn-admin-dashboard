import { z } from "zod";

export const customerFlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountCount: z.number().nullable(),
  status: z.string(),
  statusTone: z.enum(["success", "warning", "danger", "info", "neutral", "accent"]),
  revenue: z.string(),
  assignee: z.string(),
  assigneeInitials: z.string(),
  assigneeTone: z.string(),
  lastActivity: z.string(),
  paymentStatus: z.string(),
  joined: z.string(),
  avatarTone: z.string(),
});

export type CustomerFlowRow = z.infer<typeof customerFlowSchema>;
