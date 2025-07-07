import CountryProjects from "./_components/country-projects";
import { OverviewCards } from "./_components/overview-cards";
import { OverviewCardsV2 } from "./_components/overview-cards-2";
import { OverviewCardsV3 } from "./_components/overview-cards-3";
import { OverviewCardsV4 } from "./_components/overview-cards-4";
import TabTriggers from "./_components/tab-triggers";
import Transaction from "./_components/transaction";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards />
      <OverviewCardsV2 />
      <OverviewCardsV3 />
      <OverviewCardsV4 />
      <TabTriggers />
      <CountryProjects />
      <Transaction />
    </div>
  );
}
