import { isWithinInterval } from "date-fns";

import opportunitiesData from "../opportunities-table/data.json";
import { type OpportunityRow, opportunitiesSchema } from "../opportunities-table/schema";
import type { WindowRange } from "./period";

export const opportunityRows: OpportunityRow[] = opportunitiesSchema.parse(opportunitiesData);

export function parseOpportunityDate(isoDate: string): Date {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function filterOpportunities(
  rows: OpportunityRow[],
  range: WindowRange,
  ownerId: string | null,
): OpportunityRow[] {
  return rows.filter(
    (row) =>
      (ownerId === null || row.ownerId === ownerId) &&
      isWithinInterval(parseOpportunityDate(row.createdAt), { start: range.start, end: range.end }),
  );
}

export function sumOpportunityValue(rows: OpportunityRow[]): number {
  return rows.reduce((sum, row) => sum + row.value, 0);
}
