"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { users, fetchUsers } = useUserStore();
  // Resolve the params promise to get the actual id value
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);

  const user = users.find((u) => u.id === resolvedParams.id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`/avatars/${user.name.toLowerCase().replace(" ", "")}.png`} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">{user.phone}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Cars</p>
            <p className="text-lg font-semibold">{user.cars}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Total Bookings</p>
            <p className="text-lg font-semibold">{user.bookings}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Total Washes</p>
            <p className="text-lg font-semibold">{user.totalWashes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
