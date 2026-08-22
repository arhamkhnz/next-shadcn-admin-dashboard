"use client";
"use no memo";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { ListPlus, ListX, Search, Settings2, SquareCheckBig, Table2, X } from "lucide-react";
import { toast } from "sonner";

import type {
  Activity,
  ActivityPriority,
  ActivityStatus,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import {
  activityPriorityOptions,
  activityRelatedRecordTypeOptions,
  buildSearchHaystack,
  taskStatusOptions,
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
  fieldHasValues,
  type TableField,
} from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

import { ActivityForm } from "../../crm/_components/activities/activity-form";
import {
  CancelActivityDialog,
  CompleteActivityDialog,
  ReopenTaskDialog,
  RescheduleActivityDialog,
} from "../../crm/_components/activities/activity-workflows";
import { resolveTaskFieldValue } from "../../crm/_components/activities/custom-value-resolvers";
import { useActivityStore } from "../../crm/_components/activities/use-activity-store";
import { TaskBoard } from "./task-board";
import {
  TaskBulkAssignOwnerDialog,
  TaskBulkCancelDialog,
  TaskBulkCompleteDialog,
  TaskBulkRescheduleDialog,
  TaskBulkSetPriorityDialog,
  TaskBulkSetStatusDialog,
} from "./task-bulk-dialogs";
import { getTasksActionsColumn, getTasksSelectColumn, renderTaskFieldCell } from "./task-columns";
import { TaskSummaryCards } from "./task-summary-cards";
import { applyTaskFilters, computeTaskSummary, selectTasks, taskDueDateOptions } from "./task-utils";

type BulkAction = "assign-owner" | "priority" | "status" | "reschedule" | "complete" | "cancel" | null;

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
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

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

export function TasksView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activities = useActivityStore((s) => s.activities);
  const setActivityCustomFieldValue = useActivityStore((s) => s.setActivityCustomFieldValue);
  const tasks = React.useMemo(() => selectTasks(activities), [activities]);

  const initialViewParam = searchParams.get("view");

  const fields = useEntityTableFields("task");
  const allViews = useCrmConfigStore((s) => s.views);
  const activeViewId = useCrmConfigStore((s) => s.activeViewIds.task);
  const entityViews = React.useMemo(() => selectEntityViews(allViews, "task"), [allViews]);
  const activeView = React.useMemo(() => selectActiveView(allViews, "task", activeViewId), [allViews, activeViewId]);
  const setActiveViewId = useCrmConfigStore((s) => s.setActiveView);
  const updateViewPresentation = useCrmConfigStore((s) => s.updateViewPresentation);
  const moveField = useCrmConfigStore((s) => s.moveField);
  const renameFieldLabel = useCrmConfigStore((s) => s.renameFieldLabel);
  const restoreFieldDefaultLabel = useCrmConfigStore((s) => s.restoreFieldDefaultLabel);
  const archiveConfigField = useCrmConfigStore((s) => s.archiveField);

  const startActivity = useActivityStore((s) => s.startActivity);
  const setTaskStatus = useActivityStore((s) => s.setTaskStatus);
  const bulkAssignOwner = useActivityStore((s) => s.bulkAssignOwner);
  const bulkSetPriority = useActivityStore((s) => s.bulkSetPriority);
  const bulkReschedule = useActivityStore((s) => s.bulkReschedule);
  const bulkComplete = useActivityStore((s) => s.bulkComplete);
  const bulkCancel = useActivityStore((s) => s.bulkCancel);

  const [layout, setLayout] = React.useState<"list" | "board">("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dynamicFilters, setDynamicFilters] = React.useState<ActiveDynamicFilter[]>([]);
  const [manageFieldsOpen, setManageFieldsOpen] = React.useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = React.useState(false);
  const [dialogField, setDialogField] = React.useState<TableField | null>(null);
  const [dialogInitialType, setDialogInitialType] = React.useState<CustomFieldType>("text");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [priorityFilter, setPriorityFilter] = React.useState("All");
  const [ownerFilter, setOwnerFilter] = React.useState("All");
  const [relatedTypeFilter, setRelatedTypeFilter] = React.useState("All");
  const [dueDateFilter, setDueDateFilter] = React.useState("All");
  const [completionStateFilter, setCompletionStateFilter] = React.useState("All");
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Activity | null>(null);
  const [completeTarget, setCompleteTarget] = React.useState<Activity | null>(null);
  const [cancelTarget, setCancelTarget] = React.useState<Activity | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = React.useState<Activity | null>(null);
  const [reopenTarget, setReopenTarget] = React.useState<Activity | null>(null);
  const [bulkAction, setBulkAction] = React.useState<BulkAction>(null);

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
        ? fieldHasValues({ records: tasks ?? [], fieldKey: dialogField.key, resolveValue: resolveTaskFieldValue })
        : false,
    [dialogField, tasks],
  );

  const handleCommitCustomValue = React.useCallback(
    (task: Activity, field: TableField, value: NonNullable<Activity["customFields"]>[string]) => {
      setActivityCustomFieldValue(task.id, field.systemName, value);
    },
    [setActivityCustomFieldValue],
  );

  const columnHeaderActions = React.useMemo(() => {
    return {
      onSort: (field: TableField, direction: "asc" | "desc") =>
        updateViewPresentation(activeView?.id ?? "", { sortRules: [{ fieldKey: field.key, direction }] }),
      onRename: (field: TableField, label: string) => renameFieldLabel(field.id, label),
      onMove: (field: TableField, direction: "left" | "right") => moveField("task", field.key, direction),
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
      renderTaskFieldCell({ field, task: record, onCommitCustomValue: handleCommitCustomValue }),
    [handleCommitCustomValue],
  );

  const selectColumn = React.useMemo(() => getTasksSelectColumn(), []);

  const actionsColumn = React.useMemo(
    () =>
      getTasksActionsColumn({
        onView: (task) => router.push(`/dashboard/crm/tasks/${task.id}`),
        onEditTask: (task) => setEditTask(task),
        onStartTask: (task) => {
          const started = startActivity(task.id);
          if (started) {
            toast("Task started", { description: `"${task.title}" is now In Progress.` });
          } else {
            toast("Task cannot be started", { description: `"${task.title}" is not in To Do.` });
          }
        },
        onCompleteTask: (task) => setCompleteTarget(task),
        onReopenTask: (task) => setReopenTarget(task),
        onRescheduleTask: (task) => setRescheduleTarget(task),
        onCancelTask: (task) => setCancelTarget(task),
      }),
    [router, startActivity],
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
      resolveValue: resolveTaskFieldValue,
      renderHeader,
      renderCell,
      selectColumn,
      actionsColumn,
      onCreateField: handleCreateField,
      updateViewPresentation,
    });

  const viewFilteredTasks = React.useMemo(() => {
    if (!activeView?.filterRules) return tasks;
    return tasks.filter((t) =>
      matchesViewFilters(t, activeView.filterRules ?? [], resolveTaskFieldValue, currentSalesOwnerId),
    );
  }, [tasks, activeView]);

  React.useEffect(() => {
    if (!initialViewParam) return;
    const mappedId = `view-task-${initialViewParam}`;
    if (entityViews.some((v) => v.id === mappedId)) {
      setActiveViewId("task", mappedId);
    }
  }, [entityViews, initialViewParam, setActiveViewId]);

  const searchedTasks = React.useMemo(() => {
    if (!searchQuery.trim()) return viewFilteredTasks;
    const q = searchQuery.trim().toLowerCase();
    const customFields = fields.filter((f) => !f.isCore);
    return viewFilteredTasks.filter(
      (t) => buildSearchHaystack(t).includes(q) || recordMatchesSearch(t, q, customFields, resolveTaskFieldValue),
    );
  }, [viewFilteredTasks, searchQuery, fields]);

  const filteredTasks = applyTaskFilters({
    tasks: searchedTasks,
    view: "all",
    search: "",
    status: statusFilter,
    priority: priorityFilter,
    owner: ownerFilter,
    relatedType: relatedTypeFilter,
    dueDate: dueDateFilter,
    completionState: completionStateFilter,
  });

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: { sorting, columnSizing, pagination, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    onColumnSizingChange: handleColumnSizingChange,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
    columnResizeMode: "onChange",
  });

  useCommitResizedColumnWidths({ table, fields, activeView, updateViewPresentation });

  const boardTasks = React.useMemo(() => filteredTasks.filter((t) => t.status !== "Canceled"), [filteredTasks]);

  const summary = computeTaskSummary(tasks);
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const rowsPerPage = `${table.getState().pagination.pageSize}`;
  const totalResults = filteredTasks.length;

  function handleViewChange(viewId: string) {
    setActiveViewId("task", viewId);
    setSearchQuery("");
    setDynamicFilters([]);
    setStatusFilter("All");
    setPriorityFilter("All");
    setOwnerFilter("All");
    setRelatedTypeFilter("All");
    setDueDateFilter("All");
    setCompletionStateFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleFilterChange(value: string, setter: (v: string) => void) {
    setter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeFilters = [
    statusFilter,
    priorityFilter,
    ownerFilter,
    relatedTypeFilter,
    dueDateFilter,
    completionStateFilter,
  ].filter((f) => f !== "All");

  function clearAllFilters() {
    setStatusFilter("All");
    setPriorityFilter("All");
    setOwnerFilter("All");
    setRelatedTypeFilter("All");
    setDueDateFilter("All");
    setCompletionStateFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleBulkAssignOwner(ownerId: string) {
    bulkAssignOwner(
      selectedRows.map((r) => r.original.id),
      ownerId,
    );
    toast("Owner assigned", {
      description: `${selectedCount} task${selectedCount === 1 ? "" : "s"} assigned to ${getOwnerName(ownerId)}.`,
    });
    table.toggleAllPageRowsSelected(false);
  }

  function handleBulkPriority(priority: ActivityPriority) {
    bulkSetPriority(
      selectedRows.map((r) => r.original.id),
      priority,
    );
    toast("Priority updated", {
      description: `${selectedCount} task${selectedCount === 1 ? "" : "s"} set to ${priority}.`,
    });
    table.toggleAllPageRowsSelected(false);
  }

  function handleBulkStatus(status: ActivityStatus) {
    let moved = 0;
    for (const row of selectedRows) {
      if (setTaskStatus(row.original.id, status)) moved += 1;
    }
    toast("Status updated", { description: `${moved} task${moved === 1 ? "" : "s"} moved to ${status}.` });
    table.toggleAllPageRowsSelected(false);
  }

  function handleBulkReschedule(dueAt: string) {
    bulkReschedule(
      selectedRows.map((r) => r.original.id),
      dueAt,
    );
    toast("Tasks rescheduled", {
      description: `${selectedCount} task${selectedCount === 1 ? "" : "s"} moved to the new due date.`,
    });
    table.toggleAllPageRowsSelected(false);
  }

  function handleBulkComplete(outcome: string) {
    bulkComplete(
      selectedRows.map((r) => r.original.id),
      { outcome },
    );
    toast("Tasks completed", {
      description: `${selectedCount} task${selectedCount === 1 ? "" : "s"} marked as completed.`,
    });
    table.toggleAllPageRowsSelected(false);
  }

  function handleBulkCancel(reason?: string) {
    bulkCancel(
      selectedRows.map((r) => r.original.id),
      reason,
    );
    toast("Tasks canceled", {
      description: `${selectedCount} task${selectedCount === 1 ? "" : "s"} marked as canceled.`,
    });
    table.toggleAllPageRowsSelected(false);
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Tasks</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Track every follow-up across leads, contacts, companies, and deals — plan it, work it, and close it out.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search tasks..."
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
            <ListPlus data-icon="inline-start" />
            Add Task
          </Button>
          <Select value={layout} onValueChange={(v) => setLayout(v as "list" | "board")}>
            <SelectTrigger size="sm" className="w-[6.5rem]" aria-label="Switch layout">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                <SelectItem value="list">
                  <span className="flex items-center gap-2">
                    <Table2 className="size-3.5" />
                    List
                  </span>
                </SelectItem>
                <SelectItem value="board">
                  <span className="flex items-center gap-2">
                    <SquareCheckBig className="size-3.5" />
                    Board
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <TaskSummaryCards summary={summary} />

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
          <ViewsMenu entityType="task" />
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setManageFieldsOpen(true)}>
            <Settings2 className="size-3.5" />
            Manage Fields
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4">
          <Select value={statusFilter} onValueChange={(v) => handleFilterChange(v, setStatusFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All statuses</SelectItem>
                {taskStatusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
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

          <Select value={ownerFilter} onValueChange={(v) => handleFilterChange(v, setOwnerFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Owner:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All owners</SelectItem>
                <SelectItem value="me">My tasks</SelectItem>
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

          <Select value={dueDateFilter} onValueChange={(v) => handleFilterChange(v, setDueDateFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Due:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                {taskDueDateOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={completionStateFilter} onValueChange={(v) => handleFilterChange(v, setCompletionStateFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Completion:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All states</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
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

        {selectedCount > 0 && layout === "list" ? (
          <div className="mx-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
            <span className="font-medium text-sm tabular-nums">{selectedCount} selected</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" className="h-7 text-xs" variant="outline" onClick={() => setBulkAction("assign-owner")}>
                Assign Owner
              </Button>
              <Button size="sm" className="h-7 text-xs" variant="outline" onClick={() => setBulkAction("priority")}>
                Change Priority
              </Button>
              <Button size="sm" className="h-7 text-xs" variant="outline" onClick={() => setBulkAction("status")}>
                Change Status
              </Button>
              <Button size="sm" className="h-7 text-xs" variant="outline" onClick={() => setBulkAction("reschedule")}>
                Reschedule
              </Button>
              <Button size="sm" className="h-7 text-xs" variant="outline" onClick={() => setBulkAction("complete")}>
                Complete
              </Button>
              <Button size="sm" className="h-7 text-xs" variant="destructive" onClick={() => setBulkAction("cancel")}>
                Cancel Tasks
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs"
                variant="ghost"
                onClick={() => table.toggleAllPageRowsSelected(false)}
              >
                <ListX className="size-3.5" />
                Clear Selection
              </Button>
            </div>
          </div>
        ) : null}

        {layout === "list" ? (
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
                        data-state={row.getIsSelected() && "selected"}
                        className="border-border/60 hover:bg-white/2.5"
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
                            {searchQuery ? `No tasks match "${searchQuery}"` : "No tasks found."}
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
                    <SelectTrigger size="sm" className="w-20" id="tasks-rows-per-page">
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
          </>
        ) : (
          <div className="px-4">
            <TaskBoard tasks={boardTasks} onCompleteTask={(task) => setCompleteTarget(task)} />
          </div>
        )}
      </CardContent>

      <CustomFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        entityType="task"
        field={dialogField}
        initialType={dialogInitialType}
        hasValues={dialogHasValues}
      />
      <ManageFieldsSheet
        open={manageFieldsOpen}
        onOpenChange={setManageFieldsOpen}
        entityType="task"
        onEditField={(field) => {
          setDialogField(field);
          setDialogInitialType(field.type);
          setFieldDialogOpen(true);
        }}
      />

      <ActivityForm open={addSheetOpen} onOpenChange={setAddSheetOpen} defaultType="Task" lockType />
      <ActivityForm
        open={Boolean(editTask)}
        onOpenChange={(open) => {
          if (!open) setEditTask(null);
        }}
        activity={editTask ?? undefined}
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
      {reopenTarget ? (
        <ReopenTaskDialog
          activity={reopenTarget}
          open={Boolean(reopenTarget)}
          onOpenChange={(open) => {
            if (!open) setReopenTarget(null);
          }}
        />
      ) : null}

      <TaskBulkAssignOwnerDialog
        open={bulkAction === "assign-owner"}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        count={selectedCount}
        onConfirm={handleBulkAssignOwner}
      />
      <TaskBulkSetPriorityDialog
        open={bulkAction === "priority"}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        count={selectedCount}
        onConfirm={handleBulkPriority}
      />
      <TaskBulkSetStatusDialog
        open={bulkAction === "status"}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        count={selectedCount}
        onConfirm={handleBulkStatus}
      />
      <TaskBulkRescheduleDialog
        open={bulkAction === "reschedule"}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        count={selectedCount}
        onConfirm={handleBulkReschedule}
      />
      <TaskBulkCompleteDialog
        open={bulkAction === "complete"}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        count={selectedCount}
        onConfirm={handleBulkComplete}
      />
      <TaskBulkCancelDialog
        open={bulkAction === "cancel"}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
        count={selectedCount}
        onConfirm={handleBulkCancel}
      />
    </Card>
  );
}
