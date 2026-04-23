import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

export function FinanceNotification() {
  return (
    <Item className="rounded-xl" variant="outline">
      <ItemMedia variant="icon">
        <AlertCircle />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Bills due this week</ItemTitle>
        <ItemDescription>$1,250 scheduled against $12.8K available cash.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Review bills
        </Button>
      </ItemActions>
    </Item>
  );
}
