import { ReleaseFilters } from "./_components/release-filters";
import { ReleaseStats } from "./_components/release-stats";
import { ReleasesTable } from "./_components/releases-table";

export default function ReleasesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Releases</h1>
        <p className="text-sm text-muted-foreground">All tracks distributed under Realm Music.</p>
      </div>
      <ReleaseStats />
      <ReleaseFilters />
      <ReleasesTable />
    </div>
  );
}
