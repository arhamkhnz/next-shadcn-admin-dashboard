import { BadgeDollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl tracking-tight">Personal Finance Overview</h1>
        <p className="text-muted-foreground">
          Track your monthly income, cash available, upcoming bills, and savings progress in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="size-4 text-muted-foreground" />
                <span>Monthly income</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full bg-card">
            <div className="font-heading text-3xl leading-none tracking-tight">$4,560</div>
          </CardContent>
        </Card>

        {/* <Card className="gap-0 rounded-2xl bg-background shadow-xs">
          <CardHeader className="items-center gap-3 border-b bg-muted/30 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletMinimal className="size-4 text-muted-foreground" />
              <span>Available cash</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5">
            <div className="font-heading text-4xl leading-none tracking-tight">$3,310</div>
          </CardContent>
          <CardFooter>
            <span className="font-medium text-muted-foreground">Ready to transfer</span>
          </CardFooter>
        </Card>

        <Card className="gap-0 rounded-2xl bg-background shadow-xs">
          <CardHeader className="items-center gap-3 border-b bg-muted/30 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-muted-foreground" />
              <span>Upcoming bills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5">
            <div className="font-heading text-4xl leading-none tracking-tight">$1,250</div>
          </CardContent>
          <CardFooter>
            <span className="font-medium text-muted-foreground">Due in the next 7 days</span>
          </CardFooter>
        </Card>

        <Card className="gap-0 rounded-2xl bg-background shadow-xs">
          <CardHeader className="items-center gap-3 border-b bg-muted/30 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PiggyBank className="size-4 text-muted-foreground" />
              <span>Emergency fund</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5">
            <div className="font-heading text-4xl leading-none tracking-tight">$8,900</div>
          </CardContent>
          <CardFooter>
            <span className="font-medium text-muted-foreground">4.2 months covered</span>
          </CardFooter>
        </Card>

        <Card className="gap-0 rounded-2xl bg-background shadow-xs">
          <CardHeader className="items-center gap-3 border-b bg-muted/30 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span>Investment gains</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5">
            <div className="font-heading text-4xl leading-none tracking-tight">+$620</div>
          </CardContent>
          <CardFooter className="bg-green-500/5 text-green-700 dark:bg-green-500/10 dark:text-green-300">
            <span className="font-medium">Up 5.4% this month</span>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  );
}
