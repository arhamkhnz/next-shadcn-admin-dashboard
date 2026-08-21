"use client";
"use no memo";

import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { differenceInCalendarDays, parseISO, startOfQuarter, startOfYear, subDays } from "date-fns";
import { Search, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import { currentSalesOwnerId, getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
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

import { ArchiveRestoreDialog } from "./archive-restore-dialog";
import { LeadForm } from "./lead-form";
import { getFollowUpState, getLeadsColumns, getScoreClassification } from "./leads-columns";
import { sourceOptions, statusOptions } from "./leads-data/data";
import type { Lead } from "./leads-data/schema";
import { useLeadStore } from "./leads-data/use-lead-store";

const today = new Date(2026, 7, 16);

const savedViews = [
  { id: "all", label: "All Leads" },
  { id: "mine", label: "My Leads" },
  { id: "new", label: "New" },
  { id: "unassigned", label: "Unassigned" },
  { id: "hot", label: "Hot Leads" },
  { id: "followup", label: "Needs Follow-up" },
  { id: "archived", label: "Archived" },
] as const;

const createdDateOptions = ["All", "Today", "This Week", "This Month", "This Quarter", "This Year", "Older"] as const;

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

function applyFilters(params: {
  leads: Lead[];
  view: string;
  search: string;
  status: string;
  source: string;
  owner: string;
  score: string;
  created: string;
  followUp: string;
}) {
  let result = [...params.leads];

  const isArchivedView = params.view === "archived";

  if (isArchivedView) {
    result = result.filter((l) => Boolean(l.archivedAt));
  } else {
    result = result.filter((l) => !l.archivedAt);
  }

  switch (params.view) {
    case "mine":
      result = result.filter((l) => l.ownerId === "arham");
      break;
    case "new":
      result = result.filter((l) => l.status === "New");
      break;
    case "unassigned":
      result = result.filter((l) => l.ownerId === null);
      break;
    case "hot":
      result = result.filter((l) => l.score >= 75);
      break;
    case "followup": {
      result = result.filter((l) => {
        const state = getFollowUpState(l.nextActivity);
        return state === "Overdue" || state === "Due Today";
      });
      break;
    }
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q),
    );
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
  const leads = useLeadStore((s) => s.leads);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeView, setActiveView] = React.useState("all");
  const isArchivedView = activeView === "archived";
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [sourceFilter, setSourceFilter] = React.useState<string>("All");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("All");
  const [scoreFilter, setScoreFilter] = React.useState<string>("All");
  const [createdFilter, setCreatedFilter] = React.useState<string>("All");
  const [followUpFilter, setFollowUpFilter] = React.useState<string>("All");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    search: false,
    email: true,
    ownerId: true,
    createdAt: false,
  });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const [editLead, setEditLead] = React.useState<Lead | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Lead | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<Lead | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = React.useState(false);
  const [bulkRestoreOpen, setBulkRestoreOpen] = React.useState(false);

  const archiveLead = useLeadStore((s) => s.archiveLead);
  const restoreLead = useLeadStore((s) => s.restoreLead);
  const bulkArchiveLeads = useLeadStore((s) => s.bulkArchiveLeads);
  const bulkRestoreLeads = useLeadStore((s) => s.bulkRestoreLeads);

  const columns = React.useMemo(
    () =>
      getLeadsColumns({
        onEditLead: (lead) => setEditLead(lead),
        onArchiveLead: (lead) => setArchiveTarget(lead),
        onRestoreLead: (lead) => setRestoreTarget(lead),
      }),
    [],
  );

  const filteredLeads = applyFilters({
    leads,
    view: activeView,
    search: searchQuery,
    status: statusFilter,
    source: sourceFilter,
    owner: ownerFilter,
    score: scoreFilter,
    created: createdFilter,
    followUp: followUpFilter,
  });

  const table = useReactTable({
    data: filteredLeads,
    columns,
    state: { rowSelection, sorting, columnVisibility, pagination },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
  });

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const rowsPerPage = `${table.getState().pagination.pageSize}`;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalResults = filteredLeads.length;

  function handleViewChange(viewId: string) {
    setActiveView(viewId);
    setSearchQuery("");
    setStatusFilter("All");
    setSourceFilter("All");
    setOwnerFilter("All");
    setScoreFilter("All");
    setCreatedFilter("All");
    setFollowUpFilter("All");
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
        <CardTitle className="text-xl leading-none">Leads</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Manage prospects, prioritize follow-ups, and move qualified leads into the sales pipeline.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search leads..."
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
              Add Lead
            </Button>
          ) : null}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <section className="px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Active Leads</CardDescription>
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
          {savedViews.map((view) => (
            <Button
              key={view.id}
              variant={activeView === view.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleViewChange(view.id)}
            >
              {view.label}
            </Button>
          ))}
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
            <TableHeader className="[&_tr]:border-t">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-4 font-normal">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                        {searchQuery ? `No leads match "${searchQuery}"` : "No leads found."}
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
      <ArchiveRestoreDialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        mode="archive"
        count={1}
        onConfirm={() => {
          if (archiveTarget) {
            archiveLead(archiveTarget.id, currentSalesOwnerId);
            toast("Lead archived", { description: `${archiveTarget.name} has been archived.` });
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
        onConfirm={() => {
          if (restoreTarget) {
            restoreLead(restoreTarget.id);
            toast("Lead restored", { description: `${restoreTarget.name} has been restored.` });
          }
          setRestoreTarget(null);
        }}
      />
      <ArchiveRestoreDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        mode="archive"
        count={selectedCount}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkArchiveLeads(ids, currentSalesOwnerId);
          setRowSelection({});
          toast("Leads archived", { description: `${ids.length} lead(s) have been archived.` });
        }}
      />
      <ArchiveRestoreDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        mode="restore"
        count={selectedCount}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkRestoreLeads(ids);
          setRowSelection({});
          toast("Leads restored", { description: `${ids.length} lead(s) have been restored.` });
        }}
      />
    </Card>
  );
}
