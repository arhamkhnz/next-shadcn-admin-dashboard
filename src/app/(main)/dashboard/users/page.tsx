import type { Metadata } from "next";

import { users } from "./_components/data";
import { Users } from "./_components/users";

export const metadata: Metadata = {
  title: "Open Source User Management Dashboard with shadcn/ui",
  description: "Explore an open source user management dashboard for browsing, filtering, and managing user accounts.",
  alternates: {
    canonical: "/dashboard/users",
  },
};

export default function Page() {
  return <Users users={users} />;
}
