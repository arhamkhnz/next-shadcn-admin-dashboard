import { AccountOverview } from "./_components/account-overview";
import { CurrencyExchange } from "./_components/currency-exchange";
import { ExpenseSummary } from "./_components/expense-summary";
import { FinancialOverview } from "./_components/financial-overview";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-1">
        <AccountOverview />
      </div>

      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="flex-1">
          <FinancialOverview />
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs md:grid-cols-2">
          <ExpenseSummary />
          <CurrencyExchange />
        </div>
      </div>
    </div>
  );
}
