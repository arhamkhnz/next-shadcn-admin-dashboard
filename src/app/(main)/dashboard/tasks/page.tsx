import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

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
