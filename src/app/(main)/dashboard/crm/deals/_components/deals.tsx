"use client";
"use no memo";

import * as React from "react";

import { useSearchParams } from "next/navigation";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Columns3Icon, LayoutGridIcon, PlusIcon, Search, Settings2, X } from "lucide-react";
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
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

import { BulkAddTagDialog } from "./bulk-add-tag-dialog";
import { BulkAssignOwnerDialog } from "./bulk-assign-owner-dialog";
import { BulkChangeStageDialog } from "./bulk-change-stage-dialog";
import { DealArchiveRestoreDialog } from "./deal-archive-restore-dialog";
import { DealForm } from "./deal-form";
import { DealPipeline } from "./deal-pipeline";
import { ChangeStageDialog, MarkLostDialog, MarkWonDialog, ReopenDealDialog } from "./deal-workflows";
import { getDealsActionsColumn, getDealsSelectColumn, renderDealFieldCell } from "./deals-columns";
import { resolveDealFieldValue } from "./deals-config/deal-value-resolvers";
import { healthOptions, priorityOptions, sourceOptions, stageOptions } from "./deals-data/data";
import type { Deal, DealStage } from "./deals-data/schema";
import { useDealStore } from "./deals-data/use-deal-store";

const today = new Date(2026, 7, 16);

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

