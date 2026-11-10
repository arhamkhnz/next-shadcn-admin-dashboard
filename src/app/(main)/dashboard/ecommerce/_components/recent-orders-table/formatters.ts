import type React from "react";

import type { OrderFilter } from "./schema";

export function formatOrderCount(filter: OrderFilter, count: number) {
  const orderLabel = count === 1 ? "pedido" : "pedidos";
  const formattedCount = count.toLocaleString("pt-BR");

  if (filter === "Todos") {
    return `${formattedCount} ${orderLabel}`;
  }

  if (filter === "Precisa de ação") {
    return count === 1
      ? `${formattedCount} ${orderLabel} precisa de ação`
      : `${formattedCount} ${orderLabel} precisam de ação`;
  }

  if (filter === "Devoluções") {
    return `${formattedCount} ${count === 1 ? "devolução" : "devoluções"}`;
  }

  return `${formattedCount} ${orderLabel} ${filter.toLowerCase()}s`;
}

export function formatSelectedOrderCount(count: number) {
  const orderLabel = count === 1 ? "pedido" : "pedidos";

  return `${count.toLocaleString("pt-BR")} ${orderLabel} selecionado${count === 1 ? "" : "s"}`;
}

export function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}
