import { formatCurrency } from "@/lib/utils";

import type { OpportunityRow } from "../opportunities-table/schema";
import { sumOpportunityValue } from "./opportunities";
import type { FlowTotals } from "./qualified-flow";
import { currentSalesOwnerId } from "./sales-team";

export interface KpiMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  previousLabel: string;
}

export interface MetricInputs {
  currentOpportunities: OpportunityRow[];
  previousOpportunities: OpportunityRow[];
  currentFlow: FlowTotals;
  previousFlow: FlowTotals;
  comparisonLabel: string;
}

function ratePercent(qualified: number, created: number): number {
  if (created <= 0) {
    return 0;
  }
  return (qualified / created) * 100;
}

function percentLabel(value: number): string {
  return `${value.toFixed(1)}%`;
}

function signedPercentLabel(delta: number): string {
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

function trendFromChange(change: number): KpiMetric["trend"] {
  if (change > 0.05) return "up";
  if (change < -0.05) return "down";
  return "flat";
}

export function resolveOwnerFilter(filter: string): string | null {
  if (filter === "all") {
    return null;
  }
  if (filter === "me") {
    return currentSalesOwnerId;
  }
  return filter;
}

export function computeKpiMetrics(inputs: MetricInputs): KpiMetric[] {
  const { currentOpportunities, previousOpportunities, currentFlow, previousFlow, comparisonLabel } = inputs;

  const pipelineValue = sumOpportunityValue(currentOpportunities);
  const previousPipelineValue = sumOpportunityValue(previousOpportunities);
  const pipelineChange =
    previousPipelineValue > 0
      ? ((pipelineValue - previousPipelineValue) / previousPipelineValue) * 100
      : pipelineValue > 0
        ? null
        : 0;

  const qualifiedRate = ratePercent(currentFlow.qualified, currentFlow.created);
  const previousQualifiedRate = ratePercent(previousFlow.qualified, previousFlow.created);
  const qualifiedDelta = qualifiedRate - previousQualifiedRate;

  const leadToDealRate = ratePercent(currentOpportunities.length, currentFlow.created);
  const previousLeadToDealRate = ratePercent(previousOpportunities.length, previousFlow.created);
  const leadToDealDelta = leadToDealRate - previousLeadToDealRate;

  const openDelta = currentOpportunities.length - previousOpportunities.length;

  return [
    {
      label: "Lead Pipeline Value",
      value: formatCurrency(pipelineValue, { noDecimals: true }),
      trend: pipelineChange === null ? "up" : trendFromChange(pipelineChange),
      trendLabel:
        pipelineChange === null
          ? "New"
          : pipelineChange === 0
            ? "0%"
            : `${pipelineChange > 0 ? "+" : ""}${pipelineChange.toFixed(1)}%`,
      previousLabel: `${formatCurrency(previousPipelineValue, { noDecimals: true })} ${comparisonLabel}`,
    },
    {
      label: "Qualified Lead Rate",
      value: percentLabel(qualifiedRate),
      trend: trendFromChange(qualifiedDelta),
      trendLabel: signedPercentLabel(qualifiedDelta),
      previousLabel: `${percentLabel(previousQualifiedRate)} ${comparisonLabel}`,
    },
    {
      label: "Open Opportunities",
      value: String(currentOpportunities.length),
      trend: trendFromChange(openDelta),
      trendLabel: `${openDelta > 0 ? "+" : ""}${openDelta}`,
      previousLabel: `${previousOpportunities.length} ${comparisonLabel}`,
    },
    {
      label: "Lead-to-Deal Rate",
      value: percentLabel(leadToDealRate),
      trend: trendFromChange(leadToDealDelta),
      trendLabel: signedPercentLabel(leadToDealDelta),
      previousLabel: `${percentLabel(previousLeadToDealRate)} ${comparisonLabel}`,
    },
  ];
}

export const MONTHLY_PROPOSAL_TARGET: Readonly<Record<string, number>> = {
  arham: 3,
  ammar: 3,
  sofia: 3,
  ethan: 2,
  nadia: 2,
  lucas: 2,
  isla: 2,
  kenji: 1,
};

export function getProposalTarget(ownerId: string | null, durationDays: number): number {
  const monthlyTarget =
    ownerId === null
      ? Object.values(MONTHLY_PROPOSAL_TARGET).reduce((sum, value) => sum + value, 0)
      : (MONTHLY_PROPOSAL_TARGET[ownerId] ?? 0);
  return Math.round((monthlyTarget * durationDays) / 30);
}

export function countProposalStage(rows: OpportunityRow[]): number {
  return rows.filter((row) => row.stage === "Proposal Sent" || row.stage === "Negotiation").length;
}
