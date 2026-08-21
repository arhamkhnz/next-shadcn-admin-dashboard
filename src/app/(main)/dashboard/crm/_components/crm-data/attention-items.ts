import { differenceInCalendarDays, isWithinInterval, subDays } from "date-fns";

import type { OpportunityRow } from "../opportunities-table/schema";
import { companyByName } from "./companies";
import { parseOpportunityDate } from "./opportunities";
import { today, type WindowRange } from "./period";
import { type AttentionItem, attentionItemSchema } from "./schema";

const staticFixtures = [
  {
    id: "att-1",
    kind: "overdue-activity",
    title: "Follow-up call",
    companyName: "Asteron Bioworks",
    contact: "Cameron Ruiz",
    ownerId: "arham",
    reason: "Follow-up call is overdue",
    daysAgo: 2,
    priority: "High",
    action: "Follow up",
  },
  {
    id: "att-2",
    kind: "overdue-activity",
    title: "Revised proposal",
    companyName: "BlueHaven Systems",
    contact: "Nina Petrova",
    ownerId: "ammar",
    reason: "Proposal revision is overdue",
    daysAgo: 1,
    priority: "High",
    action: "Follow up",
  },
  {
    id: "att-3",
    kind: "lead-follow-up",
    title: "Qualify follow-up",
    companyName: "Granite Studios",
    contact: "Felix Bauer",
    ownerId: "lucas",
    reason: "Lead has not replied to outreach",
    daysAgo: 5,
    priority: "Medium",
    action: "Follow up",
  },
  {
    id: "att-4",
    kind: "lead-follow-up",
    title: "Lead follow-up",
    companyName: "Kestrel Commerce",
    contact: "Rosa Delgado",
    ownerId: "sofia",
    reason: "Lead follow-up is due",
    daysAgo: 7,
    priority: "Medium",
    action: "Follow up",
  },
];

const staticAttentionItems: AttentionItem[] = staticFixtures.map((item) =>
  attentionItemSchema.parse({
    ...item,
    date: subDays(today, item.daysAgo),
    detail:
      item.kind === "overdue-activity"
        ? `Overdue ${item.daysAgo} day${item.daysAgo === 1 ? "" : "s"}`
        : `Last touched ${item.daysAgo} days ago`,
  }),
);

function toAttentionItem(opportunity: OpportunityRow, kind: "stale-deal" | "deal-at-risk"): AttentionItem | null {
  const company = companyByName.get(opportunity.account);

  if (kind === "stale-deal") {
    const inactiveDays = differenceInCalendarDays(today, parseOpportunityDate(opportunity.lastActivity));
    if (inactiveDays < 14) {
      return null;
    }
    return attentionItemSchema.parse({
      id: `stale-${opportunity.id}`,
      kind,
      title: opportunity.account,
      companyName: opportunity.account,
      contact: company?.primaryContact ?? "",
      ownerId: opportunity.ownerId,
      reason: "No recent activity on this deal",
      detail: `Inactive ${inactiveDays} days`,
      date: parseOpportunityDate(opportunity.lastActivity),
      priority: opportunity.value >= 50000 ? "High" : "Medium",
      action: "Review",
    });
  }

  const daysToClose = differenceInCalendarDays(parseOpportunityDate(opportunity.expectedClose), today);
  if (opportunity.health !== "At Risk" || daysToClose < 0 || daysToClose > 30) {
    return null;
  }
  return attentionItemSchema.parse({
    id: `risk-${opportunity.id}`,
    kind,
    title: opportunity.account,
    companyName: opportunity.account,
    contact: company?.primaryContact ?? "",
    ownerId: opportunity.ownerId,
    reason: "Deal is at risk",
    detail: `Closes in ${daysToClose} days`,
    date: parseOpportunityDate(opportunity.expectedClose),
    priority: "High",
    action: "Review",
  });
}

export function buildAttentionItems(
  opportunities: OpportunityRow[],
  window: WindowRange,
  ownerId: string | null,
): AttentionItem[] {
  const ownerMatches = (item: AttentionItem) => ownerId === null || item.ownerId === ownerId;

  const staticItems = staticAttentionItems.filter(
    (item) => ownerMatches(item) && isWithinInterval(item.date, { start: window.start, end: window.end }),
  );

  const staleItems = opportunities
    .map((opportunity) => toAttentionItem(opportunity, "stale-deal"))
    .filter((item): item is AttentionItem => item !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 2);

  const atRiskItems = opportunities
    .map((opportunity) => toAttentionItem(opportunity, "deal-at-risk"))
    .filter((item): item is AttentionItem => item !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 2);

  return [...staticItems, ...staleItems, ...atRiskItems].sort((a, b) => {
    const priorityWeight: Record<AttentionItem["priority"], number> = { High: 0, Medium: 1, Low: 2 };
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });
}
