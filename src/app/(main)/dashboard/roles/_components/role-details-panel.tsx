import { Archive, ChevronRight, MoreVertical, Shield, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AccessBadge, PermissionStatus } from "./role-ui";
import { selectedPermissions, selectedRole } from "./roles-data";

export function RoleDetailsSheetContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col bg-card/30">
      <div className="flex flex-row items-center justify-between border-b px-4 py-4 md:px-6">
        <h2 className="font-medium text-lg">Role Details</h2>
        <Button aria-label="Close role details" size="icon-sm" variant="ghost" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-lg bg-primary/15 text-primary">
            <Shield className="size-7" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-lg">{selectedRole.name}</h3>
            <p className="text-muted-foreground text-sm">{selectedRole.kind} Role</p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-6">
          Full access to all features, settings and administration functions.
        </p>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <DetailMetric label="Members" value={selectedRole.members.total.toString()} />
          <DetailMetric label="Created" value={selectedRole.created} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm">Access Level</span>
          <AccessBadge level={selectedRole.accessLevel} />
        </div>

        <Separator />

        <Tabs defaultValue="permissions" className="gap-4">
          <TabsList variant="line" className="h-10 w-full justify-start gap-6 rounded-none">
            <TabsTrigger value="permissions" className="px-0 data-active:text-primary data-active:after:bg-primary">
              Permissions
            </TabsTrigger>
            <TabsTrigger value="details" className="px-0">
              Details
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-3 divide-x rounded-lg border bg-background/40 py-3">
          <SummaryMetric label="Granted" status="granted" value="24" />
          <SummaryMetric label="Partial" status="partial" value="1" />
          <SummaryMetric label="None" status="none" value="3" />
        </div>

        <Button className="w-full" variant="outline">
          Edit Permissions
        </Button>

        <Separator />

        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-sm">Included Permissions</h3>
          <div className="flex flex-col gap-2">
            {selectedPermissions.map((permission) => (
              <div key={permission.key} className="flex items-center gap-2 text-sm">
                <PermissionStatus status="granted" size="sm" />
                <span className="min-w-0 flex-1 truncate">{permission.detailLabel}</span>
                <Button aria-label={`Open ${permission.detailLabel} menu`} size="icon-xs" variant="ghost">
                  <MoreVertical />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <Button className="w-full justify-between" variant="ghost">
          View Permission Details
          <ChevronRight data-icon="inline-end" />
        </Button>

        <Button className="w-full justify-start border-destructive/40 text-destructive" variant="outline">
          <Archive data-icon="inline-start" />
          Archive Role
        </Button>
      </div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  status,
}: {
  label: string;
  value: "1" | "3" | "24";
  status: "granted" | "partial" | "none";
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1 font-medium">
        <PermissionStatus status={status} size="sm" />
        {value}
      </span>
    </div>
  );
}
