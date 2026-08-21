import { Suspense } from "react";

import { TasksView } from "./_components/tasks-view";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <TasksView />
      </Suspense>
    </div>
  );
}
