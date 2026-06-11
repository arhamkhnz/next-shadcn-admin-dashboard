import { columnIds } from "./data";
import type { BoardState, ColumnId } from "./types";

export function isColumnId(id: string): id is ColumnId {
  return columnIds.includes(id as ColumnId);
}

export function findColumnId(board: BoardState, id: string): ColumnId | undefined {
  if (isColumnId(id)) return id;
  return columnIds.find((columnId) => board[columnId].some((task) => task.id === id));
}

export function findTask(board: BoardState, id: string) {
  for (const columnId of columnIds) {
    const task = board[columnId].find((item) => item.id === id);
    if (task) return task;
  }
  return undefined;
}
