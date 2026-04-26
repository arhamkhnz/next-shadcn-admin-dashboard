"use client";

import { addDays, format, set } from "date-fns";
import { ChevronRight, Zap } from "lucide-react";
import { siClaude, siLinear, siResend } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

const transactions = [
  {
    id: 1,
    title: "Claude Pro Subscription",
    date: format(set(addDays(new Date(), 2), { hours: 14, minutes: 45 }), "hh.mm a '•' MMMM dd, yyyy"),
    icon: siClaude,
  },
  {
    id: 2,
    title: "Resend Pro Team",
    date: format(set(addDays(new Date(), 4), { hours: 7, minutes: 0 }), "hh.mm a '•' MMMM dd, yyyy"),
    icon: siResend,
  },
  {
    id: 3,
    title: "Linear Plus Plan",
    date: format(set(addDays(new Date(), 10), { hours: 7, minutes: 0 }), "hh.mm a '•' MMMM dd, yyyy"),
    icon: siLinear,
  },
];

export function UpcomingTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Upcoming Bills & Payments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-baseline text-3xl leading-none tracking-tight">
              <span className="font-normal">$1,245</span>
              <span className="text-muted-foreground text-xl">.00</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-none">
              You have <span className="font-medium text-foreground">3</span> bills due this month
            </p>
          </div>
          <div className="flex w-max items-center gap-2 rounded-md border border-border bg-muted/70 px-2 py-1.5 text-sm">
            <Zap className="size-4 fill-primary text-primary" />
            <span className="text-muted-foreground">
              Autopay will process <span className="font-medium text-foreground">$145.00</span> today
            </span>
          </div>
        </div>

        <ItemGroup>
          {transactions.map((transaction) => (
            <Item key={transaction.id} variant="outline" size="xs">
              <ItemMedia>
                <div className="grid size-9 place-items-center rounded-md border bg-background">
                  <SimpleIcon icon={transaction.icon} />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{transaction.title}</ItemTitle>
                <ItemDescription>{transaction.date}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-5 text-muted-foreground" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
