import usersData from "./_components/users-table/data.json";
import type { UserRow } from "./_components/users-table/schema";
import { UsersTable } from "./_components/users-table/table";

export default function UsersPage() {
  const users = usersData as UserRow[];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage your application users, roles, and account status.</p>
      </div>
      <UsersTable data={users} />
    </div>
  );
}
