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

import { ContactArchiveRestoreDialog } from "./contact-archive-restore-dialog";
import { ContactForm } from "./contact-form";
import { getContactsColumns, getFollowUpState } from "./contacts-columns";
import { lifecycleStageOptions, openDealStateOptions } from "./contacts-data/data";
import type { Contact } from "./contacts-data/schema";
import { useContactStore } from "./contacts-data/use-contact-store";

const today = new Date(2026, 7, 16);

const savedViews = [
  { id: "all", label: "All Contacts" },
  { id: "mine", label: "My Contacts" },
  { id: "customer", label: "Customers" },
  { id: "prospect", label: "Prospects" },
  { id: "deals", label: "Open Deals" },
  { id: "followup", label: "Needs Follow-up" },
  { id: "inactive", label: "No Recent Activity" },
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
  contacts: Contact[];
  view: string;
  search: string;
  lifecycleStage: string;
  owner: string;
  openDealState: string;
  created: string;
  followUp: string;
}) {
  let result = [...params.contacts];

  const isArchivedView = params.view === "archived";

  if (isArchivedView) {
    result = result.filter((c) => Boolean(c.archivedAt));
  } else {
    result = result.filter((c) => !c.archivedAt);
  }

  switch (params.view) {
    case "mine":
      result = result.filter((c) => c.ownerId === "arham");
      break;
    case "customer":
      result = result.filter((c) => c.lifecycleStage === "Customer");
      break;
    case "prospect":
      result = result.filter((c) =>
        ["Lead", "Marketing Qualified", "Sales Qualified", "Opportunity"].includes(c.lifecycleStage),
      );
      break;
    case "deals":
      result = result.filter((c) => c.openDealCount > 0);
      break;
    case "followup": {
      result = result.filter((c) => {
        const state = getFollowUpState(c.nextActivity);
        return state === "Overdue" || state === "Due Today";
      });
      break;
    }
    case "inactive":
      result = result.filter((c) => {
        if (!c.lastContacted) return true;
        return differenceInCalendarDays(today, parseISO(c.lastContacted)) > 30;
      });
      break;
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.jobTitle?.toLowerCase().includes(q),
    );
  }

  if (params.lifecycleStage !== "All") {
    result = result.filter((c) => c.lifecycleStage === params.lifecycleStage);
  }

  if (params.owner !== "All") {
    if (params.owner === "me") {
      result = result.filter((c) => c.ownerId === "arham");
    } else {
      result = result.filter((c) => c.ownerId === params.owner);
    }
  }

  if (params.openDealState !== "All") {
    if (params.openDealState === "Has Open Deals") {
      result = result.filter((c) => c.openDealCount > 0);
    } else {
      result = result.filter((c) => c.openDealCount === 0);
    }
  }

  if (params.created !== "All") {
    const yearStart = startOfYear(today);
    const quarterStart = startOfQuarter(today);
    switch (params.created) {
      case "Today": {
        const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        result = result.filter((c) => parseISO(c.createdAt) >= dayStart);
        break;
      }
      case "This Week":
        result = result.filter((c) => parseISO(c.createdAt) >= subDays(today, 7));
        break;
      case "This Month":
        result = result.filter((c) => parseISO(c.createdAt) >= subDays(today, 30));
        break;
      case "This Quarter":
        result = result.filter((c) => parseISO(c.createdAt) >= quarterStart);
        break;
      case "This Year":
        result = result.filter((c) => parseISO(c.createdAt) >= yearStart);
        break;
      case "Older":
        result = result.filter((c) => parseISO(c.createdAt) < yearStart);
        break;
    }
  }

  if (params.followUp !== "All") {
    result = result.filter((c) => getFollowUpState(c.nextActivity) === params.followUp);
  }

  return result;
}

