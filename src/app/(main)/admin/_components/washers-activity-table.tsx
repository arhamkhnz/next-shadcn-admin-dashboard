"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Washer } from "@/app/(main)/admin/washers/_components/types";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

const columns: ColumnDef<Washer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
];

export function WashersActivityTable() {
  const { washers } = useWasherStore();
  const table = useDataTableInstance({
    data: washers,
    columns,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Washers Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable table={table} columns={columns} />
      </CardContent>
    </Card>
  );
}
