import { crmCompanies } from "@/app/(main)/dashboard/crm/_components/crm-data/companies";
import { salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { contacts } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/data";
import { deals } from "@/app/(main)/dashboard/crm/deals/_components/deals-data/data";
import { leads } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/data";

import type { Activity, ActivityPriority, ActivityStatus, ActivityType } from "./activity-schema";

const today = new Date(2026, 7, 16);

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

function at(dayOffset: number, hour: number, minute: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const scheduledTypes = ["Call", "Meeting", "Email", "Task"] as const;
const completedTypes = ["Call", "Email", "Meeting", "Task", "Note"] as const;

const priorities: readonly ActivityPriority[] = ["Medium", "High", "Low", "Urgent", "Medium", "High", "Medium"];

const callTitles = [
  "Discovery call",
  "Follow-up call on proposal",
  "Pricing discussion",
  "Requirements gathering call",
  "Executive alignment call",
  "Technical deep-dive call",
  "Renewal check-in call",
];

const meetingTitles = [
  "Product demo",
  "Stakeholder review meeting",
  "Onboarding planning session",
  "Contract review meeting",
  "Quarterly business review",
  "Implementation workshop",
  "Architecture review meeting",
];

const emailTitles = [
  "Send proposal follow-up",
  "Share pricing breakdown",
  "Respond to technical questions",
  "Send introduction email",
  "Send meeting recap and action items",
  "Share case study and references",
  "Send contract for signature",
];

const taskTitles = [
  "Prepare proposal draft",
  "Send contract for internal review",
  "Update CRM record with outcomes",
  "Research competitor pricing",
  "Schedule technical assessment",
  "Compile requirements document",
  "Prepare demo environment",
];

const noteTitles = [
  "Call notes and next steps",
  "Meeting notes and decisions",
  "Requirements summary notes",
  "Pricing sensitivity notes",
  "Competitor comparison notes",
];

const outcomes = [
  "Positive — agreed to next steps",
  "Interested, requested more details",
  "No answer, voicemail left",
  "Rescheduled at their request",
  "Decision postponed to next quarter",
  "Budget confirmed, procurement started",
  "Sent — awaiting reply",
  "Completed with follow-up needed",
];

const cancelReasons = [
  "Customer requested reschedule",
  "Duplicate of another activity",
  "Deal placed on hold",
  "Contact no longer available",
  "Priority changed, moved to next sprint",
  "Internal conflict, owner unavailable",
];

const descriptions = [
  "Discussed current challenges and evaluated fit against requirements.",
  "Walked through the product roadmap and answered open questions.",
  "Reviewed commercial terms and aligned on the approval process.",
  "Captured feedback from the team and documented follow-ups.",
  "Confirmed timeline, budget owner, and decision criteria.",
  "Shared references and success stories from similar accounts.",
];

interface RelationshipAnchor {
  leadId: string | null;
  contactId: string | null;
  companyId: string | null;
  dealId: string | null;
}

const dealAnchors = deals.slice(0, 26);
const contactAnchors = contacts.slice(0, 22);
const leadAnchors = leads.slice(0, 24);
const companyAnchors = crmCompanies.slice(0, 12);

function resolveAnchor(index: number): RelationshipAnchor {
  const slot = index % 10;
  if (slot < 4) {
    const deal = dealAnchors[index % dealAnchors.length];
    return {
      leadId: null,
      contactId: deal.primaryContactId,
      companyId: deal.companyId,
      dealId: deal.id,
    };
  }
  if (slot < 7) {
    const contact = contactAnchors[index % contactAnchors.length];
    return {
      leadId: null,
      contactId: contact.id,
      companyId: contact.companyId,
      dealId: null,
    };
  }
  if (slot < 9) {
    const lead = leadAnchors[index % leadAnchors.length];
    return { leadId: lead.id, contactId: null, companyId: null, dealId: null };
  }
  const company = companyAnchors[index % companyAnchors.length];
  return { leadId: null, contactId: null, companyId: company.id, dealId: null };
}

function titleFor(type: ActivityType, seed: number): string {
  switch (type) {
    case "Call":
      return pick(callTitles, seed);
    case "Meeting":
      return pick(meetingTitles, seed);
    case "Email":
      return pick(emailTitles, seed);
    case "Task":
      return pick(taskTitles, seed);
    case "Note":
      return pick(noteTitles, seed);
  }
}

function durationFor(type: ActivityType, seed: number): number | null {
  switch (type) {
    case "Call":
      return pick([15, 20, 30, 45], seed);
    case "Meeting":
      return pick([30, 45, 60, 90], seed);
    case "Task":
      return pick([30, 60], seed);
    default:
      return null;
  }
}

function directionFor(type: ActivityType, seed: number): "Inbound" | "Outbound" | "Incoming" | "Outgoing" | null {
  if (type === "Call") return seed % 2 === 0 ? "Outbound" : "Inbound";
  if (type === "Email") return seed % 2 === 0 ? "Outgoing" : "Incoming";
  return null;
}

interface ScheduleSpec {
  scheduledAt: string;
  status: ActivityStatus;
  completedAt: string | null;
}

function scheduleFor(index: number): ScheduleSpec {
  const seed = hash(`act-${index}`);
  if (index < 14) {
    const dayOffset = -2 - (seed % 19);
    return { scheduledAt: at(dayOffset, 9 + (seed % 8), (seed % 4) * 15), status: "Scheduled", completedAt: null };
  }
  if (index < 22) {
    return { scheduledAt: at(0, 9 + (seed % 8), (seed % 4) * 15), status: "Scheduled", completedAt: null };
  }
  if (index < 55) {
    const dayOffset = 1 + (seed % 28);
    return { scheduledAt: at(dayOffset, 9 + (seed % 8), (seed % 4) * 15), status: "Scheduled", completedAt: null };
  }
  if (index < 105) {
    const dayOffset = -(seed % 15) - (seed % 5 === 0 ? 20 + (seed % 20) : 0);
    const scheduled = at(dayOffset, 9 + (seed % 8), (seed % 4) * 15);
    const completed = at(dayOffset, 10 + (seed % 7), (seed % 4) * 15);
    return { scheduledAt: scheduled, status: "Completed", completedAt: completed };
  }
  const dayOffset = seed % 3 === 0 ? 1 + (seed % 10) : -(seed % 12);
  return { scheduledAt: at(dayOffset, 9 + (seed % 8), (seed % 4) * 15), status: "Canceled", completedAt: null };
}

function buildActivity(index: number): Activity {
  const id = `act-${String(index + 1).padStart(3, "0")}`;
  const seed = hash(id);
  const schedule = scheduleFor(index);
  const type: ActivityType = schedule.status === "Completed" ? pick(completedTypes, seed) : pick(scheduledTypes, seed);
  const anchor = resolveAnchor(index);
  if (type === "Note" && schedule.status === "Completed") {
    const loggedAt = at(-1 - (seed % 14), 8 + (seed % 9), (seed % 4) * 15);
    schedule.scheduledAt = loggedAt;
    schedule.completedAt = loggedAt;
  }
  const ownerSeed = hash(`${id}-owner`);
  const isUnassigned = index % 23 === 5;
  const ownerId = isUnassigned ? null : salesOwners[ownerSeed % salesOwners.length].id;
  const createdBy = ownerId ?? currentCreator(index);
  const createdAtDayOffset =
    schedule.status === "Scheduled" || !schedule.completedAt ? -(3 + (seed % 15)) : -(2 + (seed % 10));
  const createdAt = at(createdAtDayOffset, 8 + (seed % 3), (seed % 6) * 10);
  const durationMinutes = durationFor(type, seed >> 3);
  const direction = directionFor(type, seed >> 5);
  const priority = pick(priorities, seed >> 2);

  const activity: Activity = {
    id,
    type,
    title: titleFor(type, seed >> 4),
    status: schedule.status,
    priority,
    ownerId,
    createdBy,
    createdAt,
    scheduledAt: schedule.scheduledAt,
    completedAt: schedule.completedAt,
    durationMinutes,
    direction,
    leadId: anchor.leadId,
    contactId: anchor.contactId,
    companyId: anchor.companyId,
    dealId: anchor.dealId,
  };

  if (type === "Task") {
    if (schedule.status === "Scheduled") {
      activity.status = index % 4 === 1 ? "In Progress" : "To Do";
    }
    activity.dueAt = activity.scheduledAt;
    if (seed % 5 === 0 && activity.status !== "Completed") {
      const reminder = new Date(activity.scheduledAt);
      reminder.setMinutes(reminder.getMinutes() - 30);
      activity.reminderAt = reminder.toISOString();
    }
  }

  if (seed % 3 !== 0) {
    activity.description = pick(descriptions, seed >> 6);
  }
  if (schedule.status === "Completed") {
    activity.outcome = pick(outcomes, seed >> 7);
    if (seed % 4 === 0) {
      activity.completionNotes = "Summary captured during follow-up with the account team.";
    }
  }
  if (schedule.status === "Canceled") {
    activity.cancelReason = pick(cancelReasons, seed >> 7);
  }
  if (seed % 7 === 0) {
    activity.updatedAt = at(-1, 12, 0);
  }
  if (index === 57) {
    activity.title =
      "Quarterly business review with extended stakeholder group covering security, procurement, and implementation timelines";
  }
  return activity;
}

function currentCreator(index: number): string {
  return salesOwners[index % salesOwners.length].id;
}

export const activities: Activity[] = Array.from({ length: 120 }, (_, i) => buildActivity(i));
