import type { Metadata } from "next";

import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

export const metadata: Metadata = {
  title: "Open Source Task Manager with shadcn/ui",
  description:
    "Explore an open source task manager for searching, filtering, organizing, and tracking work in one place.",
  alternates: {
    canonical: "/dashboard/tasks",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">Here's a list of your tasks for this month!</p>
      </div>
      <Tasks data={tasks} />
    </div>
  );
}
