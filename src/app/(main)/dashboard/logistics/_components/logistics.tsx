"use client";

import * as React from "react";

import { shipments } from "./shipment-data";
import { ShipmentDetails } from "./shipment-details";
import { ShipmentList } from "./shipment-list";

export function LogisticsDashboard() {
  const [selectedShipmentId, setSelectedShipmentId] = React.useState(shipments[0]?.id ?? null);
  const selectedShipment = shipments.find((shipment) => shipment.id === selectedShipmentId) ?? shipments[0] ?? null;

  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] grid-cols-12 divide-x overflow-hidden"
    >
      <div className="col-span-4 h-full overflow-hidden">
        <ShipmentList
          shipments={shipments}
          selectedShipmentId={selectedShipmentId}
          onSelectShipment={setSelectedShipmentId}
        />
      </div>
      <div className="col-span-8 h-full overflow-hidden">
        <ShipmentDetails shipment={selectedShipment} />
      </div>
    </div>
  );
}
