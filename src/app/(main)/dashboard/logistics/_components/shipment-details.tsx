import { AlertTriangleIcon, Copy, Plane, Ship, Star, Truck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { Shipment } from "./shipment-data";
import { ShipmentRouteMap } from "./shipment-route-map";

const modeIcons = {
  air: Plane,
  land: Truck,
  sea: Ship,
} as const;

const progressRingClasses: Record<Shipment["status"], string> = {
  Scheduled: "text-muted-foreground",
  "In Transit": "text-primary",
  "Out for Delivery": "text-primary",
  Delivered: "text-green-600",
  Delayed: "text-destructive",
  "On Hold": "text-amber-500",
  "Customs Hold": "text-amber-500",
};

const statusBadgeClasses: Record<Shipment["status"], string> = {
  Scheduled: "border-muted bg-muted/50 text-muted-foreground",
  "In Transit": "border-primary/20 bg-primary/10 text-primary",
  "Out for Delivery": "border-primary/20 bg-primary/10 text-primary",
  Delivered: "border-green-600/20 bg-green-600/10 text-green-600",
  Delayed: "border-destructive/20 bg-destructive/10 text-destructive",
  "On Hold": "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Customs Hold": "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

type ShipmentDetailsProps = {
  shipment: Shipment | null;
};

function getContactLabel(mode: Shipment["mode"]) {
  if (mode === "land") {
    return "Call Driver";
  }

  if (mode === "air") {
    return "Call Airline Support";
  }

  return "Call Captain";
}

function getTransportNumberLabel(mode: Shipment["mode"]) {
  if (mode === "land") {
    return "Vehicle number";
  }

  if (mode === "air") {
    return "Flight number";
  }

  return "Vessel number";
}

function EmptyShipmentOverview() {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-dashed text-muted-foreground text-sm">
      Select a shipment to view details.
    </div>
  );
}

function ShipmentOverview({ shipment }: { shipment: Shipment }) {
  const ContactIcon = modeIcons[shipment.mode];
  const contactLabel = getContactLabel(shipment.mode);
  const transportNumberLabel = getTransportNumberLabel(shipment.mode);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-xl tabular-nums tracking-tight">#{shipment.id}</h1>
          <Button variant="ghost" size="icon-sm" aria-label="Copy shipment ID">
            <Copy />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className={cn("gap-1.5", statusBadgeClasses[shipment.status])}>
            <span className={cn("size-1.5 rounded-full bg-current", progressRingClasses[shipment.status])} />
            {shipment.status}
          </Badge>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground tabular-nums">{shipment.progress}% complete</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground tabular-nums">
            ETA: {shipment.eta} {shipment.etaMeta}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-9 after:rounded-sm">
            <AvatarFallback className="rounded-sm">{shipment.customer.initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm leading-none">{shipment.customer.name}</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs tabular-nums leading-none tracking-tight">{shipment.customer.id}</span>{" "}
              <Copy className="size-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge variant="secondary">
            <Star />
            {shipment.customer.tier}
          </Badge>
          <div className="text-muted-foreground text-xs leading-none">{shipment.customer.tierLabel}</div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-medium">Cargo details</h2>

          <Button variant="outline" size="sm">
            <ContactIcon data-icon="inline-start" />
            {contactLabel}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1.35fr_1fr_1.1fr_1fr_1fr] gap-x-4">
            <div />
            <div className="text-muted-foreground text-sm leading-none">Total weight</div>
            <div className="text-muted-foreground text-sm leading-none">Transport mode</div>
            <div className="pl-6 text-muted-foreground text-sm leading-none">{transportNumberLabel}</div>
            <div className="text-right text-muted-foreground text-sm leading-none">Status</div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-[1.35fr_1fr_1.1fr_1fr_1fr] gap-x-4">
              <div className="whitespace-nowrap text-sm leading-none">{shipment.cargo}</div>
              <div className="text-sm leading-none">{shipment.weight}</div>
              <div className="text-sm capitalize leading-none">
                {shipment.mode} · {shipment.routeType}
              </div>
              <div className="pl-6 text-sm leading-none">{shipment.transportNumber}</div>
              <div className="text-right text-sm leading-none">{shipment.progress}% complete</div>
            </div>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
          <AlertTriangleIcon />
          <AlertTitle>{shipment.handling.label}</AlertTitle>
          <AlertDescription className="space-y-2">
            <div className="border-amber-900 text-amber-900 leading-none dark:border-amber-50 dark:text-amber-50">
              {shipment.handling.note}
            </div>

            <Separator className="bg-amber-800 dark:bg-amber-50" />

            <div className="flex flex-wrap gap-2">
              {shipment.handling.tags.map(({ icon: TagIcon, label }) => (
                <Badge
                  className="rounded-sm border-amber-200 bg-background/50 text-amber-900 dark:border-amber-900 dark:text-amber-50"
                  key={label}
                  variant="outline"
                >
                  <TagIcon data-icon="inline-start" />
                  {label}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  if (!shipment) {
    return (
      <div className="grid h-full min-h-0 grid-rows-[420px_1fr] overflow-hidden">
        <div className="min-h-0 overflow-hidden">
          <ShipmentRouteMap shipment={null} />
        </div>
        <div className="min-h-0 overflow-hidden p-4">
          <EmptyShipmentOverview />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[420px_1fr] overflow-hidden">
      <div className="min-h-0 overflow-hidden">
        <ShipmentRouteMap shipment={shipment} />
      </div>
      <div className="min-h-0 overflow-hidden">
        <div className="h-full min-h-0 py-2">
          <Tabs defaultValue="overview" className="h-full gap-0">
            <TabsList className="w-full justify-start gap-4 border-b px-4" variant="line">
              <TabsTrigger className="flex-none" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="route">
                Route
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="cargo">
                Cargo
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="documents">
                Documents
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="activity">
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent className="min-h-0 overflow-auto p-4" value="overview">
              <ShipmentOverview shipment={shipment} />
            </TabsContent>
            <TabsContent className="p-4" value="route">
              <div className="grid h-full place-items-center rounded-md border border-dashed text-muted-foreground text-sm">
                Route view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="cargo">
              <div className="grid h-full place-items-center rounded-md border border-dashed text-muted-foreground text-sm">
                Cargo view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="documents">
              <div className="grid h-full place-items-center rounded-md border border-dashed text-muted-foreground text-sm">
                Documents view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="activity">
              <div className="grid h-full place-items-center rounded-md border border-dashed text-muted-foreground text-sm">
                Activity view coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
