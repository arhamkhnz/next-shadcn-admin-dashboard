"use client";
"use no memo";

import * as React from "react";

import { useRouter } from "next/navigation";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CalendarPlus, Search, Settings2, X } from "lucide-react";
import { toast } from "sonner";

import {
  activityPriorityOptions,
  activityRelatedRecordTypeOptions,
  activityStatusOptions,
  activityTypeOptions,
  buildSearchHaystack,
  getScheduleState,
  isCompletedThisMonth,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
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

import { ActivityForm } from "../../_components/activities/activity-form";
import type { Activity } from "../../_components/activities/activity-schema";
import {
  CancelActivityDialog,
  CompleteActivityDialog,
  RescheduleActivityDialog,
} from "../../_components/activities/activity-workflows";
import { resolveActivityFieldValue } from "../../_components/activities/custom-value-resolvers";
import { useActivityStore } from "../../_components/activities/use-activity-store";
import { getActivitiesActionsColumn, renderActivityFieldCell } from "./activities-columns";

const today = new Date(2026, 7, 16);
const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

const scheduledDateOptions = ["All", "Overdue", "Today", "Tomorrow", "This Week", "This Month"] as const;

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
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

function applyFilters(params: {
  activities: Activity[];
  viewFilterRules: FilterRule[] | null;
  fields: TableField[];
  search: string;
  type: string;
  status: string;
  owner: string;
  relatedType: string;
  scheduledDate: string;
  priority: string;
  dynamicFilters: ActiveDynamicFilter[];
}) {
  let result = [...params.activities];

  if (params.viewFilterRules) {
    result = result.filter((a) =>
      matchesViewFilters(a, params.viewFilterRules ?? [], resolveActivityFieldValue, currentSalesOwnerId),
    );
  }

  for (const dynamicFilter of params.dynamicFilters) {
    const value = dynamicFilter.value;
    result = result.filter((a) => {
      const resolved = resolveActivityFieldValue(a, dynamicFilter.fieldKey);
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
    const q = params.search.trim().toLowerCase();
    const customFields = params.fields.filter((f) => !f.isCore);
    result = result.filter(
      (a) => buildSearchHaystack(a).includes(q) || recordMatchesSearch(a, q, customFields, resolveActivityFieldValue),
    );
  }

  if (params.type !== "All") {
    result = result.filter((a) => a.type === params.type);
  }

  if (params.status !== "All") {
    result = result.filter((a) => a.status === params.status);
  }

  if (params.owner !== "All") {
    if (params.owner === "me") {
      result = result.filter((a) => a.ownerId === currentSalesOwnerId);
    } else if (params.owner === "null") {
      result = result.filter((a) => a.ownerId === null);
    } else {
      result = result.filter((a) => a.ownerId === params.owner);
    }
  }

  if (params.relatedType !== "All") {
    result = result.filter((a) => {
      switch (params.relatedType) {
        case "Lead":
          return Boolean(a.leadId);
        case "Contact":
          return Boolean(a.contactId);
        case "Company":
          return Boolean(a.companyId);
        default:
          return Boolean(a.dealId);
      }
    });
  }

  if (params.scheduledDate !== "All") {
    result = result.filter((a) => {
      const scheduled = new Date(a.scheduledAt);
      const time = scheduled.getTime();
      switch (params.scheduledDate) {
        case "Overdue":
          return time < startOfToday.getTime();
        case "Today":
          return time >= startOfToday.getTime() && time <= endOfToday.getTime();
        case "Tomorrow": {
          const start = new Date(startOfToday);
          start.setDate(start.getDate() + 1);
          const end = new Date(endOfToday);
          end.setDate(end.getDate() + 1);
          return time >= start.getTime() && time <= end.getTime();
        }
        case "This Week": {
          const weekEnd = new Date(endOfToday);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return time >= startOfToday.getTime() && time <= weekEnd.getTime();
        }
        case "This Month":
          return scheduled.getMonth() === today.getMonth() && scheduled.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  }

  if (params.priority !== "All") {
    result = result.filter((a) => a.priority === params.priority);
  }

  return result;
}

export function Activities() {
  const router = useRouter();
  const activities = useActivityStore((s) => s.activities);
  const setActivityCustomFieldValue = useActivityStore((s) => s.setActivityCustomFieldValue);

  const fields = useEntityTableFields("activity");
  const allViews = useCrmConfigStore((s) => s.views);
  const activeViewId = useCrmConfigStore((s) => s.activeViewIds.activity);
  const entityViews = React.useMemo(() => selectEntityViews(allViews, "activity"), [allViews]);
  const activeView = React.useMemo(
    () => selectActiveView(allViews, "activity", activeViewId),
    [allViews, activeViewId],
  );
  const setActiveViewId = useCrmConfigStore((s) => s.setActiveView);
  const updateViewPresentation = useCrmConfigStore((s) => s.updateViewPresentation);
  const moveField = useCrmConfigStore((s) => s.moveField);
  const renameFieldLabel = useCrmConfigStore((s) => s.renameFieldLabel);
  const restoreFieldDefaultLabel = useCrmConfigStore((s) => s.restoreFieldDefaultLabel);
  const archiveConfigField = useCrmConfigStore((s) => s.archiveField);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [ownerFilter, setOwnerFilter] = React.useState("All");
  const [relatedTypeFilter, setRelatedTypeFilter] = React.useState("All");
  const [scheduledDateFilter, setScheduledDateFilter] = React.useState("All");
  const [priorityFilter, setPriorityFilter] = React.useState("All");
  const [dynamicFilters, setDynamicFilters] = React.useState<ActiveDynamicFilter[]>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const [editActivity, setEditActivity] = React.useState<Activity | null>(null);
  const [completeTarget, setCompleteTarget] = React.useState<Activity | null>(null);
  const [cancelTarget, setCancelTarget] = React.useState<Activity | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = React.useState<Activity | null>(null);
  const [manageFieldsOpen, setManageFieldsOpen] = React.useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = React.useState(false);
  const [dialogField, setDialogField] = React.useState<TableField | null>(null);
  const [dialogInitialType, setDialogInitialType] = React.useState<CustomFieldType>("text");

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
        ? fieldHasValues({
            records: activities ?? [],
            fieldKey: dialogField.key,
            resolveValue: resolveActivityFieldValue,
          })
        : false,
    [dialogField, activities],
  );

  const handleCommitCustomValue = React.useCallback(
    (activity: Activity, field: TableField, value: NonNullable<Activity["customFields"]>[string]) => {
      setActivityCustomFieldValue(activity.id, field.systemName, value);
    },
    [setActivityCustomFieldValue],
  );

  const columnHeaderActions = React.useMemo(() => {
    return {
      onSort: (field: TableField, direction: "asc" | "desc") =>
        updateViewPresentation(activeView?.id ?? "", { sortRules: [{ fieldKey: field.key, direction }] }),
      onRename: (field: TableField, label: string) => renameFieldLabel(field.id, label),
      onMove: (field: TableField, direction: "left" | "right") => moveField("activity", field.key, direction),
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
    ({ field, record }: { field: TableField; record: Activity }) =>
      renderActivityFieldCell({ field, activity: record, onCommitCustomValue: handleCommitCustomValue }),
    [handleCommitCustomValue],
  );

  const actionsColumn = React.useMemo(
    () =>
      getActivitiesActionsColumn({
        onView: (activity) => router.push(`/dashboard/crm/activities/${activity.id}`),
        onEditActivity: (activity) => setEditActivity(activity),
        onCompleteActivity: (activity) => setCompleteTarget(activity),
        onCancelActivity: (activity) => setCancelTarget(activity),
        onRescheduleActivity: (activity) => setRescheduleTarget(activity),
      }),
    [router],
  );

  const handleCreateField = React.useCallback((type: CustomFieldType) => {
    setDialogField(null);
    setDialogInitialType(type);
    setFieldDialogOpen(true);
  }, []);

  const { columns, sorting, columnSizing, handleSortingChange, handleColumnSizingChange } =
    useCrmTableColumns<Activity>({
      fields,
      activeView,
      resolveValue: resolveActivityFieldValue,
      renderHeader,
      renderCell,
      actionsColumn,
      onCreateField: handleCreateField,
      updateViewPresentation,
    });

  const filteredActivities = applyFilters({
    activities,
    viewFilterRules: activeView?.filterRules ?? null,
    fields,
    search: searchQuery,
    type: typeFilter,
    status: statusFilter,
    owner: ownerFilter,
    relatedType: relatedTypeFilter,
    scheduledDate: scheduledDateFilter,
    priority: priorityFilter,
    dynamicFilters,
  });

  const table = useReactTable({
    data: filteredActivities,
    columns,
    state: { sorting, columnSizing, pagination },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    onColumnSizingChange: handleColumnSizingChange,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
  });

  useCommitResizedColumnWidths({ table, fields, activeView, updateViewPresentation });

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const rowsPerPage = `${table.getState().pagination.pageSize}`;
  const totalResults = filteredActivities.length;

  const upcomingCount = activities.filter(
    (a) => a.status === "Scheduled" && new Date(a.scheduledAt).getTime() > endOfToday.getTime(),
  ).length;
  const dueTodayCount = activities.filter((a) => getScheduleState(a, today) === "Due Today").length;
  const overdueCount = activities.filter((a) => getScheduleState(a, today) === "Overdue").length;
  const completedThisMonthCount = activities.filter((a) => isCompletedThisMonth(a, today)).length;

  function handleViewChange(viewId: string) {
    setActiveViewId("activity", viewId);
    setSearchQuery("");
    setTypeFilter("All");
    setStatusFilter("All");
    setOwnerFilter("All");
    setRelatedTypeFilter("All");
    setScheduledDateFilter("All");
    setPriorityFilter("All");
    setDynamicFilters([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleFilterChange(value: string, setter: (v: string) => void) {
    setter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeFilters = [
    typeFilter,
    statusFilter,
    ownerFilter,
    relatedTypeFilter,
    scheduledDateFilter,
    priorityFilter,
  ].filter((f) => f !== "All");

  function clearAllFilters() {
    setTypeFilter("All");
    setStatusFilter("All");
    setOwnerFilter("All");
    setRelatedTypeFilter("All");
    setScheduledDateFilter("All");
    setPriorityFilter("All");
    setDynamicFilters([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Activities</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Plan, track, and review every call, meeting, email, task, and note across your pipeline.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search activities..."
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
          <Button variant="outline" size="sm" onClick={() => setAddSheetOpen(true)}>
            <CalendarPlus data-icon="inline-start" />
            Add Activity
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <section className="px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Upcoming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{upcomingCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Due Today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{dueTodayCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Overdue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{overdueCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Completed This Month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{completedThisMonthCount}</div>
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
          <ViewsMenu entityType="activity" />
          <ManageFieldsTrigger onClick={() => setManageFieldsOpen(true)} />
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4">
          <Select value={typeFilter} onValueChange={(v) => handleFilterChange(v, setTypeFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Type:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All types</SelectItem>
                {activityTypeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => handleFilterChange(v, setStatusFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All statuses</SelectItem>
                {activityStatusOptions.map((s) => (
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
                <SelectItem value="me">My activities</SelectItem>
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

          <Select value={relatedTypeFilter} onValueChange={(v) => handleFilterChange(v, setRelatedTypeFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Related:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All records</SelectItem>
                {activityRelatedRecordTypeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={scheduledDateFilter} onValueChange={(v) => handleFilterChange(v, setScheduledDateFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Scheduled:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                {scheduledDateOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
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
                {activityPriorityOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
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
                  <TableRow key={row.id} className="border-border/60 hover:bg-white/2.5">
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
                        {searchQuery ? `No activities match "${searchQuery}"` : "No activities found."}
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
                <SelectTrigger size="sm" className="w-20" id="activities-rows-per-page">
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
              {totalResults === 0
                ? 0
                : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              -
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

      <CustomFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        entityType="activity"
        field={dialogField}
        initialType={dialogInitialType}
        hasValues={dialogHasValues}
      />
      <ManageFieldsSheet
        open={manageFieldsOpen}
        onOpenChange={setManageFieldsOpen}
        entityType="activity"
        onEditField={(field) => {
          setDialogField(field);
          setDialogInitialType(field.type);
          setFieldDialogOpen(true);
        }}
      />

      <ActivityForm open={addSheetOpen} onOpenChange={setAddSheetOpen} />
      <ActivityForm
        open={Boolean(editActivity)}
        onOpenChange={(open) => {
          if (!open) setEditActivity(null);
        }}
        activity={editActivity ?? undefined}
      />
      <CompleteActivityDialog
        activity={completeTarget}
        open={Boolean(completeTarget)}
        onOpenChange={(open) => {
          if (!open) setCompleteTarget(null);
        }}
      />
      <CancelActivityDialog
        activity={cancelTarget}
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
      />
      {rescheduleTarget ? (
        <RescheduleActivityDialog
          activity={rescheduleTarget}
          open={Boolean(rescheduleTarget)}
          onOpenChange={(open) => {
            if (!open) setRescheduleTarget(null);
          }}
        />
      ) : null}
    </Card>
  );
}
