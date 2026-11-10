import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

export function FinanceNotification() {
  return (
    <Item className="rounded-xl" variant="outline">
      <ItemMedia variant="icon">
        <TrendingUp />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Score de crédito atualizado</ItemTitle>
        <ItemDescription>Sua pontuação aumentou 14 pontos, para 782.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Ver detalhes
        </Button>
      </ItemActions>
    </Item>
  );
}
