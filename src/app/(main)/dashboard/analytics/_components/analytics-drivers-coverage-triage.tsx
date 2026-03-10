import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DriversCoverageTriage() {
  const leverOptions = [
    {
      key: "deal",
      label: "+1 enterprise deal",
      value: "+$72,133 weighted",
      context: "32% of gap",
    },
    {
      key: "conversion",
      label: "+5pp conversion",
      value: "+$49,182/month",
      context: "22% of gap",
    },
    {
      key: "cycle",
      label: "-4d cycle",
      value: "+$90,167/day",
      context: "40% of gap",
    },
  ] as const;

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Coverage Triage</CardTitle>
        <CardDescription>Decision ladder for this forecast cycle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive" className="rounded-md font-medium">
            At Risk
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            1.9x / 3.0x
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            Gap $222,930
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            4 deals • ETA 10d
          </Badge>
        </div>

        <p className="text-muted-foreground text-xs">
          Coverage below target. Prioritize qualified volume and shorter cycle time.
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {leverOptions.map((lever) => (
            <div key={lever.key} className="space-y-1 rounded-md border bg-muted/20 px-2.5 py-2">
              <p className="text-muted-foreground text-xs">{lever.label}</p>
              <p className="font-semibold text-sm tabular-nums">{lever.value}</p>
              <p className="text-muted-foreground text-xs">{lever.context}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/20 px-3 py-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              Owner: <span className="font-medium text-foreground">Leila Zhang</span>
            </span>
            <span className="text-muted-foreground">
              Focus: <span className="text-foreground">top gap-filling deals</span>
            </span>
            <span className="text-muted-foreground">
              Due: <span className="text-foreground">before next forecast call</span>
            </span>
          </div>
          <Button variant="secondary" size="sm" className="h-7 px-3 text-xs">
            Open top 5 deals
          </Button>
        </div>

        <div className="space-y-1 rounded-md border border-dashed bg-muted/10 px-3 py-2.5">
          <p className="text-muted-foreground text-xs">
            Fastest path: <span className="font-medium text-foreground">-4d cycle</span> recovers 40% of gap.
          </p>
          <p className="text-muted-foreground text-xs">
            Priority sequence: <span className="text-foreground">cycle time</span> before net-new volume.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
