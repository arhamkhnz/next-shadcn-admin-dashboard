import type { CustomFieldValue, ResolveFieldValue, TableField } from "@/lib/crm-table-engine/types";

import { getFollowUpState } from "../leads-columns";
import type { Lead } from "../leads-data/schema";

const CUSTOM_KEY_PREFIX = "lead.custom.";

export function getLeadCustomFieldSystemName(fieldKey: string): string {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX) ? fieldKey.slice(CUSTOM_KEY_PREFIX.length) : fieldKey;
}

export function isLeadCustomFieldKey(fieldKey: string): boolean {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX);
}

export const resolveLeadFieldValue: ResolveFieldValue<Lead> = (
  lead: Lead,
  fieldKey: string,
): CustomFieldValue | undefined => {
  switch (fieldKey) {
    case "lead.name":
      return lead.name;
    case "lead.company":
      return lead.company ?? null;
    case "lead.email":
      return lead.email;
    case "lead.phone":
      return lead.phone ?? null;
    case "lead.source":
      return lead.source;
    case "lead.status":
      return lead.status;
    case "lead.score":
      return lead.score;
    case "lead.owner":
      return lead.ownerId ?? null;
    case "lead.lastActivity":
      return new Date(lead.lastActivity).getTime();
    case "lead.nextActivity":
      return lead.nextActivity ? new Date(lead.nextActivity).getTime() : null;
    case "lead.createdAt":
      return new Date(lead.createdAt).getTime();
    case "lead.updatedAt":
      return lead.updatedAt ? new Date(lead.updatedAt).getTime() : null;
    case "lead.followUpState":
      return getFollowUpState(lead.nextActivity);
    default:
      break;
  }
  if (isLeadCustomFieldKey(fieldKey)) {
    const systemName = getLeadCustomFieldSystemName(fieldKey);
    const value = lead.customFields?.[systemName];
    return value === undefined ? null : value;
  }
  return undefined;
};

export function getLeadFieldValueLabel(field: TableField, lead: Lead): string {
  const value = resolveLeadFieldValue(lead, field.key);
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
