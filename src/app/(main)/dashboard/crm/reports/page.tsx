import type { Metadata } from "next";

import { ReportsView } from "./_components/reports-view";

export const metadata: Metadata = {
  title: "CRM Reports & Analytics",
  description: "Sales, pipeline, lead, activity, and team performance analytics for the CRM workspace.",
};

export default function CrmReportsPage() {
  return <ReportsView />;
}
