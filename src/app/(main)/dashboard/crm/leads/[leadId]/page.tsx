import { LeadDetail } from "./_components/lead-detail";

export default async function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;

  return <LeadDetail leadId={leadId} />;
}
