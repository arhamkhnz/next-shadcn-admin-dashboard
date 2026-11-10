import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function WeeklySummaryCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Esta semana</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Ver todas
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">Você está indo muito bem. Mantenha o ritmo.</p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">4 de 6 metas concluídas</div>
          <Progress value={66} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
