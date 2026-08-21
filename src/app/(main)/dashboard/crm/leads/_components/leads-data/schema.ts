import z from "zod";

export const leadStatusSchema = z.enum(["New", "Contacted", "Qualified", "Unqualified", "Nurturing"]);

export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const leadSourceSchema = z.enum([
  "Website",
  "Referral",
  "LinkedIn",
  "Event",
  "Partner",
  "Outbound",
  "Organic Search",
  "Paid Campaign",
]);

export type LeadSource = z.infer<typeof leadSourceSchema>;

export const leadScoreClassificationSchema = z.enum(["Hot", "Warm", "Cold"]);

export type LeadScoreClassification = z.infer<typeof leadScoreClassificationSchema>;

export const followUpStateSchema = z.enum(["Overdue", "Due Today", "Upcoming", "Not Scheduled"]);

export type FollowUpState = z.infer<typeof followUpStateSchema>;

export const activityTypeSchema = z.enum([
  "call",
  "email",
  "meeting",
  "note",
  "task",
  "status_change",
  "assignment",
  "creation",
]);

export type ActivityType = z.infer<typeof activityTypeSchema>;

export const activityItemSchema = z.object({
  id: z.string(),
  type: activityTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  timestamp: z.string(),
  actor: z.string().optional(),
  outcome: z.string().optional(),
});

export type ActivityItem = z.infer<typeof activityItemSchema>;

export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);

export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const leadTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: taskPrioritySchema,
  ownerId: z.string().nullable(),
});

export type LeadTask = z.infer<typeof leadTaskSchema>;

export const leadNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
  pinned: z.boolean().optional(),
});

export type LeadNote = z.infer<typeof leadNoteSchema>;

export const preferredContactSchema = z.enum(["email", "phone", "linkedin", "in_person"]);

export type PreferredContact = z.infer<typeof preferredContactSchema>;

export const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  source: leadSourceSchema,
  status: leadStatusSchema,
  score: z.number().int().min(0).max(100),
  ownerId: z.string().nullable(),
  lastActivity: z.string(),
  nextActivity: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  preferredContact: preferredContactSchema.optional(),
  tags: z.array(z.string()).optional(),
  companyWebsite: z.string().optional(),
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
  activityTimeline: z.array(activityItemSchema).optional(),
  tasks: z.array(leadTaskSchema).optional(),
  notes: z.array(leadNoteSchema).optional(),
  archivedAt: z.string().nullable().optional(),
  archivedBy: z.string().nullable().optional(),
});

export type Lead = z.infer<typeof leadSchema>;
