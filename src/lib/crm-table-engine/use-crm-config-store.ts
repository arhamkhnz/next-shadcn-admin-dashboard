"use client";

import { createCrmTableConfigStore } from "./crm-config-store";
import { CRM_ENTITY_CONFIGS } from "./entities";
import type { CrmEntityType } from "./types";

export const useCrmConfigStore = createCrmTableConfigStore({
  coreFields: {
    lead: CRM_ENTITY_CONFIGS.lead.coreFields,
    contact: CRM_ENTITY_CONFIGS.contact.coreFields,
    company: CRM_ENTITY_CONFIGS.company.coreFields,
    deal: CRM_ENTITY_CONFIGS.deal.coreFields,
    activity: CRM_ENTITY_CONFIGS.activity.coreFields,
    task: CRM_ENTITY_CONFIGS.task.coreFields,
  },
  customFields: Object.values(CRM_ENTITY_CONFIGS).flatMap((config) => config.seedCustomFields ?? []),
  views: Object.values(CRM_ENTITY_CONFIGS).flatMap((config) => config.defaultSavedViews),
});

export function useEntityLabels(entityType: CrmEntityType) {
  return useCrmConfigStore((s) => s.terminology[entityType]);
}
