import { RoleDetailsPanel } from "./role-details-panel";
import { RolesHeader } from "./roles-header";
import { RolesTable } from "./roles-table";
import { RolesTabs } from "./roles-tabs";
import { RolesToolbar } from "./roles-toolbar";

export function RolesDashboard() {
  return (
    <div data-content-padding="false" className="min-h-[calc(100vh-var(--dashboard-header-height))] bg-background">
      <RolesHeader />

      <div className="grid min-h-[calc(100vh-var(--dashboard-header-height)-73px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 border-b xl:border-r xl:border-b-0">
          <RolesTabs />

          <div className="flex flex-col gap-5 p-4 md:p-6">
            <RolesToolbar />
            <RolesTable />
          </div>
        </main>

        <RoleDetailsPanel />
      </div>
    </div>
  );
}
