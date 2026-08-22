"use client";

import { useCrmConfigStore, useEntityLabels } from "@/lib/crm-table-engine/use-crm-config-store";

export { useCrmConfigStore };

export function useLeadEntityLabels() {
  return useEntityLabels("lead");
}

export const leadDefaultViewId = "view-all";
