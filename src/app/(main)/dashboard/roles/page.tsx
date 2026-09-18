import type { Metadata } from "next";

import { Roles } from "./_components/roles";
import { roles } from "./_components/roles-table/data";

export const metadata: Metadata = {
  title: "Open Source Roles and Permissions UI with shadcn/ui",
  description: "Explore an open source roles and permissions interface for reviewing access levels and managing roles.",
};

export default function Page() {
  return <Roles roles={roles} />;
}
