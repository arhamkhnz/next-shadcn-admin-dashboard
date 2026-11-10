import { Suspense } from "react";

import type { Metadata } from "next";

import { initialBoard } from "./_components/data";
import { Kanban } from "./_components/kanban";

export const metadata: Metadata = {
  title: "Quadro Kanban open-source com shadcn/ui",
  description:
    "Explore um quadro Kanban open-source para organizar trabalho, acompanhar o progresso e gerenciar tarefas visualmente.",
  alternates: {
    canonical: "/dashboard/kanban",
  },
};

export default function Page() {
  return (
    <div data-content-padding="false">
      <Suspense fallback={null}>
        <Kanban initialBoard={initialBoard} />
      </Suspense>
    </div>
  );
}
