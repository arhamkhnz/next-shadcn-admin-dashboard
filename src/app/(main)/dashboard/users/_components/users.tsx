import type { UserRow } from "./users-data";
import { UsersHeader } from "./users-header";
import { UsersTable } from "./users-table";

export function Users({ users }: { users: readonly UserRow[] }) {
  return (
    <div>
      <section className="flex min-h-[calc(100dvh-var(--dashboard-header-height)-2rem)] flex-col overflow-hidden rounded-[18px] border border-border/70 bg-card text-card-foreground">
        <UsersHeader />
        <UsersTable rows={users} />
      </section>
    </div>
  );
}
