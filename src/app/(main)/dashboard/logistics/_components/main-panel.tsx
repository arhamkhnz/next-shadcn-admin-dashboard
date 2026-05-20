import { Copy, Plane, Ship, Truck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Shipment } from "./data";
import { RouteMap } from "./route-map";

const modeIcons = {
  air: Plane,
  land: Truck,
  sea: Ship,
} as const;

type MainPanelProps = {
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
          <span className="text-muted-foreground">{shipment.status}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{shipment.progress}% complete</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            ETA {shipment.eta} {shipment.etaMeta}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-9 after:rounded-sm">
            <AvatarFallback className="rounded-sm">A</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm leading-none">Arham Khan</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs tabular-nums leading-none tracking-tight">SDA-XXXX-XXXXX-XX</span>{" "}
              <Copy className="size-3" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">Priority account</Badge>
          <Badge variant="outline">Call before delivery</Badge>
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

        <div className="grid grid-cols-[1.35fr_1fr_1.1fr_1fr_1fr] gap-x-4 pt-2">
          <div className="whitespace-nowrap text-sm leading-none">Handling instructions</div>
          <div className="col-span-4 text-muted-foreground text-sm leading-none">
            {shipment.handling}. Keep package sealed until handoff.
          </div>
        </div>
      </div>
    </div>
  );
}

export function MainPanel({ shipment }: MainPanelProps) {
  if (!shipment) {
    return (
      <div className="grid h-full min-h-0 grid-rows-2 overflow-hidden">
        <div className="min-h-0 overflow-hidden">
          <RouteMap shipment={null} />
        </div>
        <div className="min-h-0 overflow-hidden p-4">
          <EmptyShipmentOverview />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-2 overflow-hidden">
      <div className="min-h-0 overflow-hidden">
        <RouteMap shipment={shipment} />
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
