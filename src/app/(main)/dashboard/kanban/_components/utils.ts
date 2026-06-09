import type { BoardState, ColumnId, Deal } from "./types";
import { columnIds } from "./types";

export function isColumnId(id: string): id is ColumnId {
  return columnIds.includes(id as ColumnId);
}

export function findColumnId(board: BoardState, id: string): ColumnId | undefined {
  if (isColumnId(id)) return id;
  return columnIds.find((columnId) => board[columnId].some((deal) => deal.id === id));
}

export function findDeal(board: BoardState, id: string) {
  for (const columnId of columnIds) {
    const deal = board[columnId].find((item) => item.id === id);
    if (deal) return deal;
  }
  return undefined;
}

export function getColumnTotal(deals: Deal[]) {
  return deals.reduce((total, deal) => total + deal.amount, 0);
}
