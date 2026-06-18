import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  CircleDashed,
  CircleGauge,
  Clock3,
  Copy,
  EllipsisVertical,
  FileText,
  Plus,
  RefreshCw,
  Settings,
  SquareTerminal,
  Terminal,
} from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { InfrastructureEnvironment, InfrastructureGroup } from "./infrastructure-data";
import { ResourceMeter } from "./resource-meter";

export function InfrastructureProjectGroup({ group }: { group: InfrastructureGroup }) {
  return (
    <Collapsible
      defaultOpen={group.defaultOpen}
      className="flex flex-col overflow-hidden rounded-xl border bg-card py-3 text-card-foreground data-[state=open]:gap-3 data-[state=open]:pb-0"
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-start gap-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group -ml-2 h-auto gap-2 px-2 py-1 hover:bg-transparent aria-expanded:bg-transparent"
            >
              <ChevronDown className="group-data-[state=open]:rotate-180" />
              <div className="block truncate font-medium leading-none">{group.name}</div>
              <span className="min-w-0">
                {/* <span className="block text-muted-foreground text-sm">{group.organization}</span> */}
              </span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm">
            <Plus data-icon="inline-start" />
            Add Environment
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                {group.rows.length > 0 ? (
                  <DropdownMenuItem>
                    <FileText />
                    Activity Logs
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem>
                  <Terminal />
                  Open Console
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Project Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw />
                  Sync Status
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Manage Alerts
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Copy />
                  Copy Project ID
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CollapsibleContent>
        {group.rows.length > 0 ? <EnvironmentTable rows={group.rows} /> : <EmptyProjectState />}
      </CollapsibleContent>
    </Collapsible>
  );
}

function EnvironmentTable({ rows }: { rows: InfrastructureEnvironment[] }) {
  return (
    <Table className="**:data-[slot='table-cell']:px-5 **:data-[slot='table-head']:px-5">
      <TableHeader className="bg-muted/50 [&_tr]:border-y">
        <TableRow>
          <TableHead className="flex max-w-56 items-center gap-1 font-medium">
            Domain <ArrowUpDown className="size-4" />
          </TableHead>
          <TableHead className="max-w-32">Platform</TableHead>
          <TableHead className="max-w-32">Environment</TableHead>
          <TableHead className="max-w-32">Status</TableHead>
          <TableHead className="max-w-32">Latency</TableHead>
          <TableHead className="max-w-32">Uptime</TableHead>
          <TableHead className="max-w-72">Resources</TableHead>
          <TableHead className="w-[210px]">Server</TableHead>
          <TableHead className="max-w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="**:data-[slot='table-row']:hover:bg-transparent">
        {rows.map((row) => (
          <TableRow key={row.domain}>
            <TableCell className="max-w-56">
              <span className="block truncate font-medium" title={row.domain}>
                {row.domain}
              </span>
            </TableCell>
            <TableCell className="max-w-32">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <SimpleIcon icon={row.platform.icon} className="size-4 fill-current" />
                {row.platform.name}
              </span>
            </TableCell>
            <TableCell className="max-w-32">
              <Badge
                variant={row.environment === "Expired" ? "destructive" : "secondary"}
                className={cn(
                  "rounded-sm px-1.5 py-0.5",
                  row.environment === "Staging" && "bg-primary/10 text-primary",
                )}
              >
                {row.environment}
              </Badge>
            </TableCell>
            <TableCell className="max-w-32">
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <span className="size-2 rounded-full bg-green-600 dark:bg-green-500" />
                {row.status}
              </div>
            </TableCell>
            <TableCell className="max-w-32">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                <CircleGauge className="size-4" />
                {row.latency}
              </span>
            </TableCell>
            <TableCell className="max-w-32">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                <Clock3 className="size-4" />
                {row.uptime}
              </span>
            </TableCell>
            <TableCell className="max-w-72">
              <div className="grid grid-cols-3 gap-3">
                <ResourceMeter label="CPU" value={row.resources.cpu} />
                <ResourceMeter
                  label="RAM"
                  value={row.resources.ram}
                  tone={row.resources.ram > 60 ? "danger" : "default"}
                />
                <ResourceMeter
                  label="Disk"
                  value={row.resources.disk}
                  tone={row.resources.disk > 60 ? "danger" : "default"}
                />
              </div>
            </TableCell>
            <TableCell>
              <span className="flex flex-col font-medium">
                {row.server}
                <span className="text-muted-foreground text-xs">DE · {row.plan}</span>
              </span>
            </TableCell>
            <TableCell className="flex max-w-24 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="-mr-2">
                    <SquareTerminal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <FileText />
                      View Logs
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Terminal />
                      Open Console
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw />
                      Restart
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Copy />
                      Copy URL
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyProjectState() {
  return (
    <div className="flex min-h-24 items-center justify-center border-t bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <CircleDashed className="size-4" />
        <p className="font-medium text-sm">No environments in this project</p>
      </div>
    </div>
  );
}
