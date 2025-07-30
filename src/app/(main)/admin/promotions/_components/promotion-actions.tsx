"use client";

import { Button } from "@/components/ui/button";
import { Promotion } from "@/types/database";

export function PromotionActions({ promotion }: { promotion: Promotion }) {
  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => alert(`Editing ${promotion.code}`)}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={() => alert(`Deleting ${promotion.code}`)}>
        Delete
      </Button>
    </div>
  );
}
