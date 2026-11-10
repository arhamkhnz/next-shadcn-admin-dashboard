import type { Metadata } from "next";

import { Roles } from "./_components/roles";
import { roles } from "./_components/roles-table/data";

export const metadata: Metadata = {
  title: "UI de Funções e Permissões de Código Aberto com shadcn/ui",
  description:
    "Explore uma interface de funções e permissões de código aberto para revisar níveis de acesso e gerenciar funções.",
  alternates: {
    canonical: "/dashboard/roles",
  },
};

export default function Page() {
  return <Roles roles={roles} />;
}
