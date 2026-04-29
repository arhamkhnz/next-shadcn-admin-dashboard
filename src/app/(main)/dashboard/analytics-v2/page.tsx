import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="space-y-1 xl:col-span-12">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Hello, Aiy</h1>
          <p className="text-muted-foreground text-sm">
            Monitor traffic, engagement, and conversion performance in one view.
          </p>
        </div>
      </div>
      <AnalyticsToolbar />
      <AnalyticsKpiStrip />
    </div>
  );
}
