import type { Metadata } from "next";

import { Products } from "./_components/products";

export const metadata: Metadata = {
  title: "Open Source Product Management Dashboard with shadcn/ui",
  description: "Manage an ecommerce product catalog with categories, inventory, availability, pricing, and sales.",
  alternates: { canonical: "/dashboard/products" },
};

export default function Page() {
  return <Products />;
}
