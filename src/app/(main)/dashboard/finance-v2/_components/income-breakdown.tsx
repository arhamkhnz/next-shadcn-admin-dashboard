import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function IncomeBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Income breakdown</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <section className="col-span-2 flex">
          <Separator
            orientation="vertical"
            className="h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
          />
          <div className="flex min-h-24 flex-1 flex-col justify-between">
            <div className="flex flex-col gap-1 px-1">
              <p className="text-muted-foreground text-xs leading-none">Part-Time</p>
              <div className="font-heading text-lg leading-none tracking-tight">$1,412.00</div>
            </div>
            <div className="h-5 rounded-sm bg-chart-3" />
          </div>
        </section>

        {/* <section className="flex gap-[0.5px]">
          <Separator
            orientation="vertical"
            className="h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
          />
          <div className="flex min-h-24 flex-1 flex-col justify-between">
            <div className="flex flex-col gap-1 px-1">
              <p className="text-muted-foreground text-xs leading-none">Paycheck</p>
              <div className="font-heading text-lg leading-none tracking-tight">$1,173.00</div>
            </div>
            <div className="h-5 rounded-sm bg-chart-3/75" />
          </div>
        </section> */}

        <section className="flex gap-[0.5px]">
          <Separator
            orientation="vertical"
            className="h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
          />
          <div className="flex min-h-24 flex-1 flex-col justify-between">
            <div className="flex flex-col gap-1 px-1">
              <p className="text-muted-foreground text-xs leading-none">Gift</p>
              <div className="font-heading text-lg leading-none tracking-tight">$765.00</div>
            </div>
            <div className="h-5 rounded-sm bg-chart-3/50" />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
