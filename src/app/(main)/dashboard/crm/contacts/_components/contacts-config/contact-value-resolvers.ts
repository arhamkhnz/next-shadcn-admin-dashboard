import { differenceInCalendarDays, parseISO } from "date-fns";

import type { CustomFieldValue, ResolveFieldValue } from "@/lib/crm-table-engine/types";

import { getFollowUpState } from "../contacts-columns";
import type { Contact } from "../contacts-data/schema";

const CUSTOM_KEY_PREFIX = "contact.custom.";

const today = new Date(2026, 7, 16);

export function getContactCustomFieldSystemName(fieldKey: string): string {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX) ? fieldKey.slice(CUSTOM_KEY_PREFIX.length) : fieldKey;
}

export function isContactCustomFieldKey(fieldKey: string): boolean {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX);
}

function getActivityRecency(contact: Contact): string {
  if (!contact.lastContacted) return "Never Contacted";
  const diff = differenceInCalendarDays(today, parseISO(contact.lastContacted));
  if (diff > 30) return "Stale";
  return "Recent";
}

export const resolveContactFieldValue: ResolveFieldValue<Contact> = (
  contact: Contact,
  fieldKey: string,
): CustomFieldValue | undefined => {
  switch (fieldKey) {
    case "contact.name":
      return contact.name;
    case "contact.company":
      return contact.companyName ?? null;
    case "contact.email":
      return contact.email;
    case "contact.phone":
      return contact.phone ?? null;
    case "contact.jobTitle":
      return contact.jobTitle ?? null;
    case "contact.lifecycleStage":
      return contact.lifecycleStage;
    case "contact.owner":
      return contact.ownerId ?? null;
    case "contact.openDeals":
      return contact.openDealCount;
    case "contact.lastContacted":
      return contact.lastContacted ? new Date(contact.lastContacted).getTime() : null;
    case "contact.followUpState":
      return getFollowUpState(contact.nextActivity);
    case "contact.activityRecency":
      return getActivityRecency(contact);
    case "contact.createdAt":
      return new Date(contact.createdAt).getTime();
    default:
      break;
  }
  if (isContactCustomFieldKey(fieldKey)) {
    const systemName = getContactCustomFieldSystemName(fieldKey);
    const value = contact.customFields?.[systemName];
    return value === undefined ? null : value;
  }
  return undefined;
};
