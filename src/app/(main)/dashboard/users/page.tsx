import type { Metadata } from "next";

import { users } from "./_components/data";
import { Users } from "./_components/users";

export const metadata: Metadata = {
  title: "Dashboard de gestão de usuários open source com shadcn/ui",
  description:
    "Explore um dashboard open source de gestão de usuários para navegar, filtrar e gerenciar contas de usuários.",
  alternates: {
    canonical: "/dashboard/users",
  },
};

export default function Page() {
  return <Users users={users} />;
}
