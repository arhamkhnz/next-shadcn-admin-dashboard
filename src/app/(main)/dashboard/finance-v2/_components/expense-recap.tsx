import { CreditCard, Landmark, Subtitles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ExpenseRecap() {
  return (
    <Card className="xl:col-span-4">
      <CardHeader>
        <CardTitle className="leading-none">Expense Recap</CardTitle>
        <CardAction>
          <Select defaultValue="weekly">
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="relative mx-auto size-58">
          <svg aria-label="Expense category split" className="size-full -rotate-90" viewBox="0 0 120 120">
            <circle className="stroke-muted/50" cx="60" cy="60" fill="none" r="44" strokeWidth="16" />
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="44"
              stroke="var(--chart-1)"
              strokeDasharray="130 276"
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="44"
              stroke="var(--chart-2)"
              strokeDasharray="74 276"
              strokeDashoffset="-146"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="44"
              stroke="var(--chart-3)"
              strokeDasharray="72 276"
              strokeDashoffset="-236"
              strokeLinecap="round"
              strokeWidth="16"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="font-heading text-2xl leading-none tracking-tight">12% Higher</div>
            <p className="text-muted-foreground text-xs">than last month</p>
            <button className="font-medium text-chart-1 text-sm" type="button">
              See more
            </button>
          </div>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-sm shadow-sm ring-1 ring-foreground/10">
            27%
          </div>
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 rounded-full bg-background px-3 py-1 text-sm shadow-sm ring-1 ring-foreground/10">
            26%
          </div>
          <div className="absolute bottom-4 left-8 rounded-full bg-background px-3 py-1 text-sm shadow-sm ring-1 ring-foreground/10">
            47%
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-2xl leading-none tracking-tight">Breakdown</h3>

          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg bg-chart-1/10 text-chart-1">
                  <Subtitles className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="font-medium leading-none">Subscriptions</div>
                <p className="text-muted-foreground text-xs">Netflix and 5 more</p>
              </div>
            </div>
            <div className="font-medium tabular-nums">$430.20</div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg bg-chart-2/10 text-chart-2">
                  <CreditCard className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="font-medium leading-none">Fixed expenses</div>
                <p className="text-muted-foreground text-xs">Rent, utilities, insurance</p>
              </div>
            </div>
            <div className="font-medium tabular-nums">$712.41</div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 rounded-lg">
                <AvatarFallback className="rounded-lg bg-chart-3/10 text-chart-3">
                  <Landmark className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="font-medium leading-none">Transfers</div>
                <p className="text-muted-foreground text-xs">Savings and debt payments</p>
              </div>
            </div>
            <div className="font-medium tabular-nums">$720.34</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