function isOpen(stage: DealStage): boolean {
  return stage !== "Closed Won" && stage !== "Closed Lost";
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

function applyFilters(
  allDeals: Deal[],
  params: {
    viewFilterRules: FilterRule[] | null;
    fields: TableField[];
    search: string;
    stage: string;
    health: string;
    priority: string;
    owner: string;
    source: string;
    dynamicFilters: ActiveDynamicFilter[];
  },
): Deal[] {
  let result = [...allDeals];

  if (params.viewFilterRules) {
    result = result.filter((d) =>
      matchesViewFilters(d, params.viewFilterRules ?? [], resolveDealFieldValue, currentSalesOwnerId),
    );
  }

  for (const dynamicFilter of params.dynamicFilters) {
    const value = dynamicFilter.value;
    result = result.filter((d) => {
      const resolved = resolveDealFieldValue(d, dynamicFilter.fieldKey);
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
    result = result.filter((d) => recordMatchesSearch(d, params.search, params.fields, resolveDealFieldValue));
  }

  if (params.stage !== "All") {
    result = result.filter((d) => d.stage === params.stage);
  }

  if (params.health !== "All") {
    result = result.filter((d) => d.health === params.health);
  }

  if (params.priority !== "All") {
    result = result.filter((d) => d.priority === params.priority);
  }

  if (params.owner !== "All") {
    if (params.owner === "me") {
      result = result.filter((d) => d.ownerId === currentSalesOwnerId);
    } else {
      result = result.filter((d) => d.ownerId === params.owner);
    }
  }

  if (params.source !== "All") {
    result = result.filter((d) => d.source === params.source);
  }

  return result;
}

export function Deals() {
  const deals = useDealStore((s) => s.deals);
  const setDealCustomFieldValue = useDealStore((s) => s.setDealCustomFieldValue);
  const searchParams = useSearchParams();
  const initialViewMode = searchParams.get("view") === "pipeline" ? "pipeline" : "list";
  const initialStageParam = searchParams.get("stage");
  const initialStage =
    initialStageParam && stageOptions.includes(initialStageParam as DealStage) ? initialStageParam : "All";
  const [viewMode, setViewMode] = React.useState<"list" | "pipeline">(initialViewMode);

  const fields = useEntityTableFields("deal");
  const allViews = useCrmConfigStore((s) => s.views);
  const activeViewId = useCrmConfigStore((s) => s.activeViewIds.deal);
  const entityViews = React.useMemo(() => selectEntityViews(allViews, "deal"), [allViews]);
  const activeView = React.useMemo(() => selectActiveView(allViews, "deal", activeViewId), [allViews, activeViewId]);
  const setActiveViewId = useCrmConfigStore((s) => s.setActiveView);
  const updateViewPresentation = useCrmConfigStore((s) => s.updateViewPresentation);
  const moveField = useCrmConfigStore((s) => s.moveField);
  const renameFieldLabel = useCrmConfigStore((s) => s.renameFieldLabel);
  const restoreFieldDefaultLabel = useCrmConfigStore((s) => s.restoreFieldDefaultLabel);
  const archiveConfigField = useCrmConfigStore((s) => s.archiveField);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState<string>(initialStage);
  const [healthFilter, setHealthFilter] = React.useState<string>("All");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("All");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("All");
  const [sourceFilter, setSourceFilter] = React.useState<string>("All");
  const [dynamicFilters, setDynamicFilters] = React.useState<ActiveDynamicFilter[]>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const [editDeal, setEditDeal] = React.useState<Deal | null>(null);
  const [changeStageDeal, setChangeStageDeal] = React.useState<Deal | null>(null);
  const [markWonDeal, setMarkWonDeal] = React.useState<Deal | null>(null);
  const [markLostDeal, setMarkLostDeal] = React.useState<Deal | null>(null);
  const [reopenDeal, setReopenDeal] = React.useState<Deal | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Deal | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<Deal | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = React.useState(false);
  const [bulkRestoreOpen, setBulkRestoreOpen] = React.useState(false);
  const [bulkAssignOwnerOpen, setBulkAssignOwnerOpen] = React.useState(false);
  const [bulkChangeStageOpen, setBulkChangeStageOpen] = React.useState(false);
  const [bulkAddTagOpen, setBulkAddTagOpen] = React.useState(false);
  const [manageFieldsOpen, setManageFieldsOpen] = React.useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = React.useState(false);
  const [dialogField, setDialogField] = React.useState<TableField | null>(null);
  const [dialogInitialType, setDialogInitialType] = React.useState<CustomFieldType>("text");

  const archiveDeal = useDealStore((s) => s.archiveDeal);
  const restoreDeal = useDealStore((s) => s.restoreDeal);
  const updateDeal = useDealStore((s) => s.updateDeal);
  const bulkArchiveDeals = useDealStore((s) => s.bulkArchiveDeals);
  const bulkRestoreDeals = useDealStore((s) => s.bulkRestoreDeals);
  const bulkAssignOwner = useDealStore((s) => s.bulkAssignOwner);
  const bulkChangeStage = useDealStore((s) => s.bulkChangeStage);
  const bulkAddTag = useDealStore((s) => s.bulkAddTag);

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
        ? fieldHasValues({ records: deals ?? [], fieldKey: dialogField.key, resolveValue: resolveDealFieldValue })
        : false,
    [dialogField, deals],
  );

  const handleCommitCustomValue = React.useCallback(
    (deal: Deal, field: TableField, value: NonNullable<Deal["customFields"]>[string]) => {
      setDealCustomFieldValue(deal.id, field.systemName, value);
    },
    [setDealCustomFieldValue],
  );

  const columnHeaderActions = React.useMemo(() => {
    return {
      onSort: (field: TableField, direction: "asc" | "desc") =>
        updateViewPresentation(activeView?.id ?? "", { sortRules: [{ fieldKey: field.key, direction }] }),
      onRename: (field: TableField, label: string) => renameFieldLabel(field.id, label),
      onMove: (field: TableField, direction: "left" | "right") => moveField("deal", field.key, direction),
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
    ({ field, record }: { field: TableField; record: Deal }) =>
      renderDealFieldCell({ field, deal: record, onCommitCustomValue: handleCommitCustomValue }),
    [handleCommitCustomValue],
  );

  const selectColumn = React.useMemo(() => getDealsSelectColumn(), []);

  const actionsColumn = React.useMemo(
    () =>
      getDealsActionsColumn({
        onEditDeal: (d) => setEditDeal(d),
        onChangeStage: (d) => setChangeStageDeal(d),
        onMarkWon: (d) => setMarkWonDeal(d),
        onMarkLost: (d) => setMarkLostDeal(d),
        onReopenDeal: (d) => setReopenDeal(d),
        onArchiveDeal: (d) => setArchiveTarget(d),
        onRestoreDeal: (d) => setRestoreTarget(d),
        onAssignOwner: (deal, ownerId) => {
          updateDeal(deal.id, { ownerId, updatedAt: new Date().toISOString() });
          toast("Owner updated", { description: `${deal.name} assigned to ${getOwnerName(ownerId)}.` });
        },
      }),
    [updateDeal],
  );

  const handleCreateField = React.useCallback((type: CustomFieldType) => {
    setDialogField(null);
    setDialogInitialType(type);
    setFieldDialogOpen(true);
  }, []);

  const { columns, sorting, columnSizing, handleSortingChange, handleColumnSizingChange } = useCrmTableColumns<Deal>({
    fields,
    activeView,
    resolveValue: resolveDealFieldValue,
    renderHeader,
    renderCell,
    selectColumn,
    actionsColumn,
    onCreateField: handleCreateField,
    updateViewPresentation,
  });

  const isArchivedView = Boolean(activeView?.filterRules.some((rule) => rule.operator === "isArchived")) ?? false;

  const filteredDeals = applyFilters(deals, {
    viewFilterRules: activeView?.filterRules ?? null,
    fields,
    search: searchQuery,
    stage: stageFilter,
    health: healthFilter,
    priority: priorityFilter,
    owner: ownerFilter,
    source: sourceFilter,
    dynamicFilters,
  });

  const table = useReactTable({
    data: filteredDeals,
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
  const totalResults = filteredDeals.length;

  const openDeals = filteredDeals.filter((d) => isOpen(d.stage));
  const openPipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = filteredDeals.filter((d) => d.stage === "Closed Won");
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const overdueDeals = filteredDeals.filter(
    (d) => d.expectedCloseDate && new Date(d.expectedCloseDate).getTime() < today.getTime() && isOpen(d.stage),
  );

  function handleViewChange(viewId: string) {
    setActiveViewId("deal", viewId);
    setSearchQuery("");
    setStageFilter("All");
    setHealthFilter("All");
    setPriorityFilter("All");
    setOwnerFilter("All");
    setSourceFilter("All");
    setDynamicFilters([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setRowSelection({});
  }

  function handleFilterChange(value: string, setter: (v: string) => void) {
    setter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeFilters = [stageFilter, healthFilter, priorityFilter, ownerFilter, sourceFilter].filter(
    (f) => f !== "All",
  );

  function clearAllFilters() {
    setStageFilter("All");
    setHealthFilter("All");
    setPriorityFilter("All");
    setOwnerFilter("All");
    setSourceFilter("All");
    setDynamicFilters([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Deals</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Track your sales pipeline, manage deal progression, and monitor revenue forecasts.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <div className="flex items-center rounded-md border bg-muted/50 p-0.5">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon-sm"
              className="h-6 w-6"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <Columns3Icon className="size-3" />
            </Button>
            <Button
              variant={viewMode === "pipeline" ? "default" : "ghost"}
              size="icon-sm"
              className="h-6 w-6"
              onClick={() => setViewMode("pipeline")}
              aria-label="Pipeline view"
            >
              <LayoutGridIcon className="size-3" />
            </Button>
          </div>
          <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setAddSheetOpen(true)}>
            <PlusIcon className="size-3" />
            Add Deal
          </Button>
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search deals..."
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
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <section className="px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Total Deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{totalResults}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Open Pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">
                  {openPipelineValue > 0 ? `$${(openPipelineValue / 1000).toFixed(0)}k` : "$0"}
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Won Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">
                  {wonValue > 0 ? `$${(wonValue / 1000).toFixed(0)}k` : "$0"}
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Overdue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{overdueDeals.length}</div>
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
              {view.name}
            </Button>
          ))}
          <ViewsMenu entityType="deal" />
          <ManageFieldsTrigger onClick={() => setManageFieldsOpen(true)} />
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4">
          <Select value={stageFilter} onValueChange={(v) => handleFilterChange(v, setStageFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Stage:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All stages</SelectItem>
                {stageOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={healthFilter} onValueChange={(v) => handleFilterChange(v, setHealthFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Health:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All health</SelectItem>
                {healthOptions.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(v) => handleFilterChange(v, setPriorityFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Priority:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All priorities</SelectItem>
                {priorityOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
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
                <SelectItem value="me">My deals</SelectItem>
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

          <Select value={sourceFilter} onValueChange={(v) => handleFilterChange(v, setSourceFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Source:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All sources</SelectItem>
                {sourceOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
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

          {activeFilters.length > 0 || dynamicFilters.length > 0 ? (
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkAssignOwnerOpen(true)}
                title="Assign a new owner to the selected deals"
              >
                Assign Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkChangeStageOpen(true)}
                title="Move the selected deals to a new stage"
              >
                Change Stage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkAddTagOpen(true)}
                title="Add a tag to the selected deals"
              >
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

        {viewMode === "list" ? (
          <>
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
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                            {searchQuery ? `No deals match "${searchQuery}"` : "No deals found."}
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
                    <SelectTrigger size="sm" className="w-20" id="deals-rows-per-page">
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
          </>
        ) : (
          <div className="px-4">
            <DealPipeline
              deals={filteredDeals}
              onChangeStage={(d) => setChangeStageDeal(d)}
              onMarkWon={(d) => setMarkWonDeal(d)}
              onMarkLost={(d) => setMarkLostDeal(d)}
              onEditDeal={(d) => setEditDeal(d)}
            />
          </div>
        )}
      </CardContent>

      <CustomFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        entityType="deal"
        field={dialogField}
        initialType={dialogInitialType}
        hasValues={dialogHasValues}
      />
      <ManageFieldsSheet
        open={manageFieldsOpen}
        onOpenChange={setManageFieldsOpen}
        entityType="deal"
        onEditField={(field) => {
          setDialogField(field);
          setDialogInitialType(field.type);
          setFieldDialogOpen(true);
        }}
      />

      <DealForm open={addSheetOpen} onOpenChange={setAddSheetOpen} />
      <DealForm
        open={Boolean(editDeal)}
        onOpenChange={(open) => {
          if (!open) setEditDeal(null);
        }}
        deal={editDeal ?? undefined}
      />
      {changeStageDeal && (
        <ChangeStageDialog
          deal={changeStageDeal}
          open
          onOpenChange={(open) => {
            if (!open) setChangeStageDeal(null);
          }}
        />
      )}
      {markWonDeal && (
        <MarkWonDialog
          deal={markWonDeal}
          open
          onOpenChange={(open) => {
            if (!open) setMarkWonDeal(null);
          }}
        />
      )}
      {markLostDeal && (
        <MarkLostDialog
          deal={markLostDeal}
          open
          onOpenChange={(open) => {
            if (!open) setMarkLostDeal(null);
          }}
        />
      )}
      {reopenDeal && (
        <ReopenDealDialog
          deal={reopenDeal}
          open
          onOpenChange={(open) => {
            if (!open) setReopenDeal(null);
          }}
        />
      )}
      <DealArchiveRestoreDialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        mode="archive"
        count={1}
        dealName={archiveTarget?.name}
        onConfirm={() => {
          if (archiveTarget) {
            archiveDeal(archiveTarget.id, currentSalesOwnerId);
            toast("Deal archived", { description: `${archiveTarget.name} has been archived.` });
          }
          setArchiveTarget(null);
        }}
      />
      <DealArchiveRestoreDialog
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        mode="restore"
        count={1}
        dealName={restoreTarget?.name}
        onConfirm={() => {
          if (restoreTarget) {
            restoreDeal(restoreTarget.id);
            toast("Deal restored", { description: `${restoreTarget.name} has been restored.` });
          }
          setRestoreTarget(null);
        }}
      />
      <DealArchiveRestoreDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        mode="archive"
        count={selectedCount}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkArchiveDeals(ids, currentSalesOwnerId);
          setRowSelection({});
          toast("Deals archived", { description: `${ids.length} deal(s) have been archived.` });
        }}
      />
      <DealArchiveRestoreDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        mode="restore"
        count={selectedCount}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkRestoreDeals(ids);
          setRowSelection({});
          toast("Deals restored", { description: `${ids.length} deal(s) have been restored.` });
        }}
      />
      <BulkAssignOwnerDialog
        open={bulkAssignOwnerOpen}
        onOpenChange={setBulkAssignOwnerOpen}
        count={selectedCount}
        onConfirm={(ownerId) => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkAssignOwner(ids, ownerId);
          setRowSelection({});
          toast("Owner updated", { description: `${ids.length} deal(s) assigned to ${getOwnerName(ownerId)}.` });
        }}
      />
      <BulkChangeStageDialog
        open={bulkChangeStageOpen}
        onOpenChange={setBulkChangeStageOpen}
        count={selectedCount}
        onConfirm={(stage, probability) => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkChangeStage(ids, stage, probability);
          setRowSelection({});
          toast("Stage updated", {
            description: `${ids.length} deal(s) moved to ${stage} (${probability}%).`,
          });
        }}
      />
      <BulkAddTagDialog
        open={bulkAddTagOpen}
        onOpenChange={setBulkAddTagOpen}
        count={selectedCount}
        onConfirm={(tag) => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkAddTag(ids, tag);
          setRowSelection({});
          toast("Tag added", { description: `"${tag}" added to ${ids.length} deal(s).` });
        }}
      />
    </Card>
  );
}
