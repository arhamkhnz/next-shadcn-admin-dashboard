"use client";

import type * as React from "react";

import { BarChart3 } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface ReportChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  heightClass?: string;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  summary: string;
  config: ChartConfig;
  children: React.ReactElement;
  className?: string;
}

export function ReportChartCard({
  title,
  description,
  action,
  heightClass = "h-72",
  isEmpty,
  emptyTitle = "No data in this period",
  emptyDescription = "No records match the current report filters.",
  summary,
  config,
  children,
  className,
}: ReportChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className={cn("flex w-full items-center justify-center", heightClass)}>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BarChart3 />
                </EmptyMedia>
                <EmptyTitle>{emptyTitle}</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>{emptyDescription}</EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <ChartContainer config={config} className={cn("w-full", heightClass)}>
              {children}
            </ChartContainer>
            <p className="sr-only">{summary}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
