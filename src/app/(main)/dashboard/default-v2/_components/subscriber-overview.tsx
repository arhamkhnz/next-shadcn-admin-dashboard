"use client";

import * as React from "react";

import {
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  User2,
  UsersRound,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const customerNames = [
  "Sarah Parker",
  "Mike Brown",
  "Linda Chen",
  "David Lee",
  "Emily White",
  "Jessica Wong",
  "Kevin Harris",
  "Priya Shah",
  "Daniel Hall",
  "Ava Mitchell",
  "Noah Carter",
  "Sophia Turner",
  "Liam Collins",
  "Mia Roberts",
  "Ethan Brooks",
  "Grace Murphy",
  "Lucas Bennett",
  "Zoe Kelly",
  "Ryan Cooper",
  "Chloe Adams",
  "Nathan Reed",
  "Isla Foster",
  "Owen Ward",
  "Ella Peterson",
  "Leo Jenkins",
  "Aria Russell",
  "Jack Powell",
  "Nora Simmons",
  "Henry Price",
  "Lily Hughes",
  "Aiden Butler",
  "Hannah Perry",
  "Mason Barnes",
  "Scarlett Ross",
  "Logan Coleman",
  "Layla Griffin",
  "Julian Diaz",
  "Aurora Hayes",
  "Wyatt Kim",
  "Stella Sanders",
  "Isaac Flores",
  "Penelope Bryant",
  "Caleb Foster",
  "Violet Howard",
  "Sebastian Gray",
  "Lucy James",
  "Samuel Watson",
  "Ruby Morris",
  "Levi Bell",
  "Hazel Cook",
  "Gabriel Rivera",
  "Eva Bailey",
  "Julian Stone",
  "Ivy Cooper",
  "Thomas Kelly",
  "Maya Johnson",
  "Avery Brooks",
  "Riley Scott",
  "Hudson Reed",
  "Naomi Price",
];

const domains = ["acme.co", "northstar.io", "vertex.co", "bluepeak.app", "pulselabs.ai", "quantix.dev"];
const plans = ["Enterprise", "Growth", "Pro", "Starter"] as const;
const statuses = ["Subscribed", "Inactive", "Unsubscribed"] as const;
const sources = ["Website", "Organic", "Referral", "Paid Social"] as const;

const customers = customerNames.map((name, index) => {
  const [firstName, lastName] = name.toLowerCase().split(" ");
  const id = `${18425 - index}`;
  const day = String(30 - (index % 28)).padStart(2, "0");
  const month = index < 18 ? "04" : index < 40 ? "03" : "02";

  return {
    id,
    name,
    email: `${firstName}.${lastName}@${domains[index % domains.length]}`,
    plan: plans[index % plans.length],
    status: statuses[index % statuses.length],
    joined: `2026-${month}-${day}`,
    source: sources[index % sources.length],
  };
});

function statusBadge(status: string) {
  switch (status) {
    case "Subscribed":
      return "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400";
    case "Inactive":
      return "border-muted-foreground/20 bg-muted text-muted-foreground";
    case "Unsubscribed":
      return "border-rose-200 bg-rose-500/10 text-rose-700 dark:border-rose-900 dark:text-rose-400";
    default:
      return "border-muted-foreground/20 bg-muted text-muted-foreground";
  }
}

function sourceBadge(source: string) {
  switch (source) {
    case "Website":
      return "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900 dark:text-blue-400";
    case "Organic":
      return "border-violet-200 bg-violet-500/10 text-violet-700 dark:border-violet-900 dark:text-violet-400";
    case "Referral":
      return "border-fuchsia-200 bg-fuchsia-500/10 text-fuchsia-700 dark:border-fuchsia-900 dark:text-fuchsia-400";
    case "Paid Social":
      return "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900 dark:text-amber-400";
    default:
      return "border-muted-foreground/20 bg-muted text-muted-foreground";
  }
}

export function SubscriberOverview() {
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const pageCount = Math.ceil(customers.length / pageSize);
  const paginatedCustomers = customers.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">18,426 Customers</CardTitle>
        <CardDescription>Recent customer records with plan, status, source, and signup activity.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-7 rounded-[min(var(--radius-md),12px)] pl-8" placeholder="Search customers..." />
            </div>
            <Button variant="outline" size="sm">
              <UsersRound />
              Status
            </Button>
            <Button variant="outline" size="sm">
              <CalendarDays />
              Joined date
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
            <Button variant="outline" size="sm">
              <Workflow />
              Source
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown />
              Sort
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="w-10">
                <div className="flex items-center justify-center">
                  <Checkbox aria-label="Select all customers" />
                </div>
              </TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Checkbox aria-label={`Select ${customer.name}`} />
                  </div>
                </TableCell>
                <TableCell className="font-medium tabular-nums">{customer.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full border bg-muted">
                      <User2 className="size-4 text-muted-foreground" />
                    </span>
                    <div className="grid gap-0.5">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-muted-foreground text-sm">{customer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusBadge(customer.status)}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.plan}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={sourceBadge(customer.source)}>
                    {customer.source}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">{customer.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
            0 of {customers.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="customer-rows-per-page" className="font-medium text-sm">
                Rows per page
              </Label>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="customer-rows-per-page">
                  <SelectValue placeholder={`${pageSize}`} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((value) => (
                      <SelectItem key={value} value={`${value}`}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center font-medium text-sm">
              Page {pageIndex + 1} of {pageCount}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex(0)}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                disabled={pageIndex >= pageCount - 1}
                onClick={() => setPageIndex((current) => Math.min(pageCount - 1, current + 1))}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                disabled={pageIndex >= pageCount - 1}
                onClick={() => setPageIndex(pageCount - 1)}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