export function Contacts() {
  const contacts = useContactStore((s) => s.contacts);
  const archiveContact = useContactStore((s) => s.archiveContact);
  const restoreContact = useContactStore((s) => s.restoreContact);
  const bulkArchiveContacts = useContactStore((s) => s.bulkArchiveContacts);
  const bulkRestoreContacts = useContactStore((s) => s.bulkRestoreContacts);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeView, setActiveView] = React.useState("all");
  const [lifecycleFilter, setLifecycleFilter] = React.useState<string>("All");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("All");
  const [openDealFilter, setOpenDealFilter] = React.useState<string>("All");
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
  const [editContact, setEditContact] = React.useState<Contact | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Contact | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<Contact | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = React.useState(false);
  const [bulkRestoreOpen, setBulkRestoreOpen] = React.useState(false);

  const handleEditContact = React.useCallback((contact: Contact) => {
    setEditContact(contact);
  }, []);

  const handleArchiveContact = React.useCallback((contact: Contact) => {
    setArchiveTarget(contact);
  }, []);

  const handleRestoreContact = React.useCallback((contact: Contact) => {
    setRestoreTarget(contact);
  }, []);

  const columns = React.useMemo(
    () =>
      getContactsColumns({
        onEditContact: handleEditContact,
        onArchiveContact: handleArchiveContact,
        onRestoreContact: handleRestoreContact,
      }),
    [handleEditContact, handleArchiveContact, handleRestoreContact],
  );

  const filteredContacts = applyFilters({
    contacts: contacts ?? [],
    view: activeView,
    search: searchQuery,
    lifecycleStage: lifecycleFilter,
    owner: ownerFilter,
    openDealState: openDealFilter,
    created: createdFilter,
    followUp: followUpFilter,
  });

  const table = useReactTable({
    data: filteredContacts,
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
  const totalResults = filteredContacts.length;

  const isArchivedView = activeView === "archived";

  function handleViewChange(viewId: string) {
    setActiveView(viewId);
    setSearchQuery("");
    setLifecycleFilter("All");
    setOwnerFilter("All");
    setOpenDealFilter("All");
    setCreatedFilter("All");
    setFollowUpFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setRowSelection({});
  }

  function handleFilterChange(value: string, setter: (v: string) => void) {
    setter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeFilters = [lifecycleFilter, ownerFilter, openDealFilter, createdFilter, followUpFilter].filter(
    (f) => f !== "All",
  );

  function clearAllFilters() {
    setLifecycleFilter("All");
    setOwnerFilter("All");
    setOpenDealFilter("All");
    setCreatedFilter("All");
    setFollowUpFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const totalContacts = totalResults;
  const archivedContactCount = (contacts ?? []).filter((c) => Boolean(c.archivedAt)).length;
  const newThisMonth = filteredContacts.filter((c) => {
    const created = parseISO(c.createdAt);
    return created.getMonth() === today.getMonth() && created.getFullYear() === today.getFullYear();
  }).length;
  const openDealsCount = filteredContacts.filter((c) => c.openDealCount > 0).length;
  const needsFollowUp = filteredContacts.filter((c) => {
    const state = getFollowUpState(c.nextActivity);
    return state === "Overdue" || state === "Due Today";
  }).length;

  const selectedRowIds = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);

  return (
    <>
      <Card>
        <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
          <CardTitle className="text-xl leading-none">Contacts</CardTitle>
          <CardDescription className="max-w-sm leading-snug">
            Manage customer relationships, communication history, and sales connections.
          </CardDescription>
          <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
            {!isArchivedView ? (
              <Button size="sm" className="h-7 gap-1.5" onClick={() => setAddSheetOpen(true)}>
                <UserPlus className="size-3.5" />
                Add Contact
              </Button>
            ) : null}
            <InputGroup className="h-7 w-full md:w-64">
              <InputGroupAddon align="inline-start">
                <Search className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                className="h-7"
                placeholder="Search contacts..."
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <Card size="sm">
                <CardHeader>
                  <CardDescription>{isArchivedView ? "Archived" : "Total Contacts"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl tabular-nums leading-none tracking-tight">{totalContacts}</div>
                </CardContent>
              </Card>
              {!isArchivedView ? (
                <>
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
                      <CardDescription>With Open Deals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl tabular-nums leading-none tracking-tight">{openDealsCount}</div>
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
                </>
              ) : (
                <Card size="sm">
                  <CardHeader>
                    <CardDescription>Archived Contacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl tabular-nums leading-none tracking-tight">{archivedContactCount}</div>
                  </CardContent>
                </Card>
              )}
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
            <Select value={lifecycleFilter} onValueChange={(v) => handleFilterChange(v, setLifecycleFilter)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Lifecycle:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  <SelectItem value="All">All stages</SelectItem>
                  {lifecycleStageOptions.map((s) => (
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
                  <SelectItem value="me">My contacts</SelectItem>
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

            <Select value={openDealFilter} onValueChange={(v) => handleFilterChange(v, setOpenDealFilter)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Deals:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  <SelectItem value="All">All</SelectItem>
                  {openDealStateOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
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
                <Button variant="outline" size="sm" disabled title="Bulk actions will be available in a future step">
                  Assign Owner
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
                          {searchQuery ? `No contacts match "${searchQuery}"` : "No contacts found."}
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
                  <SelectTrigger size="sm" className="w-20" id="contacts-rows-per-page">
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
      </Card>

      <ContactForm open={addSheetOpen} onOpenChange={setAddSheetOpen} />

      <ContactForm
        contact={editContact ?? undefined}
        open={editContact !== null}
        onOpenChange={(open) => {
          if (!open) setEditContact(null);
        }}
      />

      <ContactArchiveRestoreDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        mode="archive"
        count={1}
        contactName={archiveTarget?.name}
        onConfirm={() => {
          if (!archiveTarget) return;
          archiveContact(archiveTarget.id, currentSalesOwnerId);
          setArchiveTarget(null);
          toast("Contact archived", { description: `${archiveTarget.name} has been archived.` });
        }}
      />

      <ContactArchiveRestoreDialog
        open={restoreTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        mode="restore"
        count={1}
        contactName={restoreTarget?.name}
        onConfirm={() => {
          if (!restoreTarget) return;
          restoreContact(restoreTarget.id);
          setRestoreTarget(null);
          toast("Contact restored", { description: `${restoreTarget.name} has been restored.` });
        }}
      />

      <ContactArchiveRestoreDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        mode="archive"
        count={selectedRowIds.length}
        onConfirm={() => {
          const ids = selectedRowIds;
          bulkArchiveContacts(ids, currentSalesOwnerId);
          setRowSelection({});
          toast("Contacts archived", { description: `${ids.length} contact(s) have been archived.` });
        }}
      />

      <ContactArchiveRestoreDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        mode="restore"
        count={selectedRowIds.length}
        onConfirm={() => {
          const ids = selectedRowIds;
          bulkRestoreContacts(ids);
          setRowSelection({});
          toast("Contacts restored", { description: `${ids.length} contact(s) have been restored.` });
        }}
      />
    </>
  );
}
