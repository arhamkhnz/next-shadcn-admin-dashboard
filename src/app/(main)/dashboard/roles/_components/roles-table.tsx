import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { AccessBadge, MemberStack, PermissionStatus } from "./role-ui";
import { permissions, roleRows } from "./roles-data";

export function RolesTable() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table className="min-w-[1240px]">
        <TableHeader className="bg-muted/25">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 px-4" />
            <TableHead className="w-48 px-2 py-4">Role</TableHead>
            <TableHead className="w-56 px-2 py-4">Description</TableHead>
            <TableHead className="w-28 px-2 py-4">Members</TableHead>
            <TableHead className="w-32 px-2 py-4">Access Level</TableHead>
            {permissions.map((permission) => (
              <TableHead key={permission.key} className="w-24 border-l px-2 py-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <permission.icon className="size-4 text-muted-foreground" />
                  <span>{permission.label}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roleRows.map((role, index) => {
            const isSelected = index === 0;

            return (
              <TableRow
                key={role.name}
                data-state={isSelected ? "selected" : undefined}
                className={cn(
                  "h-[76px] hover:bg-muted/25",
                  isSelected &&
                    "bg-primary/5 outline outline-1 outline-primary/50 -outline-offset-1 hover:bg-primary/10",
                )}
              >
                <TableCell className="px-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-5 place-items-center rounded-full border border-muted-foreground/40",
                      isSelected && "border-primary bg-primary/15",
                    )}
                  >
                    {isSelected ? <span className="size-2 rounded-full bg-primary" /> : null}
                  </span>
                </TableCell>
                <TableCell className="px-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium leading-none">{role.name}</span>
                    <Badge className="w-fit" variant="secondary">
                      {role.kind}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal px-2 text-muted-foreground">
                  <span className="line-clamp-2">{role.description}</span>
                </TableCell>
                <TableCell className="px-2">
                  <MemberStack members={role.members.visible} hidden={role.members.hidden} />
                </TableCell>
                <TableCell className="px-2">
                  <AccessBadge level={role.accessLevel} />
                </TableCell>
                {permissions.map((permission) => (
                  <TableCell key={permission.key} className="border-l px-2 text-center">
                    <PermissionStatus status={role.permissions[permission.key]} />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-4 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-sm">Showing 1 to 10 of 12 roles</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Button aria-label="Previous page" size="icon-sm" variant="ghost">
              <ChevronLeft />
            </Button>
            <Button className="border-primary/50 text-primary" size="icon-sm" variant="outline">
              1
            </Button>
            <Button size="icon-sm" variant="ghost">
              2
            </Button>
            <Button aria-label="Next page" size="icon-sm" variant="ghost">
              <ChevronRight />
            </Button>
          </div>
          <Select defaultValue="10">
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
