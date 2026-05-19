import { ArrowRight, Box, Check, Copy, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { shipmentDetails, shipmentTimeline } from "./data";
import { RouteMap } from "./route-map";

export function MainPanel() {
  return (
    <div className="grid h-full grid-rows-2 overflow-hidden">
      <div className="overflow-hidden">
        <RouteMap />
      </div>
      <div>
        <div className="h-full py-2">
          <Tabs defaultValue="overview" className="h-full gap-0">
            <TabsList className="w-full justify-start gap-4 border-b px-4" variant="line">
              <TabsTrigger className="flex-none" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="analytics">
                Analytics
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="routes">
                Routes
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="documents">
                Documents
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="activity">
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent className="p-4" value="overview">
              <div className="grid grid-cols-5 gap-4">
                {shipmentDetails.map((item) => (
                  <div className="flex items-center gap-3" key={item.label}>
                    <item.icon className="size-5 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground text-sm">{item.label}</div>
                      <div className="font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-5 gap-0">
                {shipmentTimeline.map((step, index) => (
                  <div className="relative flex flex-col items-center text-center" key={step.label}>
                    {index !== 0 && <span className="absolute top-5 right-1/2 left-0 h-1 bg-border" />}
                    {index !== shipmentTimeline.length - 1 && (
                      <span
                        className={cn(
                          "absolute top-5 right-0 left-1/2 h-1 bg-border",
                          (step.done || step.active) && "bg-primary",
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-10 grid size-11 place-items-center rounded-full border bg-card text-muted-foreground",
                        step.done && "border-primary text-primary",
                        step.active && "bg-primary text-primary-foreground",
                      )}
                    >
                      {step.done ? (
                        <Check className="size-5" />
                      ) : step.active ? (
                        <Truck className="size-5" />
                      ) : (
                        <Box className="size-4" />
                      )}
                    </div>
                    <div className={cn("mt-2 font-medium", step.active && "text-primary")}>{step.label}</div>
                    <div className="mt-1 text-muted-foreground text-sm">{step.time}</div>
                    <div className="text-muted-foreground text-sm">{step.place}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-[1fr_1fr_1.35fr_auto] items-center gap-5 rounded-xl border bg-muted/20 p-4">
                <div>
                  <div className="text-muted-foreground text-sm">Origin</div>
                  <div className="font-medium text-lg">Jakarta, Indonesia</div>
                  <div className="text-muted-foreground text-sm">May 12, 07:20 AM</div>
                </div>
                <div className="flex items-center gap-5 text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <ArrowRight />
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Destination</div>
                  <div className="font-medium text-lg">Singapore, Singapore</div>
                  <div className="text-muted-foreground text-sm">May 12, 08:45 AM</div>
                </div>
                <div className="flex items-center gap-5 border-l pl-5">
                  <div>
                    <div className="text-muted-foreground text-sm">Shipment ID</div>
                    <div className="mt-2 flex items-center gap-2 font-medium text-xl">
                      NXR-2026-0712 <Copy className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Button className="h-14 px-7">
                    View Details
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="analytics">
              <div className="grid h-full place-items-center rounded-md border border-dashed text-muted-foreground text-sm">
                Analytics view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="routes">
              <div className="grid h-full place-items-center rounded-md border border-dashed text-muted-foreground text-sm">
                Routes view coming soon.
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
