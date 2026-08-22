"use client";

import type * as React from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";

import { evaluateFilterRules } from "./filter-evaluator";
import type { CustomFieldValue, FilterRule, ResolveFieldValue, SavedView, SortRule, TableField } from "./types";

export const COLUMN_MIN_WIDTH = 72;
export const COLUMN_MAX_WIDTH = 640;

function byPosition(left: TableField, right: TableField): number {
  return left.position - right.position;
}

export function orderFieldsForView(fields: TableField[], view: SavedView | null): TableField[] {
  const sorted = [...fields].sort(byPosition);
  if (!view || view.columnOrder.length === 0) return sorted;

  const byKey = new Map(sorted.map((field) => [field.key, field]));
  const ordered: TableField[] = [];
  for (const key of view.columnOrder) {
    const field = byKey.get(key);
    if (field) {
      ordered.push(field);
      byKey.delete(key);
    }
  }
  for (const field of sorted) {
    if (byKey.has(field.key)) ordered.push(field);
  }
  return ordered;
}

export function isFieldVisibleInView(field: TableField, view: SavedView | null): boolean {
  if (!field.visibleInTable) return false;
  if (field.isRequiredBySystem) return true;
  return view?.columnVisibility[field.key] !== false;
}

export function resolveColumnWidth(field: TableField, view: SavedView | null): number {
  const raw = view?.columnWidths[field.key] ?? field.width;
  return Math.min(COLUMN_MAX_WIDTH, Math.max(COLUMN_MIN_WIDTH, Math.round(raw)));
}

export function viewToSortingState(view: SavedView | null): SortingState {
  if (!view) return [];
  return view.sortRules.map((rule) => ({ id: rule.fieldKey, desc: rule.direction === "desc" }));
}

export function sortingStateToSortRules(sorting: SortingState): SortRule[] {
  return sorting.map((entry) => ({ fieldKey: entry.id, direction: entry.desc ? "desc" : "asc" }));
}

function toSortableValue(value: CustomFieldValue | undefined): string | number {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? 1 : 0;
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

export type TableAdapterParams<TRecord> = {
  fields: TableField[];
  view: SavedView | null;
  resolveValue: ResolveFieldValue<TRecord>;
  renderHeader: (params: { field: TableField }) => React.ReactNode;
  renderCell: (params: { field: TableField; record: TRecord; value: CustomFieldValue | undefined }) => React.ReactNode;
};

export function buildTableColumns<TRecord>(params: TableAdapterParams<TRecord>): ColumnDef<TRecord>[] {
  const ordered = orderFieldsForView(params.fields, params.view).filter((field) =>
    isFieldVisibleInView(field, params.view),
  );

  return ordered.map((field) => ({
    id: field.key,
    accessorFn: (row: TRecord) => toSortableValue(params.resolveValue(row, field.key)),
    header: () => params.renderHeader({ field }),
    cell: (context) =>
      params.renderCell({
        field,
        record: context.row.original,
        value: params.resolveValue(context.row.original, field.key),
      }),
    size: resolveColumnWidth(field, params.view),
    minSize: COLUMN_MIN_WIDTH,
    maxSize: COLUMN_MAX_WIDTH,
    enableSorting: field.sortable,
    enableHiding: !field.isRequiredBySystem,
    enableResizing: true,
  }));
}

export function matchesViewFilters<TRecord>(
  record: TRecord,
  rules: FilterRule[],
  resolveValue: ResolveFieldValue<TRecord>,
  contextUserId?: string,
): boolean {
  return evaluateFilterRules(record, rules, resolveValue, contextUserId);
}
