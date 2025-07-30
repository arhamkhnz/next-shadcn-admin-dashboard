"use client";

import { ServiceList } from "./_components/service-list";

export default function ServicesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Services</h2>
      <ServiceList />
    </div>
  );
}
