import { startOfMonth, subMonths } from "date-fns";

import { today } from "./period";
import { salesOwners } from "./sales-team";
import { type QualifiedFlowEntry, qualifiedFlowEntrySchema } from "./schema";

const OWNER_MONTHLY_LEADS: Readonly<Record<string, number>> = {
  arham: 24,
  ammar: 21,
  sofia: 19,
  ethan: 17,
  nadia: 15,
  lucas: 14,
  isla: 13,
  kenji: 12,
};

const FLOW_MONTHS = 24;

function buildQualifiedFlow(): QualifiedFlowEntry[] {
  return salesOwners.flatMap((owner) =>
    Array.from({ length: FLOW_MONTHS }, (_, index) => {
      const monthOffset = FLOW_MONTHS - 1 - index;
      const baseLeads = OWNER_MONTHLY_LEADS[owner.id] ?? 6;
      const wave = (Math.sin(monthOffset * 0.75 + owner.id.length) + 1) / 2;
      const created = Math.round(baseLeads * (0.65 + 0.7 * wave));
      const qualified = Math.round(created * (0.26 + 0.08 * wave));
      const discoveryBooked = Math.round(qualified * (0.5 + 0.1 * wave));

      return qualifiedFlowEntrySchema.parse({
        ownerId: owner.id,
        monthOffset,
        date: startOfMonth(subMonths(today, monthOffset)),
        created,
        qualified,
        discoveryBooked,
      });
    }),
  );
}

export const qualifiedFlow = buildQualifiedFlow();

export interface FlowTotals {
  created: number;
  qualified: number;
  discoveryBooked: number;
}

export function sumFlowEntries(entries: QualifiedFlowEntry[]): FlowTotals {
  return entries.reduce<FlowTotals>(
    (totals, entry) => ({
      created: totals.created + entry.created,
      qualified: totals.qualified + entry.qualified,
      discoveryBooked: totals.discoveryBooked + entry.discoveryBooked,
    }),
    { created: 0, qualified: 0, discoveryBooked: 0 },
  );
}
