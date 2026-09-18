import type { Metadata } from "next";

import { Logistics } from "./_components/logistics";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "Open Source Logistics Dashboard with shadcn/ui",
  description:
    "Explore an open source logistics dashboard with shipment tracking, delivery status, route maps, cargo details, and transport information.",
};

export default function Page() {
  return <Logistics />;
}
