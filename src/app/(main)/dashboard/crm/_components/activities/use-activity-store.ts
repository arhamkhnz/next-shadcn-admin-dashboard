import { create } from "zustand";

import type { CustomFieldValueRecord } from "@/lib/crm-table-engine/value-schema";

import { activities as mockActivities } from "./activity-data";
import type { Activity, ActivityPriority, ActivityStatus } from "./activity-schema";

type ActivityCustomValue = NonNullable<Activity["customFields"]>[string];

import { canTransitionStatus, isActiveStatus, isTaskActivity } from "./activity-utils";

export interface CompleteActivityInput {
  outcome: string;
  completionNotes?: string;
  actualDurationMinutes?: number | null;
  completedAt?: string;
}

export interface ReopenActivityInput {
  dueAt: string;
  reminderAt?: string | null;
}

type ActivityStore = {
  activities: Activity[];
  createActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  completeActivity: (id: string, input: CompleteActivityInput) => void;
  cancelActivity: (id: string, reason?: string) => void;
  rescheduleActivity: (id: string, scheduledAt: string, reminderAt?: string | null) => void;
  startActivity: (id: string) => boolean;
  reopenActivity: (id: string, input: ReopenActivityInput) => boolean;
  setTaskStatus: (id: string, status: ActivityStatus) => boolean;
  bulkAssignOwner: (ids: string[], ownerId: string) => void;
  bulkSetPriority: (ids: string[], priority: ActivityPriority) => void;
  bulkReschedule: (ids: string[], scheduledAt: string, reminderAt?: string | null) => void;
  bulkComplete: (ids: string[], input: CompleteActivityInput) => void;
  bulkCancel: (ids: string[], reason?: string) => void;
  getActivityById: (id: string) => Activity | undefined;
  getActivitiesForLead: (leadId: string) => Activity[];
  getActivitiesForContact: (contactId: string) => Activity[];
  getActivitiesForCompany: (companyId: string) => Activity[];
  getActivitiesForDeal: (dealId: string) => Activity[];
  setActivityCustomFieldValue: (id: string, systemName: string, value: ActivityCustomValue) => void;
  setMultipleActivityCustomFieldValues: (id: string, values: CustomFieldValueRecord) => void;
  clearActivityCustomFieldValue: (id: string, systemName: string) => void;
};

function nowIso(): string {
  return new Date().toISOString();
}

function withTaskSchedule(activity: Activity, scheduledAt: string): Partial<Activity> {
  if (!isTaskActivity(activity)) {
    return { scheduledAt };
  }
  return { scheduledAt, dueAt: scheduledAt };
}

function nextReminder(current: string | null | undefined, next: string | null | undefined): string | null | undefined {
  if (next === undefined) return current;
  return next;
}

