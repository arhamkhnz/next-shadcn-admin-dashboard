"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchActions } from "./branch-actions";

const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
  if (!locationStr) return undefined;
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  return undefined;
};

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location_text",
    header: "Location",
    cell: ({ row }) => {
      const locationStr = row.getValue("location_text");
      const location = parseLocation(locationStr);

      if (!location) {
        return <span className="text-muted-foreground">Not set</span>;
      }

      const { lat, lng } = location;
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      return (
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <Button variant="outline" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            View on Map
          </Button>
        </a>
      );
    },
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const services = row.original.services ?? [];
      if (services.length === 0) {
        return <span className="text-muted-foreground">No services</span>;
      }
      return (
        <div className="flex max-w-xs flex-wrap gap-1">
          {services.map((service: any) => (
            <Badge key={service.id} variant="secondary" className="font-normal">
              {service.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      return <BranchActions branch={branch} />;
    },
  },
];
