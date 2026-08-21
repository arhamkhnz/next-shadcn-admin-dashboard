import { CompanyDetail } from "./_components/company-detail";

type PageProps = {
  params: Promise<{ companyId: string }>;
};

export default async function CompanyPage({ params }: PageProps) {
  const { companyId } = await params;

  return <CompanyDetail companyId={companyId} />;
}
