import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function IncomeBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Income sources</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-1 md:grid-cols-3">
        <section className="isolate flex gap-[0.5px]">
          <Separator
            orientation="vertical"
            className="mb-1 h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
          />
          <div className="flex min-h-24 flex-1 flex-col justify-between">
            <div className="flex min-w-0 flex-col gap-1 px-1">
              <p className="wrap-break-word text-muted-foreground text-xs leading-none">Primary salary · 68%</p>
              <div className="font-heading text-lg leading-none tracking-tight">$4,560.00</div>
            </div>
            <div className="-ml-0.5 h-5 rounded-sm bg-chart-3" />
          </div>
        </section>

        <section className="isolate flex gap-[0.5px]">
          <Separator
            orientation="vertical"
            className="mb-1 h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
          />
          <div className="flex min-h-24 flex-1 flex-col justify-between">
            <div className="flex min-w-0 flex-col gap-1 px-1">
              <p className="wrap-break-word text-muted-foreground text-xs leading-none">Freelance projects · 21%</p>
              <div className="font-heading text-lg leading-none tracking-tight">$1,412.00</div>
            </div>
            <div className="-ml-0.5 h-5 rounded-sm bg-chart-3/75" />
          </div>
        </section>

        <section className="isolate flex gap-[0.5px]">
          <Separator
            orientation="vertical"
            className="mb-1 h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
          />
          <div className="flex min-h-24 flex-1 flex-col justify-between">
            <div className="flex min-w-0 flex-col gap-1 px-1">
              <p className="wrap-break-word text-muted-foreground text-xs leading-none">Dividends and interest · 11%</p>
              <div className="font-heading text-lg leading-none tracking-tight">$765.00</div>
            </div>
            <div className="-ml-0.5 h-5 rounded-sm bg-chart-3/50" />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
