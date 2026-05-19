import { Plane, Search, Ship, SlidersHorizontal, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { type Shipment, shipments } from "./data";

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

function getProgressRingClass(status: Shipment["status"]) {
  return cn(
    "grid size-3 place-items-center rounded-full p-[0.5px] bg-[conic-gradient(currentColor_0deg_var(--angle),transparent_var(--angle)_360deg)]",
    progressRingClasses[status],
  );
}

function ShipmentCard({ shipment, active }: { shipment: Shipment; active?: boolean }) {
  const angle = (shipment.progress / 100) * 360;
  const Icon = modeIcons[shipment.mode];

  return (
    <div className={cn("flex flex-col gap-5 rounded-xl border p-3", active && "border-2 border-primary bg-muted/50")}>
      <div className="flex items-center justify-between">
        <div>#{shipment.id}</div>

        <div className="flex items-center gap-1">
          <div
            style={{ "--angle": `${angle}deg` } as React.CSSProperties}
            className={getProgressRingClass(shipment.status)}
          >
            <div className="grid size-2 place-items-center rounded-full bg-card">
              <div className="size-1 rounded-full bg-current" />
            </div>
          </div>
          <div className="text-muted-foreground text-xs">{shipment.status}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={cn(`flag:${shipment.origin.countryCode.toUpperCase()}`, "rounded-xs text-3xl")} />
          <div className="flex flex-col gap-0.5">
            <div className="font-medium text-xs leading-none">{shipment.origin.country},</div>
            <div className="text-muted-foreground text-xs">{shipment.origin.display}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-right">
          <div className="flex flex-col gap-0.5">
            <div className="font-medium text-xs leading-none">{shipment.destination.country},</div>
            <div className="text-muted-foreground text-xs">{shipment.destination.display}</div>
          </div>
          <div className={cn(`flag:${shipment.destination.countryCode.toUpperCase()}`, "rounded-xs text-3xl")} />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <span
          className="h-px min-w-0 border-foreground border-t border-dashed"
          style={{ flexGrow: shipment.progress, flexBasis: 0 }}
        />
        <Icon className="size-3.5" />
        <span
          className="h-px min-w-0 border-border border-t border-dashed"
          style={{ flexGrow: 100 - shipment.progress, flexBasis: 0 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-muted-foreground text-xs leading-none">Cargo</div>
          <div className="truncate text-sm tracking-tight">{shipment.cargo}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground text-xs leading-none">ETA</div>
          <div className="text-sm tabular-nums tracking-tight">
            {shipment.eta}
            {shipment.etaMeta && (
              <span className="ml-1 font-normal text-muted-foreground text-xs">{shipment.etaMeta}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShipmentsPanel() {
  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader>
        <CardTitle className="font-normal text-xl">Shipments</CardTitle>
        <CardAction>
          <Button size="icon-sm" variant="ghost">
            <SlidersHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden px-0">
        <Tabs defaultValue="all">
          <TabsList className="w-full border-b px-4" variant="line">
            <TabsTrigger className="text-xs" value="all">
              All (156)
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="in-transit">
              In Transit (32)
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="delivered">
              Delivered (98)
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="delayed">
              Delayed (9)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="px-4">
          <InputGroup className="h-8">
            <InputGroupInput className="h-8" aria-label="Search shipments" placeholder="Search shipments..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-4 px-4">
            {shipments.map((shipment, index) => (
              <ShipmentCard active={index === 0} key={shipment.id} shipment={shipment} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
