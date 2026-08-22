"use client";

import * as React from "react";

import type { ColumnDef, ColumnSizingState, SortingState, Table } from "@tanstack/react-table";

import {
  buildTableColumns,
  resolveColumnWidth,
  sortingStateToSortRules,
  viewToSortingState,
} from "@/lib/crm-table-engine/column-adapter";
import type { ResolveFieldValue, SavedView, SortRule, TableField } from "@/lib/crm-table-engine/types";

import { AddFieldHeader } from "./configurable-column-header";

export type CrmTableCellParams<TRecord> = {
  field: TableField;
  record: TRecord;
};

export type UseCrmTableColumnsOptions<TRecord> = {
  fields: TableField[];
  activeView: SavedView | null;
  resolveValue: ResolveFieldValue<TRecord>;
  renderCell: (params: CrmTableCellParams<TRecord>) => React.ReactNode;
  renderHeader?: (params: { field: TableField }) => React.ReactNode;
  selectColumn?: ColumnDef<TRecord>;
  actionsColumn?: ColumnDef<TRecord>;
  onCreateField?: (type: TableField["type"]) => void;
  updateViewPresentation?: (
    viewId: string,
    patch: { columnWidths?: Record<string, number>; sortRules?: SortRule[] },
  ) => void;
};

export type UseCrmTableColumnsResult<TRecord> = {
  columns: ColumnDef<TRecord>[];
  sortableColumnIds: Set<string>;
  sorting: SortingState;
  columnSizing: ColumnSizingState;
  handleSortingChange: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
  handleColumnSizingChange: (updater: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState)) => void;
};

export function useCrmTableColumns<TRecord>(
  options: UseCrmTableColumnsOptions<TRecord>,
): UseCrmTableColumnsResult<TRecord> {
  const { fields, activeView } = options;

  const [liveSizing, setLiveSizing] = React.useState<ColumnSizingState>({});

  const columns = React.useMemo(() => {
    const configuredColumns = buildTableColumns<TRecord>({
      fields,
      view: activeView,
      resolveValue: options.resolveValue,
      renderHeader:
        options.renderHeader ??
        (({ field }: { field: TableField }) => field.displayLabel as unknown as React.ReactNode),
      renderCell: ({ field, record }) => options.renderCell({ field, record }),
    });

    const result: ColumnDef<TRecord>[] = [];
    if (options.selectColumn) result.push(options.selectColumn);
    result.push(...configuredColumns);
    const onCreateField = options.onCreateField;
    if (onCreateField) {
      result.push({
        id: "__add_field__",
        header: () => <AddFieldHeader onCreateField={onCreateField} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 48,
      });
    }
    if (options.actionsColumn) result.push(options.actionsColumn);
    return result;
  }, [
    fields,
    activeView,
    options.resolveValue,
    options.renderCell,
    options.renderHeader,
    options.selectColumn,
    options.actionsColumn,
    options.onCreateField,
  ]);

  const sortableColumnIds = React.useMemo(() => new Set(columns.map((column) => column.id ?? "")), [columns]);

  const sorting = React.useMemo(
    () => viewToSortingState(activeView).filter((entry) => sortableColumnIds.has(entry.id)),
    [activeView, sortableColumnIds],
  );

  const baseColumnSizing = React.useMemo(() => {
    const sizing: ColumnSizingState = {};
    if (options.selectColumn) sizing[options.selectColumn.id ?? "select"] = 44;
    if (options.onCreateField) sizing.__add_field__ = 48;
    if (options.actionsColumn) sizing[options.actionsColumn.id ?? "actions"] = 88;
    for (const field of fields) {
      sizing[field.key] = resolveColumnWidth(field, activeView);
    }
    return sizing;
  }, [fields, activeView, options.selectColumn, options.actionsColumn, options.onCreateField]);

  const columnSizing = React.useMemo(() => ({ ...baseColumnSizing, ...liveSizing }), [baseColumnSizing, liveSizing]);

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (activeView && options.updateViewPresentation) {
        options.updateViewPresentation(activeView.id, { sortRules: sortingStateToSortRules(next) });
      }
    },
    [activeView, options.updateViewPresentation, sorting],
  );

  const handleColumnSizingChange = React.useCallback(
    (updater: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState)) => {
      setLiveSizing(typeof updater === "function" ? updater(columnSizing) : updater);
    },
    [columnSizing],
  );

  return {
    columns,
    sortableColumnIds,
    sorting,
    columnSizing,
    handleSortingChange,
    handleColumnSizingChange,
  };
}

export function useCommitResizedColumnWidths<TRecord>(params: {
  table: Table<TRecord>;
  fields: TableField[];
  activeView: SavedView | null;
  updateViewPresentation: (
    viewId: string,
    patch: { columnWidths?: Record<string, number>; sortRules?: SortRule[] },
  ) => void;
}): void {
  const { table, fields, activeView, updateViewPresentation } = params;

  const columnSizingInfo = table.getState().columnSizingInfo as { isResizingColumn?: false | string } | undefined;
  const wasResizingRef = React.useRef(false);

  React.useEffect(() => {
    const resizingNow = Boolean(columnSizingInfo?.isResizingColumn);
    if (wasResizingRef.current && !resizingNow && activeView) {
      const liveSizes = table.getState().columnSizing;
      const patch: Record<string, number> = {};
      for (const field of fields) {
        const live = liveSizes[field.key];
        if (live === undefined) continue;
        if (Math.round(live) !== resolveColumnWidth(field, activeView)) {
          patch[field.key] = Math.round(live);
        }
      }
      if (Object.keys(patch).length > 0) {
        updateViewPresentation(activeView.id, { columnWidths: { ...activeView.columnWidths, ...patch } });
      }
    }
    wasResizingRef.current = resizingNow;
  });
}
