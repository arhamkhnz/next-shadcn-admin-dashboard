import { DealDetail } from "./_components/deal-detail";

export default async function DealDetailPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;

  return <DealDetail dealId={dealId} />;
}
