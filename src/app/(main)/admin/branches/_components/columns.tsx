/* eslint-disable complexity */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Phone, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { BranchActions } from "./branch-actions";
import { Branch } from "./types";

// Helper to parse location string
const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
  if (!locationStr) return undefined;

  // Handle stringified JSON format
  if (typeof locationStr === "string" && locationStr.startsWith("{")) {
    try {
      const parsed = JSON.parse(locationStr);
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        return { lat: parsed.lat, lng: parsed.lng };
      }
    } catch (e) {
      // Not a JSON string, continue to other formats
    }
  }

  // Check for WKT format (POINT(lng lat))
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }

  // Handle GeoJSON format if stored as string
  if (typeof locationStr === "string" && locationStr.includes('"type":"Point"')) {
    try {
      const parsed = JSON.parse(locationStr);
      if (parsed.type === "Point" && Array.isArray(parsed.coordinates) && parsed.coordinates.length === 2) {
        return { lng: parsed.coordinates[0], lat: parsed.coordinates[1] };
      }
    } catch (e) {
      // Not a valid GeoJSON string
    }
  }

  return undefined;
};

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "franchise",
    header: "Franchise",
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => {
      const branch = row.original;
      return branch.city ?? <span className="text-muted-foreground">Not set</span>;
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => {
      const branch = row.original;
      return branch.phone_number ? (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{branch.phone_number}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Not set</span>
      );
    },
  },
  {
    accessorKey: "ratings",
    header: "Rating",
    cell: ({ row }) => {
      const branch = row.original;
      return branch.ratings ? (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{branch.ratings.toFixed(1)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Not rated</span>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const branch = row.original;

      // If no filter selected, show all
      if (filterValue === undefined || filterValue.length === 0) return true;

      const rating = branch.ratings ?? 0;

      // Check if the rating matches any of the selected filters
      return filterValue.some((filter) => {
        if (filter === "5") return rating >= 5;
        if (filter === "4+") return rating >= 4 && rating < 5;
        if (filter === "3+") return rating >= 3 && rating < 4;
        if (filter === "<3") return rating < 3 && rating > 0;
        if (filter === "0") return rating === 0;
        return false;
      });
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const branch = row.original;
      const locationStr = branch.location;
      const location = parseLocation(locationStr);

      if (!location) {
        return <span className="text-muted-foreground">{locationStr ? "Invalid format" : "Not set"}</span>;
      }

      const { lat, lng } = location;
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      const coordinateText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer font-mono text-sm">{coordinateText}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view on map</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="h-8 px-2">
              <MapPin className="h-4 w-4" />
            </Button>
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const branch = row.original;

      // Show loading state if services haven't loaded yet
      if (branch.services === undefined) {
        return <span className="text-muted-foreground">Loading...</span>;
      }

      const services = branch.services ?? [];
      if (services.length === 0) {
        return <span className="text-muted-foreground">No services</span>;
      }
      return (
        <div className="flex max-w-xs flex-wrap gap-1">
          {services.map((service) => (
            <Badge key={service.id} variant="secondary" className="font-normal">
              {service.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "serviceCount",
    header: "Service Count",
    cell: ({ row }) => {
      const branch = row.original;

      // Show loading state if services haven't loaded yet
      if (branch.services === undefined) {
        return <span className="text-muted-foreground">Loading...</span>;
      }

      const serviceCount = branch.services?.length ?? 0;
      return <span>{serviceCount}</span>;
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const branch = row.original;

      // If services haven't loaded yet, don't filter
      if (branch.services === undefined) return true;

      const serviceCount = branch.services?.length ?? 0;
      const serviceCountStr = serviceCount.toString();

      // If no filter selected, show all
      if (filterValue === undefined || filterValue.length === 0) return true;

      // Check if the service count matches any of the selected filters
      return filterValue.some((filter) => {
        if (filter === "0") return serviceCount === 0;
        if (filter === "1-2") return serviceCount >= 1 && serviceCount <= 2;
        if (filter === "3-5") return serviceCount >= 3 && serviceCount <= 5;
        if (filter === "6-10") return serviceCount >= 6 && serviceCount <= 10;
        if (filter === "10+") return serviceCount > 10;
        // For exact matches (when we show individual counts)
        return filter === serviceCountStr;
      });
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
