import type { Metadata } from "next";

import { infrastructureGroups } from "./_components/infrastructure-data";
import { InfrastructureHeader } from "./_components/infrastructure-header";
import { ProjectEnvironments } from "./_components/project-environments";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "Open Source Infrastructure Dashboard with shadcn/ui",
  description:
    "Explore an open source infrastructure dashboard with environments, server health, uptime, resource usage, and deployment status.",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <InfrastructureHeader />

      <div className="flex flex-col gap-4">
        {infrastructureGroups.map((group) => (
          <ProjectEnvironments key={group.name} group={group} />
        ))}
      </div>
    </div>
  );
}
