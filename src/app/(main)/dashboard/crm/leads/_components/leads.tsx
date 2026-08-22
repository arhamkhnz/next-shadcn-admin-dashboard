"use client";
"use no memo";

import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { differenceInCalendarDays, parseISO, startOfQuarter, startOfYear, subDays } from "date-fns";
import { Search, Settings2, Star, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import { currentSalesOwnerId, getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { ColumnResizeHandle, ConfigurableColumnHeader } from "@/components/crm/table-engine/configurable-column-header";
import { CustomFieldDialog } from "@/components/crm/table-engine/custom-field-dialog";
import {
  type ActiveDynamicFilter,
  AddCustomFilterMenu,
  DynamicFilterControl,
} from "@/components/crm/table-engine/dynamic-filter-controls";
import { ManageFieldsSheet } from "@/components/crm/table-engine/manage-fields-sheet";
import {
  selectActiveView,
  selectEntityViews,
  useEntityTableFields,
} from "@/components/crm/table-engine/use-crm-entity-table";
import { useCommitResizedColumnWidths, useCrmTableColumns } from "@/components/crm/table-engine/use-crm-table-columns";
import { ViewsMenu } from "@/components/crm/table-engine/views-menu";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { matchesViewFilters, orderFieldsForView } from "@/lib/crm-table-engine/column-adapter";
import { recordMatchesSearch } from "@/lib/crm-table-engine/filter-evaluator";
import {
  type CustomFieldType,
  FILTERABLE_FIELD_TYPES,
  type FilterRule,
  fieldHasValues,
  type TableField,
} from "@/lib/crm-table-engine/types";

import { ArchiveRestoreDialog } from "./archive-restore-dialog";
import { LeadForm } from "./lead-form";
import { renderLeadFieldCell } from "./lead-table-cells";
import { getFollowUpState, getLeadsActionsColumn, getLeadsSelectColumn, getScoreClassification } from "./leads-columns";
import { resolveLeadFieldValue } from "./leads-config/lead-value-resolvers";
import { useCrmConfigStore, useLeadEntityLabels } from "./leads-config/use-crm-config-store";
import { sourceOptions, statusOptions } from "./leads-data/data";
import type { Lead } from "./leads-data/schema";
import { useLeadStore } from "./leads-data/use-lead-store";

const today = new Date(2026, 7, 16);

const createdDateOptions = ["All", "Today", "This Week", "This Month", "This Quarter", "This Year", "Older"] as const;

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function normalizeInRuleOptions(value: string | number | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === "") return [];
  return [String(value)];
}

function defaultOperatorForType(type: TableField["type"]): "isTrue" | "equals" | "in" | "gte" {
  if (type === "checkbox") return "isTrue";
  if (type === "single_select") return "equals";
  if (type === "multi_select") return "in";
  return "gte";
}

function ariaSortValue(direction: false | "asc" | "desc"): "ascending" | "descending" | undefined {
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return undefined;
}

function ManageFieldsTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onClick}>
      <Settings2 className="size-3.5" />
      Manage Fields
    </Button>
  );
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

