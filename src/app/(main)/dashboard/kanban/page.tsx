import type { Metadata } from "next";

import { initialBoard } from "./_components/data";
import { Kanban } from "./_components/kanban";

export const metadata: Metadata = {
  title: "Open Source Kanban Board with shadcn/ui",
  description:
    "Explore an open source Kanban board for organizing work, tracking progress, and managing tasks visually.",
  alternates: {
    canonical: "/dashboard/kanban",
  },
};

export default function Page() {
  return (
    <div data-content-padding="false">
      <Kanban initialBoard={initialBoard} />
    </div>
  );
}
