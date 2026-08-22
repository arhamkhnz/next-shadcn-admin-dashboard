import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import type { CustomFieldValue, ResolveFieldValue } from "@/lib/crm-table-engine/types";

import type { Deal } from "../deals-data/schema";

const CUSTOM_KEY_PREFIX = "deal.custom.";

const today = new Date(2026, 7, 16);

export function getDealCustomFieldSystemName(fieldKey: string): string {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX) ? fieldKey.slice(CUSTOM_KEY_PREFIX.length) : fieldKey;
}

export function isDealCustomFieldKey(fieldKey: string): boolean {
  return fieldKey.startsWith(CUSTOM_KEY_PREFIX);
}

function isOpen(stage: Deal["stage"]): boolean {
  return stage !== "Closed Won" && stage !== "Closed Lost";
}

export const resolveDealFieldValue: ResolveFieldValue<Deal> = (
  deal: Deal,
  fieldKey: string,
): CustomFieldValue | undefined => {
  switch (fieldKey) {
    case "deal.name":
      return deal.name;
    case "deal.company": {
      const company = useCompanyStore.getState().getCompanyById(deal.companyId);
      return company?.name ?? null;
    }
    case "deal.primaryContact": {
      if (!deal.primaryContactId) return null;
      const contact = useContactStore.getState().getContactById(deal.primaryContactId);
      return contact?.name ?? null;
    }
    case "deal.stage":
      return deal.stage;
    case "deal.value":
      return deal.value;
    case "deal.probability":
      return deal.probability;
    case "deal.health":
      return deal.health;
    case "deal.owner":
      return deal.ownerId ?? null;
    case "deal.source":
      return deal.source;
    case "deal.lastActivity":
      return deal.lastActivityDate ? new Date(deal.lastActivityDate).getTime() : null;
    case "deal.expectedClose":
      return deal.expectedCloseDate ? new Date(deal.expectedCloseDate).getTime() : null;
    case "deal.closingThisMonth": {
      if (!deal.expectedCloseDate || !isOpen(deal.stage)) return false;
      const close = new Date(deal.expectedCloseDate);
      return close.getMonth() === today.getMonth() && close.getFullYear() === today.getFullYear();
    }
    case "deal.overdueState": {
      if (!deal.expectedCloseDate || !isOpen(deal.stage)) return false;
      return new Date(deal.expectedCloseDate).getTime() < today.getTime();
    }
    case "deal.createdAt":
      return new Date(deal.createdAt).getTime();
    default:
      break;
  }
  if (isDealCustomFieldKey(fieldKey)) {
    const systemName = getDealCustomFieldSystemName(fieldKey);
    const value = deal.customFields?.[systemName];
    return value === undefined ? null : value;
  }
  return undefined;
};
