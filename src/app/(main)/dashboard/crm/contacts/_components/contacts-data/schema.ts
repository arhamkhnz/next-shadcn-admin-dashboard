import z from "zod";

export const contactLifecycleStageSchema = z.enum([
  "Subscriber",
  "Lead",
  "Marketing Qualified",
  "Sales Qualified",
  "Opportunity",
  "Customer",
  "Former Customer",
]);

export type ContactLifecycleStage = z.infer<typeof contactLifecycleStageSchema>;

export const contactSourceSchema = z.enum([
  "Website",
  "Referral",
  "LinkedIn",
  "Event",
  "Partner",
  "Outbound",
  "Organic Search",
  "Paid Campaign",
]);

export type ContactSource = z.infer<typeof contactSourceSchema>;

export const contactPreferredContactSchema = z.enum(["email", "phone", "linkedin", "in_person"]);

export type ContactPreferredContact = z.infer<typeof contactPreferredContactSchema>;

export const contactActivityTypeSchema = z.enum([
  "call",
  "email",
  "meeting",
  "note",
  "task",
  "status_change",
  "creation",
]);

export type ContactActivityType = z.infer<typeof contactActivityTypeSchema>;

export const contactActivityItemSchema = z.object({
  id: z.string(),
  type: contactActivityTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  timestamp: z.string(),
  actor: z.string().optional(),
  outcome: z.string().optional(),
});

export type ContactActivityItem = z.infer<typeof contactActivityItemSchema>;

export const contactTaskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);

export type ContactTaskPriority = z.infer<typeof contactTaskPrioritySchema>;

export const contactTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: contactTaskPrioritySchema,
  ownerId: z.string().nullable(),
});

export type ContactTask = z.infer<typeof contactTaskSchema>;

export const contactNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
  pinned: z.boolean().optional(),
});

export type ContactNote = z.infer<typeof contactNoteSchema>;

export const contactDealSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number().min(0),
  stage: z.enum(["Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
  createdAt: z.string(),
  closedAt: z.string().nullable().optional(),
});

export type ContactDeal = z.infer<typeof contactDealSchema>;

export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  jobTitle: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  companyId: z.string().nullable(),
  companyName: z.string().optional(),
  lifecycleStage: contactLifecycleStageSchema,
  ownerId: z.string().nullable(),
  tags: z.array(z.string()).optional(),
  openDealCount: z.number().int().min(0),
  openDealValue: z.number().min(0),
  closedDealCount: z.number().int().min(0).optional(),
  closedDealValue: z.number().min(0).optional(),
  lastContacted: z.string().nullable(),
  nextActivity: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  preferredContact: contactPreferredContactSchema.optional(),
  profileUrl: z.string().optional(),
  source: contactSourceSchema.optional(),
  isPrimaryContact: z.boolean().optional(),
  companyWebsite: z.string().optional(),
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
  activityTimeline: z.array(contactActivityItemSchema).optional(),
  tasks: z.array(contactTaskSchema).optional(),
  notes: z.array(contactNoteSchema).optional(),
  relatedDeals: z.array(contactDealSchema).optional(),
  archivedAt: z.string().nullable().optional(),
  archivedBy: z.string().nullable().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export type ContactFollowUpState = "Overdue" | "Due Today" | "Upcoming" | "Not Scheduled";

export type ContactOpenDealState = "Has Open Deals" | "No Open Deals";
