"use client";

import * as React from "react";

import { shipments } from "./data";
import { MainPanel } from "./main-panel";
import { ShipmentsPanel } from "./shipments-panel";

export function Logistics() {
  const [selectedShipmentId, setSelectedShipmentId] = React.useState(shipments[0]?.id ?? null);
  const selectedShipment = shipments.find((shipment) => shipment.id === selectedShipmentId) ?? shipments[0] ?? null;

  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] grid-cols-12 divide-x overflow-hidden"
    >
      <div className="col-span-4 h-full overflow-hidden">
        <ShipmentsPanel
          shipments={shipments}
          selectedShipmentId={selectedShipmentId}
          onSelectShipment={setSelectedShipmentId}
        />
      </div>
      <div className="col-span-8 h-full overflow-hidden">
        <MainPanel shipment={selectedShipment} />
      </div>
    </div>
  );
}
