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
import { parseISO } from "date-fns";
import { Search, X } from "lucide-react";
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

import { getCompaniesColumns } from "./companies-columns";
import { industryOptions, sizeOptions, typeOptions } from "./companies-data/data";
import type { Company, CompanyActivityState } from "./companies-data/schema";
import { useCompanyStore } from "./companies-data/use-company-store";
import { CompanyArchiveRestoreDialog } from "./company-archive-restore-dialog";

const today = new Date(2026, 7, 16);

const savedViews = [
  { id: "all", label: "All Companies" },
  { id: "mine", label: "My Companies" },
  { id: "customer", label: "Customers" },
  { id: "prospect", label: "Prospects" },
  { id: "partner", label: "Partners" },
  { id: "open_deals", label: "With Open Deals" },
  { id: "inactive", label: "Inactive" },
  { id: "archived", label: "Archived" },
] as const;

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

function getActivityState(lastActivity: string | null): CompanyActivityState {
  if (!lastActivity) return "Never Active";
  const diff = today.getTime() - parseISO(lastActivity).getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days <= 30) return "Recently Active";
  return "Inactive";
}

function applyFilters(params: {
  companies: Company[];
  view: string;
  search: string;
  type: string;
  industry: string;
  owner: string;
  size: string;
  location: string;
  openDealState: string;
  activityState: string;
}) {
  let result = [...params.companies];

  const isArchivedView = params.view === "archived";

  if (isArchivedView) {
    result = result.filter((c) => Boolean(c.archivedAt));
  } else {
    result = result.filter((c) => !c.archivedAt);
  }

  switch (params.view) {
    case "mine":
      result = result.filter((c) => c.ownerId === currentSalesOwnerId);
      break;
    case "customer":
      result = result.filter((c) => c.type === "Customer");
      break;
    case "prospect":
      result = result.filter((c) => c.type === "Prospect");
      break;
    case "partner":
      result = result.filter((c) => c.type === "Partner");
      break;
    case "open_deals":
      result = result.filter((c) => c.openDealCount > 0);
      break;
    case "inactive":
      result = result.filter((c) => {
        const state = getActivityState(c.lastActivity);
        return state === "Inactive" || state === "Never Active";
      });
      break;
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.domain?.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.website?.toLowerCase().includes(q),
    );
  }

  if (params.type !== "All") {
    result = result.filter((c) => c.type === params.type);
  }

  if (params.industry !== "All") {
    result = result.filter((c) => c.industry === params.industry);
  }

  if (params.owner !== "All") {
    if (params.owner === "me") {
      result = result.filter((c) => c.ownerId === currentSalesOwnerId);
    } else {
      result = result.filter((c) => c.ownerId === params.owner);
    }
  }

  if (params.size !== "All") {
    result = result.filter((c) => c.size === params.size);
  }

  if (params.location !== "All") {
    if (params.location === "unspecified") {
      result = result.filter((c) => !c.location);
    } else {
      result = result.filter((c) => c.location === params.location);
    }
  }

  if (params.openDealState !== "All") {
    if (params.openDealState === "has") {
      result = result.filter((c) => c.openDealCount > 0);
    } else {
      result = result.filter((c) => c.openDealCount === 0);
    }
  }

  if (params.activityState !== "All") {
    result = result.filter((c) => getActivityState(c.lastActivity) === params.activityState);
  }

  return result;
}

