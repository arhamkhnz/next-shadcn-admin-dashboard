import React from "react";

import { CreditCard, DollarSign } from "lucide-react";

import StatCard from "./statcard";
import { stats, StatType } from "./types";

const CrmSectionCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {stats.slice(0, 4).map((item, index) => (
        <div key={index} className="col-span-1 *:data-[slot=card]:shadow-xs">
          <StatCard {...item} />
        </div>
      ))}

      {stats.slice(4).map((item, index) => (
        <div key={index + 4} className="col-span-1 *:data-[slot=card]:shadow-xs sm:col-span-2 lg:col-span-2">
          <StatCard {...item} />
        </div>
      ))}
    </div>
  );
};

export default CrmSectionCards;
