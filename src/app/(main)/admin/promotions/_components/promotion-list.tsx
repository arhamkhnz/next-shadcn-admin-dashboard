"use client";

import { DataTable } from "@/components/data-table/data-table";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";

import { columns } from "./columns";

export function PromotionList() {
  const promotions = usePromotionStore((state) => state.promotions);

  return (
    <div>
      <DataTable columns={columns} data={promotions} />
    </div>
  );
}
