import type { CustomFieldValue, ResolveFieldValue } from "@/lib/crm-table-engine/types";

import type { Activity } from "./activity-schema";
import { getRelatedRecords, getScheduleState } from "./activity-utils";

const CUSTOM_KEY_PREFIX = "activity.custom.";
const TASK_CUSTOM_KEY_PREFIX = "task.custom.";

const today = new Date(2026, 7, 16);

export function getActivityCustomFieldSystemName(fieldKey: string): string {
  if (fieldKey.startsWith(CUSTOM_KEY_PREFIX)) return fieldKey.slice(CUSTOM_KEY_PREFIX.length);
  if (fieldKey.startsWith(TASK_CUSTOM_KEY_PREFIX)) return fieldKey.slice(TASK_CUSTOM_KEY_PREFIX.length);
  return fieldKey;
}

export function isActivityCustomFieldKey(fieldKey: string): boolean {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX);
}

function relatedNames(activity: Activity): string | null {
  const names = getRelatedRecords(activity).map((record) => record.name);
  return names.length > 0 ? names.join(", ") : null;
}

export const resolveActivityFieldValue: ResolveFieldValue<Activity> = (
  activity: Activity,
  fieldKey: string,
): CustomFieldValue | undefined => {
  switch (fieldKey) {
    case "activity.title":
      return activity.title;
    case "activity.type":
      return activity.type;
    case "activity.relatedTo":
      return relatedNames(activity);
    case "activity.owner":
      return activity.ownerId ?? null;
    case "activity.scheduledAt":
      return new Date(activity.scheduledAt).getTime();
    case "activity.status":
      return activity.status;
    case "activity.priority":
      return activity.priority;
    case "activity.outcome":
      return activity.outcome ?? null;
    case "activity.scheduleState":
      return getScheduleState(activity, today);
    case "activity.createdAt":
      return new Date(activity.createdAt).getTime();
    default:
      break;
  }
  if (isActivityCustomFieldKey(fieldKey)) {
    const systemName = getActivityCustomFieldSystemName(fieldKey);
    const value = activity.customFields?.[systemName];
    return value === undefined ? null : value;
  }
  return undefined;
};

export const resolveTaskFieldValue: ResolveFieldValue<Activity> = (
  activity: Activity,
  fieldKey: string,
): CustomFieldValue | undefined => {
  switch (fieldKey) {
    case "task.title":
      return activity.title;
    case "task.status":
      return activity.status;
    case "task.priority":
      return activity.priority;
    case "task.relatedTo":
      return relatedNames(activity);
    case "task.owner":
      return activity.ownerId ?? null;
    case "task.dueAt": {
      const due = activity.dueAt ?? activity.scheduledAt;
      return due ? new Date(due).getTime() : null;
    }
    case "task.reminderAt":
      return activity.reminderAt ? new Date(activity.reminderAt).getTime() : null;
    case "task.outcome":
      return activity.outcome ?? null;
    case "task.dueState": {
      const schedule = getScheduleState(activity, today);
      return schedule ?? "Closed";
    }
    case "task.updatedAt":
      return activity.updatedAt ? new Date(activity.updatedAt).getTime() : null;
    default:
      break;
  }
  if (fieldKey.startsWith(TASK_CUSTOM_KEY_PREFIX)) {
    const systemName = getActivityCustomFieldSystemName(fieldKey);
    const value = activity.customFields?.[systemName];
    return value === undefined ? null : value;
  }
  return undefined;
};
