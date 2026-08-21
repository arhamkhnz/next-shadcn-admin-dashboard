import { ActivityDetail } from "./_components/activity-detail";

export default async function ActivityDetailPage({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params;

  return <ActivityDetail activityId={activityId} />;
}
