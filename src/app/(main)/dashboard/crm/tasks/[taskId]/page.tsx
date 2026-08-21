import { TaskDetail } from "./_components/task-detail";

export default async function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;

  return <TaskDetail taskId={taskId} />;
}
