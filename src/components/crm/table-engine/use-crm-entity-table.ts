"use client";

import * as React from "react";

import type { CrmEntityType, SavedView, TableField } from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

export function selectEntityViews(views: SavedView[], entityType: CrmEntityType): SavedView[] {
  return views.filter((v) => v.entityType === entityType && !v.archivedAt);
}

export function selectActiveView(
  views: SavedView[],
  entityType: CrmEntityType,
  activeViewId: string | undefined,
): SavedView | null {
  const entityViews = selectEntityViews(views, entityType);
  if (entityViews.length === 0) return null;
  const active = activeViewId ? entityViews.find((v) => v.id === activeViewId) : undefined;
  if (active) return active;
  return entityViews.find((v) => v.isDefault) ?? entityViews[0];
}

export function useEntityTableFields(entityType: CrmEntityType): TableField[] {
  const entityCoreFields = useCrmConfigStore((s) => s.coreFields[entityType]);
  const allCustomFields = useCrmConfigStore((s) => s.customFields);
  return React.useMemo(
    () =>
      [
        ...(entityCoreFields ?? []),
        ...allCustomFields.filter((f) => f.entityType === entityType && !f.archivedAt),
      ].sort((a, b) => a.position - b.position),
    [entityCoreFields, allCustomFields, entityType],
  );
}

export function useEntityFormFields(entityType: CrmEntityType): TableField[] {
  const allCustomFields = useCrmConfigStore((s) => s.customFields);
  return React.useMemo(
    () =>
      allCustomFields
        .filter((f) => f.entityType === entityType && !f.archivedAt && f.visibleInForm)
        .sort((a, b) => a.position - b.position),
    [allCustomFields, entityType],
  );
}
