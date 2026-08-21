"use client";

import type * as React from "react";

import { ArrowUpRight, Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ComparisonResult } from "./report-data/report-selectors";

const comparisonBadgeClass: Record<ComparisonResult["kind"], string> = {
  up: "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300",
  down: "border-destructive/20 bg-destructive/10 text-destructive",
  flat: "border-border bg-muted text-muted-foreground",
  new: "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
  "no-data": "border-border bg-muted text-muted-foreground",
};

const comparisonIcons: Record<ComparisonResult["kind"], React.ReactNode> = {
  up: <TrendingUp />,
  down: <TrendingDown />,
  new: <Plus />,
  flat: <Minus />,
  "no-data": null,
};

export function ComparisonBadge({ comparison }: { comparison: ComparisonResult }) {
  return (
    <Badge variant="outline" className={cn("gap-1", comparisonBadgeClass[comparison.kind])}>
      {comparisonIcons[comparison.kind]}
      {comparison.label}
    </Badge>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  caption?: string;
  comparison?: ComparisonResult;
  onDrillDown?: () => void;
  drillDownLabel?: string;
}

export function MetricCard({ label, value, caption, comparison, onDrillDown, drillDownLabel }: MetricCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardAction className="flex items-center gap-1">
          {comparison ? <ComparisonBadge comparison={comparison} /> : null}
          {onDrillDown ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-6"
              onClick={onDrillDown}
              aria-label={drillDownLabel ?? `View details for ${label}`}
            >
              <ArrowUpRight className="size-3.5" />
            </Button>
          ) : null}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="font-medium text-2xl tabular-nums leading-none tracking-tight">{value}</div>
        {caption ? <p className="text-muted-foreground text-xs leading-snug">{caption}</p> : null}
      </CardContent>
    </Card>
  );
}
