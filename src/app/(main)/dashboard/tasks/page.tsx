import type { Metadata } from "next";

import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

export const metadata: Metadata = {
  title: "Gerenciador de tarefas open-source com shadcn/ui",
  description:
    "Explore um gerenciador de tarefas open-source para buscar, filtrar, organizar e acompanhar trabalho em um só lugar.",
  alternates: {
    canonical: "/dashboard/tasks",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">Bem-vindo de volta!</h2>
        <p className="text-muted-foreground">Aqui está a lista de suas tarefas deste mês!</p>
      </div>
      <Tasks data={tasks} />
    </div>
  );
}
