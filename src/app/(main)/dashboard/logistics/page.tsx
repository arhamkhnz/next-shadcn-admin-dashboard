import type { Metadata } from "next";

import { Logistics } from "./_components/logistics";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "Painel de logística open source com shadcn/ui",
  description:
    "Explore um painel de logística open source com rastreio de envios, status de entrega, mapas de rota, detalhes de carga e informações de transporte.",
  alternates: {
    canonical: "/dashboard/logistics",
  },
};

export default function Page() {
  return <Logistics />;
}