function applyFilters(params: {
  leads: Lead[];
  viewFilterRules: FilterRule[] | null;
  fields: TableField[];
  search: string;
  status: string;
  source: string;
  owner: string;
  score: string;
  created: string;
  followUp: string;
  dynamicFilters: ActiveDynamicFilter[];
}) {
  let result = [...params.leads];

  if (params.viewFilterRules) {
    result = result.filter((l) =>
      matchesViewFilters(l, params.viewFilterRules ?? [], resolveLeadFieldValue, currentSalesOwnerId),
    );
  }

  for (const dynamicFilter of params.dynamicFilters) {
    const value = dynamicFilter.value;
    result = result.filter((l) => {
      const resolved = resolveLeadFieldValue(l, dynamicFilter.fieldKey);
      switch (dynamicFilter.operator) {
        case "equals":
          return String(resolved ?? "").toLowerCase() === String(value ?? "").toLowerCase();
        case "notEquals":
          return String(resolved ?? "").toLowerCase() !== String(value ?? "").toLowerCase();
        case "gt":
        case "gte":
        case "lt":
        case "lte": {
          const left = Number(resolved);
          const right = Number(value);
          if (Number.isNaN(left) || Number.isNaN(right)) return false;
          if (dynamicFilter.operator === "gt") return left > right;
          if (dynamicFilter.operator === "gte") return left >= right;
          if (dynamicFilter.operator === "lt") return left < right;
          return left <= right;
        }
        case "isTrue":
          return resolved === true;
        case "isFalse":
          return resolved === false || resolved === undefined || resolved === null;
        case "in": {
          const options = normalizeInRuleOptions(value);
          if (options.length === 0) return true;
          if (Array.isArray(resolved)) {
            return resolved.some((entry) => options.includes(String(entry)));
          }
          return options.includes(String(resolved));
        }
        default:
          return true;
      }
    });
  }

  if (params.search) {
    result = result.filter((l) => recordMatchesSearch(l, params.search, params.fields, resolveLeadFieldValue));
  }

  if (params.status !== "All") {
    result = result.filter((l) => l.status === params.status);
  }

  if (params.source !== "All") {
    result = result.filter((l) => l.source === params.source);
  }

  if (params.owner !== "All") {
    if (params.owner === "me") {
      result = result.filter((l) => l.ownerId === "arham");
    } else {
      result = result.filter((l) => l.ownerId === params.owner);
    }
  }

  if (params.score !== "All") {
    result = result.filter((l) => getScoreClassification(l.score) === params.score);
  }

  if (params.created !== "All") {
    const yearStart = startOfYear(today);
    const quarterStart = startOfQuarter(today);
    switch (params.created) {
      case "Today": {
        const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        result = result.filter((l) => parseISO(l.createdAt) >= dayStart);
        break;
      }
      case "This Week":
        result = result.filter((l) => parseISO(l.createdAt) >= subDays(today, 7));
        break;
      case "This Month":
        result = result.filter((l) => parseISO(l.createdAt) >= subDays(today, 30));
        break;
      case "This Quarter":
        result = result.filter((l) => parseISO(l.createdAt) >= quarterStart);
        break;
      case "This Year":
        result = result.filter((l) => parseISO(l.createdAt) >= yearStart);
        break;
      case "Older":
        result = result.filter((l) => parseISO(l.createdAt) < yearStart);
        break;
    }
  }

  if (params.followUp !== "All") {
    result = result.filter((l) => getFollowUpState(l.nextActivity) === params.followUp);
  }

  return result;
}

