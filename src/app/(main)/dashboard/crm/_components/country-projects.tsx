import React from "react";

import { CountrySales, ActiveProjects, ProjectStatus } from "./country-sales";

export default function CountryProjects() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-2">
        <CountrySales />
      </div>
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-2">
        <ProjectStatus />
      </div>
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-2">
        <ActiveProjects />
      </div>
    </div>
  );
}
