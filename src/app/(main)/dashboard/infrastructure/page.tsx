import { infrastructureGroups } from "./_components/infrastructure-data";
import { InfrastructureHeader } from "./_components/infrastructure-header";
import { InfrastructureProjectGroup } from "./_components/infrastructure-project-group";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <InfrastructureHeader />

      <div className="flex flex-col gap-4">
        {infrastructureGroups.map((group) => (
          <InfrastructureProjectGroup key={group.name} group={group} />
        ))}
      </div>
    </div>
  );
}
