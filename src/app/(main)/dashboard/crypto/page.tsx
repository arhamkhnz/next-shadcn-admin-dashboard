import { Wallet } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { HoldingsStrip } from "./_components/holdings-strip";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight">Crypto overview</h1>
          <p className="text-muted-foreground text-sm">Your portfolio, market prices, and recent activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="USD">
            <SelectTrigger size="sm" aria-label="Display currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR" disabled>
                  EUR
                </SelectItem>
                <SelectItem value="GBP" disabled>
                  GBP
                </SelectItem>
                <SelectItem value="INR" disabled>
                  INR
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" type="button">
            <Wallet data-icon="inline-start" />
            Connect wallet
          </Button>
        </div>
      </div>
      <HoldingsStrip />
    </div>
  );
}
