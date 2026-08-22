import z from "zod";

import { customFieldValueSchema } from "@/lib/crm-table-engine/value-schema";

export const activityTypeSchema = z.enum(["Call", "Meeting", "Email", "Task", "Note"]);

export type ActivityType = z.infer<typeof activityTypeSchema>;

export const activityStatusSchema = z.enum(["Scheduled", "To Do", "In Progress", "Completed", "Canceled"]);

export type ActivityStatus = z.infer<typeof activityStatusSchema>;

export const activeActivityStatuses = ["Scheduled", "To Do", "In Progress"] as const;

export type ActiveActivityStatus = (typeof activeActivityStatuses)[number];

export const activityPrioritySchema = z.enum(["Low", "Medium", "High", "Urgent"]);

export type ActivityPriority = z.infer<typeof activityPrioritySchema>;

export const callDirectionSchema = z.enum(["Inbound", "Outbound"]);

export type CallDirection = z.infer<typeof callDirectionSchema>;

export const emailDirectionSchema = z.enum(["Incoming", "Outgoing"]);

export type EmailDirection = z.infer<typeof emailDirectionSchema>;

export const activityDirectionSchema = z.union([callDirectionSchema, emailDirectionSchema]);

export type ActivityDirection = z.infer<typeof activityDirectionSchema>;

export const activityRelatedRecordTypeSchema = z.enum(["Lead", "Contact", "Company", "Deal"]);

export type ActivityRelatedRecordType = z.infer<typeof activityRelatedRecordTypeSchema>;

export const activitySchema = z
  .object({
    id: z.string(),
    type: activityTypeSchema,
    title: z.string(),
    description: z.string().optional(),
    status: activityStatusSchema,
    priority: activityPrioritySchema,
    ownerId: z.string().nullable(),
    createdBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    scheduledAt: z.string(),
    dueAt: z.string().nullable().optional(),
    reminderAt: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(),
    durationMinutes: z.number().int().positive().nullable().optional(),
    outcome: z.string().nullable().optional(),
    completionNotes: z.string().optional(),
    cancelReason: z.string().optional(),
    direction: activityDirectionSchema.nullable().optional(),
    leadId: z.string().nullable().optional(),
    contactId: z.string().nullable().optional(),
    companyId: z.string().nullable().optional(),
    dealId: z.string().nullable().optional(),
    customFields: z.record(z.string(), customFieldValueSchema).optional(),
  })
  .refine((activity) => Boolean(activity.leadId || activity.contactId || activity.companyId || activity.dealId), {
    message: "An activity must reference at least one Lead, Contact, Company, or Deal.",
  })
  .refine((activity) => activity.type === "Call" || activity.type === "Email" || !activity.direction, {
    message: "Only Call and Email activities support a direction.",
  })
  .refine((activity) => activity.status !== "Completed" || Boolean(activity.completedAt), {
    message: "Completed activities must have a completedAt timestamp.",
  });

export type Activity = z.infer<typeof activitySchema>;
