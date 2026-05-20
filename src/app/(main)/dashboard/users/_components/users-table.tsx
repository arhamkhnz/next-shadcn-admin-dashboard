import { ArrowUpDown, Grid2x2, List, MoreHorizontal, SlidersHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, getInitials } from "@/lib/utils";

import { roleMeta, statusMeta, twoFaMeta, type UserRow } from "./users-data";

function RoleCell({ role }: { role: string }) {
  const meta = roleMeta[role] ?? { className: "text-muted-foreground", icon: roleMeta["Project Manager"].icon };
  const Icon = meta.icon;

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <Icon className={cn("size-4", meta.className)} />
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: UserRow["status"] }) {
  const meta = statusMeta[status];

  return (
    <Badge className={cn("gap-1.5 border px-3 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}

function TwoFaBadge({ enabled }: { enabled: boolean }) {
  const meta = enabled ? twoFaMeta.enabled : twoFaMeta.disabled;
  const Icon = meta.icon;

  return (
    <Badge className={cn("gap-1.5 border px-3 py-1 font-medium", meta.badgeClass)} variant="outline">
      <Icon className="size-3.5" />
      {enabled ? "Enabled" : "Disabled"}
    </Badge>
  );
}

function AvatarCell({ name, tone }: { name: string; tone: string }) {
  return (
    <Avatar className="size-10 rounded-full ring-1 ring-white/10">
      <AvatarFallback className={cn("rounded-full font-medium text-sm", tone)}>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

export function UsersTable({ rows }: { rows: readonly UserRow[] }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6">
        <div className="text-muted-foreground text-sm">0 selected</div>

        <div className="inline-flex items-center rounded-lg border border-border/70 bg-background/40 p-1">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Filter view"
          >
            <SlidersHorizontal className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-md bg-muted text-foreground transition-colors"
            aria-label="List view"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Grid view"
          >
            <Grid2x2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="px-2 md:px-3">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="w-12 px-3 py-4">
                <Checkbox aria-label="Select all users" />
              </TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  Full name
                  <ArrowUpDown className="size-3.5 text-muted-foreground/80" />
                </span>
              </TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">Email</TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">Role</TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">Status</TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  Joined date
                  <ArrowUpDown className="size-3.5 text-muted-foreground/80" />
                </span>
              </TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  Last active
                  <ArrowUpDown className="size-3.5 text-muted-foreground/80" />
                </span>
              </TableHead>
              <TableHead className="px-3 py-4 font-normal text-muted-foreground">2FA</TableHead>
              <TableHead className="px-3 py-4 text-right font-normal text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((user) => (
              <TableRow key={user.email} className="border-border/60 hover:bg-white/[0.025]">
                <TableCell className="px-3 py-4 align-middle">
                  <Checkbox aria-label={`Select ${user.name}`} />
                </TableCell>
                <TableCell className="px-3 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <AvatarCell name={user.name} tone={user.avatarTone} />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground text-sm">{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-4 align-middle text-muted-foreground text-sm">{user.email}</TableCell>
                <TableCell className="px-3 py-4 align-middle text-foreground text-sm">
                  <RoleCell role={user.role} />
                </TableCell>
                <TableCell className="px-3 py-4 align-middle">
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="px-3 py-4 align-middle text-foreground text-sm">{user.joinedDate}</TableCell>
                <TableCell className="px-3 py-4 align-middle text-foreground text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className={cn("size-1.5 rounded-full", statusMeta[user.status].dotClass)} />
                    {user.lastActive}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-4 align-middle">
                  <TwoFaBadge enabled={user.twoFa} />
                </TableCell>
                <TableCell className="px-3 py-4 text-right align-middle">
                  <Button
                    aria-label={`Open actions for ${user.name}`}
                    className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                    size="icon-sm"
                    variant="ghost"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-auto flex flex-col gap-4 border-border/60 border-t px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Button
              className="h-9 min-w-20 justify-between rounded-lg border-border/70 bg-background/40 px-3 shadow-none hover:bg-muted/50"
              size="sm"
              variant="outline"
            >
              25
              <span className="text-muted-foreground">⌄</span>
            </Button>
          </div>
          <span>1-25 of 342 users</span>
        </div>

        <Pagination className="mx-0 w-auto justify-start md:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" text="" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive size="icon">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="icon">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="icon">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="icon">
                14
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" text="" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