function restoredStatusFor(activity: Activity): ActivityStatus {
  if (!isActiveStatus(activity.status)) {
    return isTaskActivity(activity) ? "To Do" : "Scheduled";
  }
  return activity.status;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: mockActivities,

  createActivity: (activity: Activity) => set((state) => ({ activities: [activity, ...state.activities] })),

  updateActivity: (id: string, updates: Partial<Activity>) =>
    set((state) => ({
      activities: state.activities.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: nowIso() } : a)),
    })),

  completeActivity: (id: string, input: CompleteActivityInput) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Completed" as const,
              completedAt: input.completedAt ?? nowIso(),
              outcome: input.outcome,
              completionNotes: input.completionNotes ? input.completionNotes : undefined,
              durationMinutes: input.actualDurationMinutes ?? a.durationMinutes,
              updatedAt: nowIso(),
            }
          : a,
      ),
    })),

  cancelActivity: (id: string, reason?: string) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Canceled" as const,
              cancelReason: reason?.trim() ? reason.trim() : undefined,
              updatedAt: nowIso(),
            }
          : a,
      ),
    })),

  rescheduleActivity: (id: string, scheduledAt: string, reminderAt?: string | null) =>
    set((state) => ({
      activities: state.activities.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          status: restoredStatusFor(a),
          ...withTaskSchedule(a, scheduledAt),
          reminderAt: nextReminder(a.reminderAt, reminderAt),
          updatedAt: nowIso(),
        };
      }),
    })),

  startActivity: (id: string) => {
    const activity = get().activities.find((a) => a.id === id);
    if (!activity || !canTransitionStatus(activity.status, "In Progress")) return false;
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, status: "In Progress" as const, updatedAt: nowIso() } : a,
      ),
    }));
    return true;
  },

  reopenActivity: (id: string, input: ReopenActivityInput) => {
    const activity = get().activities.find((a) => a.id === id);
    if (!activity || !canTransitionStatus(activity.status, "To Do")) return false;
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "To Do" as const,
              completedAt: null,
              ...withTaskSchedule(a, input.dueAt),
              reminderAt: nextReminder(a.reminderAt, input.reminderAt),
              updatedAt: nowIso(),
            }
          : a,
      ),
    }));
    return true;
  },

  setTaskStatus: (id: string, status: ActivityStatus) => {
    const activity = get().activities.find((a) => a.id === id);
    if (!activity || !canTransitionStatus(activity.status, status)) return false;
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              completedAt: status === "Completed" ? (a.completedAt ?? nowIso()) : a.completedAt,
              updatedAt: nowIso(),
            }
          : a,
      ),
    }));
    return true;
  },

  bulkAssignOwner: (ids: string[], ownerId: string) =>
    set((state) => ({
      activities: state.activities.map((a) => (ids.includes(a.id) ? { ...a, ownerId, updatedAt: nowIso() } : a)),
    })),

  bulkSetPriority: (ids: string[], priority: ActivityPriority) =>
    set((state) => ({
      activities: state.activities.map((a) => (ids.includes(a.id) ? { ...a, priority, updatedAt: nowIso() } : a)),
    })),

  bulkReschedule: (ids: string[], scheduledAt: string, reminderAt?: string | null) =>
    set((state) => ({
      activities: state.activities.map((a) => {
        if (!ids.includes(a.id)) return a;
        return {
          ...a,
          status: restoredStatusFor(a),
          ...withTaskSchedule(a, scheduledAt),
          reminderAt: nextReminder(a.reminderAt, reminderAt),
          updatedAt: nowIso(),
        };
      }),
    })),

  bulkComplete: (ids: string[], input: CompleteActivityInput) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        ids.includes(a.id) && isActiveStatus(a.status)
          ? {
              ...a,
              status: "Completed" as const,
              completedAt: input.completedAt ?? nowIso(),
              outcome: input.outcome,
              completionNotes: input.completionNotes ? input.completionNotes : a.completionNotes,
              durationMinutes: input.actualDurationMinutes ?? a.durationMinutes,
              updatedAt: nowIso(),
            }
          : a,
      ),
    })),

  bulkCancel: (ids: string[], reason?: string) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        ids.includes(a.id) && isActiveStatus(a.status)
          ? {
              ...a,
              status: "Canceled" as const,
              cancelReason: reason?.trim() ? reason.trim() : a.cancelReason,
              updatedAt: nowIso(),
            }
          : a,
      ),
    })),

  getActivityById: (id: string) => get().activities.find((a) => a.id === id),

  getActivitiesForLead: (leadId: string) => get().activities.filter((a) => a.leadId === leadId),

  getActivitiesForContact: (contactId: string) => get().activities.filter((a) => a.contactId === contactId),

  getActivitiesForCompany: (companyId: string) => get().activities.filter((a) => a.companyId === companyId),

  getActivitiesForDeal: (dealId: string) => get().activities.filter((a) => a.dealId === dealId),

  setActivityCustomFieldValue: (id, systemName, value) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              updatedAt: nowIso(),
              customFields: { ...(a.customFields ?? {}), [systemName]: value },
            }
          : a,
      ),
    })),

  setMultipleActivityCustomFieldValues: (id, values) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              updatedAt: nowIso(),
              customFields: { ...(a.customFields ?? {}), ...values },
            }
          : a,
      ),
    })),

  clearActivityCustomFieldValue: (id, systemName) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id && a.customFields
          ? {
              ...a,
              updatedAt: nowIso(),
              customFields: Object.fromEntries(Object.entries(a.customFields).filter(([key]) => key !== systemName)),
            }
          : a,
      ),
    })),
}));
