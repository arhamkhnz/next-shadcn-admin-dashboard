import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const NEXT_INTERVENTIONS = [
  {
    dealId: "OPP-489",
    priority: "Escalate",
    owner: "Leila Zhang",
    risk: 81,
    recommendation: "Join next customer call and reset close plan.",
  },
  {
    dealId: "OPP-475",
    priority: "Coach",
    owner: "Omar Ali",
    risk: 76,
    recommendation: "Review deal strategy and unblock stage exit.",
  },
  {
    dealId: "OPP-447",
    priority: "Coach",
    owner: "Sofia Bautista",
    risk: 75,
    recommendation: "Review deal strategy and unblock stage exit.",
  },
] as const;

export function ActionsManagerQueue() {
  return (
    <Card className="h-full shadow-xs">
      <CardHeader>
        <CardTitle>Manager Action Queue</CardTitle>
        <CardDescription>Escalate, coach, and reforecast before commit call</CardDescription>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Actionable deals" value="7" />
            <StatCard label="Revenue in play" value={formatCurrency(811000, { noDecimals: true })} mono />
            <StatCard label="Owners engaged" value="3" />
            <StatCard label="Median risk" value="72" mono />
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">Intervention mix</p>
              <Badge variant="outline" className="h-5 px-2 text-[11px] tabular-nums">
                Escalate {formatCurrency(174000, { noDecimals: true })}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">Escalate</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  1 deals · 14% · {formatCurrency(174000, { noDecimals: true })}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">Coach</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  4 deals · 57% · {formatCurrency(478000, { noDecimals: true })}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">Reforecast</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  2 deals · 29% · {formatCurrency(159000, { noDecimals: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">Manager focus</p>
              <span className="text-muted-foreground text-xs tabular-nums">This forecast cycle</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2 rounded-md border bg-background/70 px-2.5 py-1.5">
                <span>Coach queue</span>
                <span className="text-muted-foreground tabular-nums">
                  4 deals · {formatCurrency(478000, { noDecimals: true })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-md border bg-background/70 px-2.5 py-1.5">
                <span>Primary owner</span>
                <span className="text-muted-foreground tabular-nums">Leila Zhang · 3 deals</span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-md border bg-background/70 px-2.5 py-1.5">
                <span>Stale pipeline</span>
                <span className="text-muted-foreground tabular-nums">
                  8 deals · {formatCurrency(1151000, { noDecimals: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-muted-foreground text-xs">Next interventions</p>

            {NEXT_INTERVENTIONS.map((item) => (
              <div key={`${item.priority}-${item.dealId}`} className="space-y-1 rounded-md border px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{item.dealId}</span>
                  <Badge variant="outline" className="h-5 px-2 text-[11px]">
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {item.owner} · {item.risk} risk
                </p>
                <p className="text-xs">{item.recommendation}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/20 px-3 py-2">
            <span className="text-muted-foreground text-xs">No-action monitor</span>
            <span className="font-medium text-xs tabular-nums">3 Deals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border bg-muted/20 px-2.5 py-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={mono ? "font-semibold text-base tabular-nums" : "font-semibold text-base"}>{value}</p>
    </div>
  );
}
