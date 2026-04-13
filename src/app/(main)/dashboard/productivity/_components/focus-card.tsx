import { BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FocusCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Focus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="text-3xl tracking-tight">90:00</div>
            <Button className="min-w-24">Start</Button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <BellOff className="size-3" />
            <span>No notifications · Full focus</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
