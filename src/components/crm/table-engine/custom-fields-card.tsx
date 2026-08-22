"use client";

import * as React from "react";

import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { CrmEntityType, CustomFieldValue } from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

import { CustomFieldValueView } from "./custom-field-value-view";

export function CustomFieldsCard({
  entityType,
  pluralLabel,
  values,
}: {
  entityType: CrmEntityType;
  pluralLabel?: string;
  values: Record<string, CustomFieldValue> | undefined;
}) {
  const allCustomFields = useCrmConfigStore((s) => s.customFields);
  const [showEmptyFields, setShowEmptyFields] = React.useState(false);

  const activeCustomFields = React.useMemo(
    () =>
      allCustomFields
        .filter((f) => f.entityType === entityType && !f.archivedAt)
        .sort((a, b) => a.position - b.position),
    [allCustomFields, entityType],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
        {activeCustomFields.length > 0 ? (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              aria-pressed={showEmptyFields}
              onClick={() => setShowEmptyFields((prev) => !prev)}
            >
              {showEmptyFields ? "Hide Empty Fields" : "Show Empty Fields"}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {activeCustomFields.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>No custom fields yet</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>
                Custom fields created from the {pluralLabel ? `${pluralLabel.toLowerCase()} ` : ""}table appear here.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          (() => {
            const populated = activeCustomFields.filter((field) => {
              const value = values?.[field.systemName];
              if (value === undefined || value === null) return false;
              if (typeof value === "string") return value.trim().length > 0;
              if (Array.isArray(value)) return value.length > 0;
              return true;
            });
            const shown = showEmptyFields ? activeCustomFields : populated;
            if (shown.length === 0) {
              return <p className="text-muted-foreground text-sm">No populated custom fields for this record yet.</p>;
            }
            return (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {shown.map((field) => (
                  <div className="flex flex-col gap-1" key={field.id}>
                    <span className="text-muted-foreground text-xs">{field.displayLabel}</span>
                    <span className="text-foreground text-sm">
                      <CustomFieldValueView field={field} value={values?.[field.systemName] ?? null} />
                    </span>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </CardContent>
    </Card>
  );
}
