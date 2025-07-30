"use client";

import { PromotionList } from "./_components/promotion-list";

export default function PromotionsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
      <PromotionList />
    </div>
  );
}
