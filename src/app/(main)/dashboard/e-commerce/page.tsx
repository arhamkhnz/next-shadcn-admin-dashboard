import { EcommerceDashboard } from "./_components/ecommerce-dashboard";
import { EcommerceOverview } from "./_components/ecommerce-overview";
import { EcommerceSalesActions } from "./_components/ecommerce-sales-actions";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <EcommerceOverview />
      <EcommerceSalesActions />
      <EcommerceDashboard />
    </div>
  );
}
