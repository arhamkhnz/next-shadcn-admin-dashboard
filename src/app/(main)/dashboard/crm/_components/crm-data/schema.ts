import z from "zod";

export const qualifiedFlowEntrySchema = z.object({
  ownerId: z.string(),
  monthOffset: z.number().int().min(0),
  date: z.date(),
  created: z.number().int().nonnegative(),
  qualified: z.number().int().nonnegative(),
  discoveryBooked: z.number().int().nonnegative(),
});

export type QualifiedFlowEntry = z.infer<typeof qualifiedFlowEntrySchema>;

export const meetingTypeSchema = z.enum([
  "Discovery call",
  "Product demo",
  "Proposal review",
  "Negotiation",
  "Follow-up",
]);

export const meetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyId: z.string(),
  contact: z.string(),
  ownerId: z.string(),
  startsAt: z.date(),
  durationMinutes: z.number().int().positive(),
  type: meetingTypeSchema,
});

export type CrmMeeting = z.infer<typeof meetingSchema>;

export const attentionPrioritySchema = z.enum(["High", "Medium", "Low"]);

export const attentionKindSchema = z.enum(["overdue-activity", "lead-follow-up", "stale-deal", "deal-at-risk"]);

export const attentionActionSchema = z.enum(["Follow up", "Review", "View"]);

export const attentionItemSchema = z.object({
  id: z.string(),
  kind: attentionKindSchema,
  title: z.string(),
  companyName: z.string(),
  contact: z.string(),
  ownerId: z.string(),
  reason: z.string(),
  detail: z.string(),
  date: z.date(),
  priority: attentionPrioritySchema,
  action: attentionActionSchema,
});

export type AttentionItem = z.infer<typeof attentionItemSchema>;
