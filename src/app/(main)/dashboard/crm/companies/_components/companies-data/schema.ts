import z from "zod";

import { customFieldValueSchema } from "@/lib/crm-table-engine/value-schema";

export const companyTypeSchema = z.enum(["Prospect", "Customer", "Partner", "Former Customer"]);

export type CompanyType = z.infer<typeof companyTypeSchema>;

export const companyIndustrySchema = z.enum([
  "Technology",
  "Healthcare",
  "Financial Services",
  "Retail",
  "Manufacturing",
  "Logistics",
  "Professional Services",
  "Education",
  "Real Estate",
  "Hospitality",
]);

export type CompanyIndustry = z.infer<typeof companyIndustrySchema>;

export const companySizeSchema = z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1001+"]);

export type CompanySize = z.infer<typeof companySizeSchema>;

export const companySourceSchema = z.enum(["Inbound", "Outbound", "Referral", "Partner", "Event", "Website", "Other"]);

export type CompanySource = z.infer<typeof companySourceSchema>;

export const companyActivityTypeSchema = z.enum(["call", "email", "meeting", "note", "status_change", "task"]);

export type CompanyActivityType = z.infer<typeof companyActivityTypeSchema>;

export const companyActivityItemSchema = z.object({
  id: z.string(),
  type: companyActivityTypeSchema,
  subject: z.string().optional(),
  description: z.string().optional(),
  timestamp: z.string(),
  contactName: z.string().optional(),
});

export type CompanyActivityItem = z.infer<typeof companyActivityItemSchema>;

export const companyTaskPrioritySchema = z.enum(["low", "medium", "high"]);

export type CompanyTaskPriority = z.infer<typeof companyTaskPrioritySchema>;

export const companyTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: companyTaskPrioritySchema,
  assigneeName: z.string().optional(),
  dueDate: z.string().nullable(),
  createdAt: z.string(),
});

export type CompanyTask = z.infer<typeof companyTaskSchema>;

export const companyNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type CompanyNote = z.infer<typeof companyNoteSchema>;

export const companyDealStatusSchema = z.enum([
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
]);

export type CompanyDealStatus = z.infer<typeof companyDealStatusSchema>;

export const companyDealSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.number().min(0),
  status: companyDealStatusSchema,
  expectedCloseDate: z.string().nullable(),
  createdAt: z.string(),
});

export type CompanyDeal = z.infer<typeof companyDealSchema>;

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string().nullable().optional(),
  industry: companyIndustrySchema,
  type: companyTypeSchema,
  size: companySizeSchema,
  location: z.string().nullable().optional(),
  ownerId: z.string().nullable(),
  website: z.string().nullable().optional(),
  primaryContactId: z.string().nullable().optional(),
  source: companySourceSchema.optional(),
  openDealCount: z.number().int().min(0),
  openPipelineValue: z.number().min(0),
  wonRevenue: z.number().min(0),
  lastActivity: z.string().nullable(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  activityTimeline: z.array(companyActivityItemSchema).optional(),
  tasks: z.array(companyTaskSchema).optional(),
  notes: z.array(companyNoteSchema).optional(),
  deals: z.array(companyDealSchema).optional(),
  archivedAt: z.string().nullable().optional(),
  archivedBy: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  customFields: z.record(z.string(), customFieldValueSchema).optional(),
});

export type Company = z.infer<typeof companySchema>;

export type CompanyActivityState = "Recently Active" | "Inactive" | "Never Active";

export type CompanyOpenDealState = "Has Open Deals" | "No Open Deals";
