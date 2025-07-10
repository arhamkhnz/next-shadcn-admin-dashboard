"use client";

import { Plus } from "lucide-react";
import { siApple, siPaypal, siOpenai, siVercel, siFigma } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, cn } from "@/lib/utils";

function ChipSVG() {
  return (
    <svg enableBackground="new 0 0 132 92" viewBox="0 0 132 92" xmlns="http://www.w3.org/2000/svg" className="w-14">
      <title>Chip</title>
      <rect x="0.5" y="0.5" width="131" height="91" rx="15" className="fill-accent stroke-accent" />
      <rect x="9.5" y="9.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="9.5" y="61.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="9.5" y="35.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="9.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="61.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="35.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
    </svg>
  );
}

const recentPayments = [
  {
    id: 1,
    icon: siPaypal,
    title: "Advance Payment",
    subtitle: "Received via PayPal for Website Project",
    type: "credit",
    amount: 1200,
    date: "Jul 8",
  },
  {
    id: 2,
    icon: siOpenai,
    title: "ChatGPT Subscription",
    subtitle: "OpenAI monthly subscription",
    type: "debit",
    amount: 20,
    date: "Jul 7",
  },
  {
    id: 3,
    icon: siVercel,
    title: "Vercel Team Subscription",
    subtitle: "Vercel cloud hosting charges",
    type: "debit",
    amount: 160,
    date: "Jul 4",
  },
  {
    id: 4,
    icon: siFigma,
    title: "Figma Pro",
    subtitle: "Figma professional plan",
    type: "debit",
    amount: 35,
    date: "Jul 2",
  },
];

export function AccountOverview() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="items-center">
        <CardTitle>My Cards</CardTitle>
        <CardDescription>Your card summary, balance, and recent transactions in one view.</CardDescription>
        <CardAction>
          <Button size="icon" variant="outline">
            <Plus className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs className="gap-4" defaultValue="virtual">
          <TabsList className="w-full">
            <TabsTrigger value="virtual">Virtual</TabsTrigger>
            <TabsTrigger value="physical" disabled>
              Physical
            </TabsTrigger>
          </TabsList>
          <TabsContent value="virtual">
            <div className="space-y-4">
              <div className="bg-primary relative aspect-8/5 w-full max-w-96 overflow-hidden rounded-xl perspective-distant">
                <div className="absolute top-6 left-6">
                  <SimpleIcon icon={siApple} className="fill-primary-foreground size-8" />
                </div>
                <div className="absolute top-1/2 w-full -translate-y-1/2">
                  <div className="flex items-end justify-between px-6">
                    <span className="text-accent font-mono text-lg leading-none font-medium tracking-wide uppercase">
                      Arham Khan
                    </span>
                    <ChipSVG />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span className="font-medium tabular-nums">•••• •••• 5416</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium tabular-nums">06/09</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CVC</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spending Limit</span>
                  <span className="font-medium tabular-nums">$62,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className="font-medium tabular-nums">$13,100.06</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" size="sm">
                  Freeze Card
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Set Limit
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  More
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h6 className="text-muted-foreground text-sm uppercase">Recent Payments</h6>

                <div className="space-y-4">
                  {recentPayments.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                        <SimpleIcon icon={transaction.icon} className="size-5" />
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{transaction.subtitle}</p>
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm leading-none font-medium tabular-nums",
                              transaction.type === "debit" ? "text-destructive" : "text-green-500",
                            )}
                          >
                            {formatCurrency(transaction.amount, { noDecimals: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="sm" variant="outline">
                  View All Payments
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="physical">Physical card details are currently unavailable</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