export function Companies() {
  const companies = useCompanyStore((s) => s.companies);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeView, setActiveView] = React.useState("all");
  const isArchivedView = activeView === "archived";
  const [typeFilter, setTypeFilter] = React.useState<string>("All");
  const [industryFilter, setIndustryFilter] = React.useState<string>("All");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("All");
  const [sizeFilter, setSizeFilter] = React.useState<string>("All");
  const [locationFilter, setLocationFilter] = React.useState<string>("All");
  const [openDealStateFilter, setOpenDealStateFilter] = React.useState<string>("All");
  const [activityStateFilter, setActivityStateFilter] = React.useState<string>("All");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    search: false,
    website: true,
    createdAt: false,
  });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [archiveTarget, setArchiveTarget] = React.useState<Company | null>(null);
  const [restoreTarget, setRestoreTarget] = React.useState<Company | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = React.useState(false);
  const [bulkRestoreOpen, setBulkRestoreOpen] = React.useState(false);

  const archiveCompany = useCompanyStore((s) => s.archiveCompany);
  const restoreCompany = useCompanyStore((s) => s.restoreCompany);
  const bulkArchiveCompanies = useCompanyStore((s) => s.bulkArchiveCompanies);
  const bulkRestoreCompanies = useCompanyStore((s) => s.bulkRestoreCompanies);

  const columns = React.useMemo(
    () =>
      getCompaniesColumns({
        onArchiveCompany: (company) => setArchiveTarget(company),
        onRestoreCompany: (company) => setRestoreTarget(company),
      }),
    [],
  );

  const filteredCompanies = applyFilters({
    companies,
    view: activeView,
    search: searchQuery,
    type: typeFilter,
    industry: industryFilter,
    owner: ownerFilter,
    size: sizeFilter,
    location: locationFilter,
    openDealState: openDealStateFilter,
    activityState: activityStateFilter,
  });

  const table = useReactTable({
    data: filteredCompanies,
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
  const totalResults = filteredCompanies.length;

  const uniqueLocations = React.useMemo(() => {
    const locs = new Set(companies.map((c) => c.location).filter(Boolean));
    return Array.from(locs).sort();
  }, [companies]);

  function handleViewChange(viewId: string) {
    setActiveView(viewId);
    setSearchQuery("");
    setTypeFilter("All");
    setIndustryFilter("All");
    setOwnerFilter("All");
    setSizeFilter("All");
    setLocationFilter("All");
    setOpenDealStateFilter("All");
    setActivityStateFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setRowSelection({});
  }

  function handleFilterChange(value: string, setter: (v: string) => void) {
    setter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const activeFilters = [
    typeFilter,
    industryFilter,
    ownerFilter,
    sizeFilter,
    locationFilter,
    openDealStateFilter,
    activityStateFilter,
  ].filter((f) => f !== "All");

  function clearAllFilters() {
    setTypeFilter("All");
    setIndustryFilter("All");
    setOwnerFilter("All");
    setSizeFilter("All");
    setLocationFilter("All");
    setOpenDealStateFilter("All");
    setActivityStateFilter("All");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const customerCount = filteredCompanies.filter((c) => c.type === "Customer").length;
  const prospectCount = filteredCompanies.filter((c) => c.type === "Prospect").length;
  const totalPipelineValue = filteredCompanies.reduce((sum, c) => sum + c.openPipelineValue, 0);

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Companies</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Track accounts, manage relationships, and monitor company health across your pipeline.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search companies..."
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Total Companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{totalResults}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Active Customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{customerCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Prospect Companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">{prospectCount}</div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Open Pipeline Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl tabular-nums leading-none tracking-tight">
                  {totalPipelineValue > 0 ? `$${(totalPipelineValue / 1000).toFixed(0)}k` : "$0"}
                </div>
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
          <Select value={typeFilter} onValueChange={(v) => handleFilterChange(v, setTypeFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Type:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All types</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={industryFilter} onValueChange={(v) => handleFilterChange(v, setIndustryFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Industry:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All industries</SelectItem>
                {industryOptions.map((s) => (
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
                <SelectItem value="me">My companies</SelectItem>
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

          <Select value={sizeFilter} onValueChange={(v) => handleFilterChange(v, setSizeFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Size:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All sizes</SelectItem>
                {sizeOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={(v) => handleFilterChange(v, setLocationFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Location:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All locations</SelectItem>
                <SelectItem value="unspecified">Unspecified</SelectItem>
              </SelectGroup>
              <SelectGroup>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc ?? ""}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={openDealStateFilter} onValueChange={(v) => handleFilterChange(v, setOpenDealStateFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Deals:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="has">Has Open Deals</SelectItem>
                <SelectItem value="none">No Open Deals</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={activityStateFilter} onValueChange={(v) => handleFilterChange(v, setActivityStateFilter)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Activity:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Recently Active">Recently Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Never Active">Never Active</SelectItem>
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
              <Button variant="outline" size="sm" disabled>
                Delete Selected
              </Button>
              <Button variant="outline" size="sm" disabled>
                Export Companies
              </Button>
              <Button variant="outline" size="sm" disabled>
                Tag Selected
              </Button>
              <Button variant="outline" size="sm" disabled>
                Change Owner
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
                        {searchQuery ? `No companies match "${searchQuery}"` : "No companies found."}
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
                <SelectTrigger size="sm" className="w-20" id="companies-rows-per-page">
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
      <CompanyArchiveRestoreDialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        mode="archive"
        count={1}
        companyName={archiveTarget?.name}
        onConfirm={() => {
          if (archiveTarget) {
            archiveCompany(archiveTarget.id, currentSalesOwnerId);
            toast("Company archived", { description: `${archiveTarget.name} has been archived.` });
          }
          setArchiveTarget(null);
        }}
      />
      <CompanyArchiveRestoreDialog
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        mode="restore"
        count={1}
        companyName={restoreTarget?.name}
        onConfirm={() => {
          if (restoreTarget) {
            restoreCompany(restoreTarget.id);
            toast("Company restored", { description: `${restoreTarget.name} has been restored.` });
          }
          setRestoreTarget(null);
        }}
      />
      <CompanyArchiveRestoreDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        mode="archive"
        count={selectedCount}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkArchiveCompanies(ids, currentSalesOwnerId);
          setRowSelection({});
          toast("Companies archived", { description: `${ids.length} company(ies) have been archived.` });
        }}
      />
      <CompanyArchiveRestoreDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        mode="restore"
        count={selectedCount}
        onConfirm={() => {
          const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
          bulkRestoreCompanies(ids);
          setRowSelection({});
          toast("Companies restored", { description: `${ids.length} company(ies) have been restored.` });
        }}
      />
    </Card>
  );
}
