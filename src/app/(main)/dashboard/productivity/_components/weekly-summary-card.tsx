import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function WeeklySummaryCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>This Week</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">You’re doing great. Keep the momentum going.</p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">4 of 6 goals completed</div>
          <Progress value={66} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
