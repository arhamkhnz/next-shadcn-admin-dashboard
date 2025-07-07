"use client";

import { FunnelChart, Funnel, LabelList } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
  CardDescription,
} from "@/components/ui/card";

export function OverviewCardsV4() {
  return (
    <div className="grid grid-cols-2 gap-4 *:data-[slot=card]:min-h-52 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Track and manage your latest leads and their status.</CardDescription>
        </CardHeader>
        <CardContent className="size-full"></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales transactions recorded in the system.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
