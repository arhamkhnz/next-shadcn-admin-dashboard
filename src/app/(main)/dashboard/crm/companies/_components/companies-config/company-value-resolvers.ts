import { parseISO } from "date-fns";

import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import type { CustomFieldValue, ResolveFieldValue } from "@/lib/crm-table-engine/types";

import type { Company } from "../companies-data/schema";

const CUSTOM_KEY_PREFIX = "company.custom.";

const today = new Date(2026, 7, 16);

export function getCompanyCustomFieldSystemName(fieldKey: string): string {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX) ? fieldKey.slice(CUSTOM_KEY_PREFIX.length) : fieldKey;
}

export function isCompanyCustomFieldKey(fieldKey: string): boolean {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX);
}

export function getCompanyActivityState(company: Company): string {
  if (!company.lastActivity) return "Never Active";
  const diff = today.getTime() - parseISO(company.lastActivity).getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days <= 30) return "Recently Active";
  return "Inactive";
}

export const resolveCompanyFieldValue: ResolveFieldValue<Company> = (
  company: Company,
  fieldKey: string,
): CustomFieldValue | undefined => {
  switch (fieldKey) {
    case "company.name":
      return company.name;
    case "company.industry":
      return company.industry;
    case "company.website":
      return company.website ?? null;
    case "company.location":
      return company.location ?? null;
    case "company.size":
      return company.size;
    case "company.type":
      return company.type;
    case "company.primaryContact": {
      if (!company.primaryContactId) return null;
      const contact = useContactStore.getState().getContactById(company.primaryContactId);
      return contact?.name ?? null;
    }
    case "company.owner":
      return company.ownerId ?? null;
    case "company.openDeals":
      return company.openDealCount;
    case "company.pipelineValue":
      return company.openPipelineValue;
    case "company.lastActivity":
      return company.lastActivity ? new Date(company.lastActivity).getTime() : null;
    case "company.activityState":
      return getCompanyActivityState(company);
    case "company.createdAt":
      return new Date(company.createdAt).getTime();
    default:
      break;
  }
  if (isCompanyCustomFieldKey(fieldKey)) {
    const systemName = getCompanyCustomFieldSystemName(fieldKey);
    const value = company.customFields?.[systemName];
    return value === undefined ? null : value;
  }
  return undefined;
};
