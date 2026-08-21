import z from "zod";

export const dealStageSchema = z.enum([
  "Discovery",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
]);

export type DealStage = z.infer<typeof dealStageSchema>;

export const dealHealthSchema = z.enum(["Healthy", "Attention", "At Risk"]);

export type DealHealth = z.infer<typeof dealHealthSchema>;

export const dealPrioritySchema = z.enum(["Low", "Medium", "High", "Critical"]);

export type DealPriority = z.infer<typeof dealPrioritySchema>;

export const dealSourceSchema = z.enum(["Inbound", "Outbound", "Referral", "Partner", "Event", "Website", "Cold Call"]);

export type DealSource = z.infer<typeof dealSourceSchema>;

export const dealActivityTypeSchema = z.enum([
  "email",
  "call",
  "meeting",
  "note",
  "status_change",
  "task",
  "creation",
  "assignment",
]);

export type DealActivityType = z.infer<typeof dealActivityTypeSchema>;

export const dealActivitySchema = z.object({
  id: z.string(),
  type: dealActivityTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  createdBy: z.string().nullable(),
});

export type DealActivity = z.infer<typeof dealActivitySchema>;

export const dealTaskPrioritySchema = z.enum(["Low", "Medium", "High"]);

export type DealTaskPriority = z.infer<typeof dealTaskPrioritySchema>;

export const dealTaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

export type DealTaskStatus = z.infer<typeof dealTaskStatusSchema>;

export const dealTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().nullable(),
  priority: dealTaskPrioritySchema,
  status: dealTaskStatusSchema,
  assigneeId: z.string().nullable(),
  createdAt: z.string(),
});

export type DealTask = z.infer<typeof dealTaskSchema>;

export const dealNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorId: z.string().nullable(),
  pinned: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type DealNote = z.infer<typeof dealNoteSchema>;

export const dealProductSchema = z.object({
  name: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});

export type DealProduct = z.infer<typeof dealProductSchema>;

export const dealSchema = z.object({
  id: z.string(),
  name: z.string(),
  companyId: z.string(),
  primaryContactId: z.string().nullable(),
  stage: dealStageSchema,
  value: z.number().min(0),
  currency: z.string().default("USD"),
  probability: z.number().min(0).max(100),
  health: dealHealthSchema,
  priority: dealPrioritySchema,
  ownerId: z.string().nullable(),
  source: dealSourceSchema,
  tags: z.array(z.string()).optional(),
  expectedCloseDate: z.string().nullable(),
  actualCloseDate: z.string().nullable(),
  lastActivityDate: z.string().nullable(),
  nextActivityDate: z.string().nullable(),
  lostReason: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  activities: z.array(dealActivitySchema).default([]),
  tasks: z.array(dealTaskSchema).default([]),
  notes: z.array(dealNoteSchema).default([]),
  products: z.array(dealProductSchema).default([]),
  proposalSummary: z.string().nullable().optional(),
  archivedAt: z.string().nullable().optional(),
  archivedBy: z.string().nullable().optional(),
});

export type Deal = z.infer<typeof dealSchema>;
