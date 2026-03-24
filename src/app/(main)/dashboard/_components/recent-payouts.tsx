import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const payouts = [
  { date: "Mar 01, 2025", amount: "$167.42", platform: "Labelcaster" },
  { date: "Feb 01, 2025", amount: "$122.18", platform: "Labelcaster" },
  { date: "Jan 01, 2025", amount: "$96.40", platform: "Labelcaster" },
];

export function RecentPayouts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payouts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {payouts.map((payout) => (
          <div key={payout.date} className="space-y-1 border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">{payout.date}</p>
              <p className="font-medium">{payout.amount}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{payout.platform}</span>
              <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                Paid
              </Badge>
            </div>
          </div>
        ))}

        <Link href="/dashboard/royalties" className="inline-block text-sm text-muted-foreground transition-colors hover:text-foreground">
          View all →
        </Link>
      </CardContent>
    </Card>
  );
}
