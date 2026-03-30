// src/app/(main)/dashboard/users/page.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import UsersTable from "./_components/UsersTable";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage registered users and monitor account status.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">124</p>
          </div>
          <Badge variant="secondary">All</Badge>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">98</p>
          </div>
          <Badge variant="default">Active</Badge>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">6</p>
          </div>
          <Badge variant="outline">Pending</Badge>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
