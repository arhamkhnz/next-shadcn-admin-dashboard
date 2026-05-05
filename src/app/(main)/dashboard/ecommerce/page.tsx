import { format } from "date-fns";

import { KpiStrip } from "./_components/kpi-strip";

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl leading-none tracking-tight">Store Overview</h1>
        <p className="text-muted-foreground text-sm">{formattedDate}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <KpiStrip />
      </div>
    </div>
  );
}
