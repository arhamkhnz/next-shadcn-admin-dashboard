"use client";

import { DataTable } from "@/components/data-table/data-table";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";

import { columns } from "./columns";

export function ServiceList() {
  const services = useServiceStore((state) => state.services);

  return (
    <div>
      <DataTable columns={columns} data={services} />
    </div>
  );
}