export function Leads() {
  const labels = useLeadEntityLabels();
  const singularLabel = labels.singularLabel;
  const pluralLabel = labels.pluralLabel;

  const leads = useLeadStore((s) => s.leads);
  const setLeadCustomFieldValue = useLeadStore((s) => s.setLeadCustomFieldValue);

  const fields = useEntityTableFields("lead");
  const allViews = useCrmConfigStore((s) => s.views);
  const activeViewId = useCrmConfigStore((s) => s.activeViewIds.lead);
  const entityViews = React.useMemo(() => selectEntityViews(allViews, "lead"), [allViews]);
  const activeView = React.useMemo(() => selectActiveView(allViews, "lead", activeViewId), [allViews, activeViewId]);
  const setActiveViewId = useCrmConfigStore((s) => s.setActiveView);
  const updateViewPresentation = useCrmConfigStore((s) => s.updateViewPresentation);
  const moveField = useCrmConfigStore((s) => s.moveField);
  const renameFieldLabel = useCrmConfigStore((s) => s.renameFieldLabel);
  const restoreFieldDefaultLabel = useCrmConfigStore((s) => s.restoreFieldDefaultLabel);
  const archiveConfigField = useCrmConfigStore((s) => s.archiveField);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [sourceFilter, setSourceFilter] = React.useState<string>("All");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("All");
  const [scoreFilter, setScoreFilter] = React.useState<string>("All");
  const [createdFilter, setCreatedFilter] = React.useState<string>("All");
  const [followUpFilter, setFollowUpFilter] = React.useState<string>("All");
  const [dynamicFilters, setDynamicFilters] = React.useState<ActiveDynamicFilter[]>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const [editLead, setEditLead] = React.useState<Lead | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Lead | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<Lead | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = React.useState(false);
  const [bulkRestoreOpen, setBulkRestoreOpen] = React.useState(false);

  const [manageFieldsOpen, setManageFieldsOpen] = React.useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = React.useState(false);
  const [dialogField, setDialogField] = React.useState<TableField | null>(null);
  const [dialogInitialType, setDialogInitialType] = React.useState<CustomFieldType>("text");

  const archiveLead = useLeadStore((s) => s.archiveLead);
  const restoreLead = useLeadStore((s) => s.restoreLead);
  const bulkArchiveLeads = useLeadStore((s) => s.bulkArchiveLeads);
  const bulkRestoreLeads = useLeadStore((s) => s.bulkRestoreLeads);

  const orderedFieldKeys = React.useMemo(
    () => orderFieldsForView(fields, activeView).map((f) => f.key),
    [fields, activeView],
  );

  const filterableCustomFields = React.useMemo(
    () => fields.filter((f) => !f.isCore && FILTERABLE_FIELD_TYPES.includes(f.type)),
    [fields],
  );

  const dialogHasValues = React.useMemo(
    () =>
      dialogField
        ? fieldHasValues({ records: leads, fieldKey: dialogField.key, resolveValue: resolveLeadFieldValue })
        : false,
    [dialogField, leads],
  );

  const handleCommitCustomValue = React.useCallback(
    (lead: Lead, field: TableField, value: NonNullable<Lead["customFields"]>[string]) => {
      setLeadCustomFieldValue(lead.id, field.systemName, value);
    },
    [setLeadCustomFieldValue],
  );

  const columnHeaderActions = React.useMemo(() => {
    return {
      onSort: (field: TableField, direction: "asc" | "desc") =>
        updateViewPresentation(activeView?.id ?? "", { sortRules: [{ fieldKey: field.key, direction }] }),
      onRename: (field: TableField, label: string) => renameFieldLabel(field.id, label),
      onMove: (field: TableField, direction: "left" | "right") => moveField("lead", field.key, direction),
      onHide: (field: TableField) =>
        updateViewPresentation(activeView?.id ?? "", {
          columnVisibility: { ...(activeView?.columnVisibility ?? {}), [field.key]: false },
        }),
      onEditField: (field: TableField) => {
        setDialogField(field);
        setDialogInitialType(field.type);
        setFieldDialogOpen(true);
      },
      onArchiveField: (field: TableField) => {
        archiveConfigField(field.id);
        toast(`${field.displayLabel} archived`, {
          description: "Saved values are preserved and the field can be restored.",
        });
      },
      onRestoreDefaultLabel: (field: TableField) => restoreFieldDefaultLabel(field.id),
    };
  }, [activeView, updateViewPresentation, renameFieldLabel, moveField, archiveConfigField, restoreFieldDefaultLabel]);

  const renderHeader = React.useCallback(
    ({ field }: { field: TableField }) => (
      <ConfigurableColumnHeader
        key={field.key}
        field={field}
        activeDirection={activeView?.sortRules.find((r) => r.fieldKey === field.key)?.direction ?? null}
        canMoveLeft={orderedFieldKeys.indexOf(field.key) > 0}
        canMoveRight={orderedFieldKeys.indexOf(field.key) < orderedFieldKeys.length - 1}
        labelOverridden={field.displayLabel !== field.defaultLabel}
        actions={columnHeaderActions}
      />
    ),
    [activeView, orderedFieldKeys, columnHeaderActions],
  );

  const renderCell = React.useCallback(
    ({ field, record }: { field: TableField; record: Lead }) =>
      renderLeadFieldCell({ field, lead: record, onCommitCustomValue: handleCommitCustomValue }),
    [handleCommitCustomValue],
  );

  const selectColumn = React.useMemo(() => getLeadsSelectColumn(), []);

  const actionsColumn = React.useMemo(
    () =>
      getLeadsActionsColumn({
        onEditLead: (lead) => setEditLead(lead),
        onArchiveLead: (lead) => setArchiveTarget(lead),
        onRestoreLead: (lead) => setRestoreTarget(lead),
      }),
    [],
  );

  const handleCreateField = React.useCallback((type: CustomFieldType) => {
    setDialogField(null);
    setDialogInitialType(type);
    setFieldDialogOpen(true);
  }, []);

  const { columns, sorting, columnSizing, handleSortingChange, handleColumnSizingChange } = useCrmTableColumns<Lead>({
    fields,
    activeView,
    resolveValue: resolveLeadFieldValue,
    renderHeader,
    renderCell,
    selectColumn,
    actionsColumn,
    onCreateField: handleCreateField,
    updateViewPresentation,
  });

  const isArchivedView = Boolean(activeView?.filterRules.some((rule) => rule.operator === "isArchived")) ?? false;

  const filteredLeads = applyFilters({
    leads,
    viewFilterRules: activeView?.filterRules ?? null,
    fields,
    search: searchQuery,
    status: statusFilter,
    source: sourceFilter,
    owner: ownerFilter,
    score: scoreFilter,
    created: createdFilter,
    followUp: followUpFilter,
    dynamicFilters,
  });

  const table = useReactTable({
    data: filteredLeads,
    columns,
    state: { rowSelection, sorting, columnSizing, pagination },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnSizingChange: handleColumnSizingChange,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
    columnResizeMode: "onChange",
  });

  useCommitResizedColumnWidths({ table, fields, activeView, updateViewPresentation });

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const rowsPerPage = `${table.getState().pagination.pageSize}`;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalResults = filteredLeads.length;

  function handleViewChange(viewId: string) {
    setActiveViewId("lead", viewId);
    setSearchQuery("");
    setStatusFilter("All");
    setSourceFilter("All");
    setOwnerFilter("All");
    setScoreFilter("All");
    setCreatedFilter("All");
    setFollowUpFilter("All");
    setDynamicFilters([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleFilterChange(value: string, setter: (v: string) => void) {
    setter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeFilters = [statusFilter, sourceFilter, ownerFilter, scoreFilter, createdFilter, followUpFilter].filter(
    (f) => f !== "All",
  );

  function clearAllFilters() {
    setStatusFilter("All");
    setSourceFilter("All");
    setOwnerFilter("All");
    setScoreFilter("All");
    setCreatedFilter("All");
    setFollowUpFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeLeadCount = totalResults;
  const archivedLeadCount = leads.filter((l) => Boolean(l.archivedAt)).length;
  const newThisMonth = filteredLeads.filter((l) => {
    const created = parseISO(l.createdAt);
    return created.getMonth() === today.getMonth() && created.getFullYear() === today.getFullYear();
  }).length;
  const qualifiedRate =
    activeLeadCount > 0
      ? Math.round((filteredLeads.filter((l) => l.status === "Qualified").length / activeLeadCount) * 100)
      : 0;
  const avgResponseTime =
    filteredLeads.length > 0
      ? Math.round(
          filteredLeads.reduce(
            (sum, l) => sum + differenceInCalendarDays(parseISO(l.lastActivity), parseISO(l.createdAt)),
            0,
          ) / filteredLeads.length,
        )
      : 0;
  const needsFollowUp = filteredLeads.filter((l) => {
    const state = getFollowUpState(l.nextActivity);
    return state === "Overdue" || state === "Due Today";
  }).length;

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">{pluralLabel}</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Manage prospects, prioritize follow-ups, and move qualified {pluralLabel.toLowerCase()} into the sales
          pipeline.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder={`Search ${pluralLabel.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
            <InputGroupAddon align="inline-end">
              <Kbd className="h-4 text-[10px]">⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          {!isArchivedView ? (
            <Button variant="outline" size="sm" onClick={() => setAddSheetOpen(true)}>
              <UserPlus data-icon="inline-start" />
              Add {singularLabel}
            </Button>
          ) : null}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <section className="px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Active {pluralLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{activeLeadCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Archived</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{archivedLeadCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>New This Month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{newThisMonth}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Qualified Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{qualifiedRate}%</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Avg Response Time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{avgResponseTime}d</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Needs Follow-up</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{needsFollowUp}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-2 px-4">
          {entityViews.map((view) => (
            <Button
              key={view.id}
              variant={activeView?.id === view.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleViewChange(view.id)}
            >
              {view.isDefault ? <Star className="size-3" /> : null}
              {view.name}
            </Button>
          ))}
          <ViewsMenu entityType="lead" />
          <ManageFieldsTrigger onClick={() => setManageFieldsOpen(true)} />
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4">
          <Select value={statusFilter} onValueChange={(v) => handleFilterChange(v, setStatusFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={(v) => handleFilterChange(v, setSourceFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Source:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                {sourceOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={ownerFilter} onValueChange={(v) => handleFilterChange(v, setOwnerFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Owner:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All owners</SelectItem>
                <SelectItem value="me">My leads</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectItem value="null">Unassigned</SelectItem>
              </SelectGroup>
              <SelectGroup>
                {(["arham", "ammar", "sofia", "ethan", "nadia", "lucas", "isla", "kenji"] as const).map((id) => (
                  <SelectItem key={id} value={id}>
                    {getOwnerName(id)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={scoreFilter} onValueChange={(v) => handleFilterChange(v, setScoreFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Score:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All scores</SelectItem>
                <SelectItem value="Hot">Hot (75-100)</SelectItem>
                <SelectItem value="Warm">Warm (40-74)</SelectItem>
                <SelectItem value="Cold">Cold (0-39)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={createdFilter} onValueChange={(v) => handleFilterChange(v, setCreatedFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Created:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                {createdDateOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={followUpFilter} onValueChange={(v) => handleFilterChange(v, setFollowUpFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Follow-up:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Due Today">Due Today</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Not Scheduled">Not Scheduled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {filterableCustomFields.length > 0 ? (
            <AddCustomFilterMenu
              fields={filterableCustomFields}
              disabledKeys={new Set(dynamicFilters.map((f) => f.fieldKey))}
              onAdd={(field) => {
                const operator = defaultOperatorForType(field.type);
                setDynamicFilters((prev) => [
                  ...prev,
                  {
                    id: `df-${Date.now().toString(36)}-${prev.length}`,
                    fieldKey: field.key,
                    fieldLabel: field.displayLabel,
                    fieldType: field.type,
                    options: field.options,
                    operator,
                  },
                ]);
              }}
            />
          ) : null}

          {dynamicFilters.map((filter) => (
            <DynamicFilterControl
              key={filter.id}
              filter={filter}
              onPatch={(patch) =>
                setDynamicFilters((prev) => prev.map((f) => (f.id === filter.id ? { ...f, ...patch } : f)))
              }
              onRemove={() => setDynamicFilters((prev) => prev.filter((f) => f.id !== filter.id))}
            />
          ))}

          {activeFilters.length > 0 ? (
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-muted-foreground" onClick={clearAllFilters}>
              <X className="size-3" />
              Clear All
            </Button>
          ) : null}
        </div>

        {selectedCount > 0 ? (
          <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
            <span className="text-muted-foreground text-sm tabular-nums">{selectedCount} selected</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled title="Bulk assign will be available in a future step">
                Assign Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                title="Bulk status change will be available in a future step"
              >
                Change Status
              </Button>
              <Button variant="outline" size="sm" disabled title="Bulk tagging will be available in a future step">
                Add Tag
              </Button>
              {isArchivedView ? (
                <Button variant="outline" size="sm" onClick={() => setBulkRestoreOpen(true)}>
                  Restore
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setBulkArchiveOpen(true)}>
                  Archive
                </Button>
              )}
            </div>
          </div>
        ) : null}

        <div>
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <colgroup>
              {table.getVisibleLeafColumns().map((column) => (
                <col key={column.id} style={{ width: table.getColumn(column.id)?.getSize() }} />
              ))}
            </colgroup>
            <TableHeader className="[&_tr]:border-t">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      aria-sort={ariaSortValue(header.column.getIsSorted())}
                      className="relative select-none py-4 font-normal"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() ? (
                        <ColumnResizeHandle
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          isResizing={header.column.getIsResizing()}
                        />
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/60 hover:bg-white/2.5"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        {searchQuery
                          ? `No ${pluralLabel.toLowerCase()} match "${searchQuery}"`
                          : `No ${pluralLabel.toLowerCase()} found.`}
                      </span>
                      {searchQuery || activeFilters.length > 0 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("");
                            clearAllFilters();
                          }}
                        >
                          <X className="size-3" />
                          Clear all filters
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select value={rowsPerPage} onValueChange={(v) => table.setPageSize(Number(v))}>
                <SelectTrigger size="sm" className="w-20" id="leads-rows-per-page">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((ps) => (
                      <SelectItem key={ps} value={`${ps}`}>
                        {ps}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <span className="tabular-nums">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                totalResults,
              )}{" "}
              of {totalResults}
            </span>
          </div>

          <Pagination className="mx-0 w-auto justify-start md:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    preventPaginationNavigation(event);
                    table.previousPage();
                  }}
                />
              </PaginationItem>
              {pageNumbers[0] > 1 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={`page-${pageNumber}`}>
                  <PaginationLink
                    href="#"
                    isActive={table.getState().pagination.pageIndex === pageNumber - 1}
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.setPageIndex(pageNumber - 1);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    preventPaginationNavigation(event);
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
      <LeadForm open={addSheetOpen} onOpenChange={setAddSheetOpen} />
      <LeadForm
        open={Boolean(editLead)}
        onOpenChange={(open) => {
          if (!open) setEditLead(null);
        }}
        lead={editLead ?? undefined}
      />
      <CustomFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        entityType="lead"
        field={dialogField}
        initialType={dialogInitialType}
        hasValues={dialogHasValues}
      />
      <ManageFieldsSheet
        open={manageFieldsOpen}
        onOpenChange={setManageFieldsOpen}
        entityType="lead"
        onEditField={(field) => {
          setDialogField(field);
          setDialogInitialType(field.type);
          setFieldDialogOpen(true);
        }}
      />
      <ArchiveRestoreDialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        mode="archive"
        count={1}
        entitySingularLabel={singularLabel.toLowerCase()}
        entityPluralLabel={pluralLabel.toLowerCase()}
        onConfirm={() => {
          if (archiveTarget) {
            archiveLead(archiveTarget.id, currentSalesOwnerId);
            toast(`${singularLabel} archived`, { description: `${archiveTarget.name} has been archived.` });
          }
          setArchiveTarget(null);
        }}
      />
      <ArchiveRestoreDialog
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        mode="restore"
        count={1}
        entitySingularLabel={singularLabel.toLowerCase()}
        entityPluralLabel={pluralLabel.toLowerCase()}
        onConfirm={() => {
          if (restoreTarget) {
            restoreLead(restoreTarget.id);
            toast(`${singularLabel} restored`, { description: `${restoreTarget.name} has been restored.` });
          }
          setRestoreTarget(null);
        }}
      />
      <ArchiveRestoreDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        mode="archive"
        count={selectedCount}
        entitySingularLabel={singularLabel.toLowerCase()}
        entityPluralLabel={pluralLabel.toLowerCase()}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkArchiveLeads(ids, currentSalesOwnerId);
          setRowSelection({});
          toast(`${pluralLabel} archived`, { description: `${ids.length} record(s) have been archived.` });
        }}
      />
      <ArchiveRestoreDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        mode="restore"
        count={selectedCount}
        entitySingularLabel={singularLabel.toLowerCase()}
        entityPluralLabel={pluralLabel.toLowerCase()}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkRestoreLeads(ids);
          setRowSelection({});
          toast(`${pluralLabel} restored`, { description: `${ids.length} record(s) have been restored.` });
        }}
      />
    </Card>
  );
}
