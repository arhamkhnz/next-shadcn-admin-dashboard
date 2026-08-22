"use client";

import { Badge } from "@/components/ui/badge";
import { formatFieldValue, isEmptyValue } from "@/lib/crm-table-engine/format";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";

export function CustomFieldValueView({ field, value }: { field: TableField; value: CustomFieldValue }) {
  if (field.type === "multi_select" && Array.isArray(value) && value.length > 0) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((entry) => (
          <Badge key={entry} className="rounded-full px-2 py-0.5 text-xs" variant="outline">
            {entry}
          </Badge>
        ))}
      </div>
    );
  }
  if (isEmptyValue(value)) return <span className="text-muted-foreground italic">Not provided</span>;
  if (field.type === "url" && typeof value === "string") {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {value.replace(/^https?:\/\//, "")}
      </a>
    );
  }
  if (field.type === "email" && typeof value === "string") {
    return (
      <a href={`mailto:${value}`} className="hover:underline">
        {value}
      </a>
    );
  }
  if (field.type === "phone" && typeof value === "string") {
    return (
      <a href={`tel:${value}`} className="hover:underline">
        {value}
      </a>
    );
  }
  return <>{formatFieldValue(field, value)}</>;
}
