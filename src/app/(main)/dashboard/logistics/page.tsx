import { MainPanel } from "./_components/main-panel";
import { ShipmentsPanel } from "./_components/shipments-panel";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export default function Page() {
  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] grid-cols-12 divide-x overflow-hidden"
    >
      <div className="col-span-4 h-full overflow-hidden">
        <ShipmentsPanel />
      </div>
      <div className="col-span-8 h-full overflow-hidden">
        <MainPanel />
      </div>
    </div>
  );
}
