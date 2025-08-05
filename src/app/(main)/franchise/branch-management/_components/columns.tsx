"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchActions } from "./branch-actions";

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
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
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      return <BranchActions branch={branch} />;
    },
  },
];
