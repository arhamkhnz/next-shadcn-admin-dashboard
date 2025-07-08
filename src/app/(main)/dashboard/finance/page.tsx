import React from "react";

import Budget from "./_components/budget";
import CardDetails from "./_components/card-details";
import Summary from "./_components/summary";

export default function Page() {
  return (
    <>
      {/* <div className="flex min-h-[600px] h-full gap-4"> */}
      {/* LEFT COLUMN */}
      <div className="flex h-full min-h-[600px] flex-col gap-4 lg:flex-row">
        <div className="flex h-full w-full lg:w-1/3">
          <CardDetails />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex h-full w-full flex-col gap-4 lg:w-2/3">
          <div className="flex-1">
            <Budget />
          </div>
          {/* <div className="flex-1 lg:flex md:flex gap-4"> */}
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Summary />
          </div>
        </div>
      </div>
    </>
  );
}
