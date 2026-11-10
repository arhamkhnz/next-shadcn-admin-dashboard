import type { Metadata } from "next";

import { infrastructureGroups } from "./_components/infrastructure-data";
import { InfrastructureHeader } from "./_components/infrastructure-header";
import { ProjectEnvironments } from "./_components/project-environments";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "Dashboard open source de infraestrutura com shadcn/ui",
  description:
    "Explore um dashboard open source de infraestrutura com ambientes, saúde dos servidores, uptime, uso de recursos e status de deployment.",
  alternates: {
    canonical: "/dashboard/infrastructure",
  },
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
