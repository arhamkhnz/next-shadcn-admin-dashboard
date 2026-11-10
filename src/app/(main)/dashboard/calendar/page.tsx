import type { Metadata } from "next";

import { Calendar } from "./_components/calendar";

export const metadata: Metadata = {
  title: "Calendário open-source com shadcn/ui",
  description:
    "Explore uma interface de calendário open-source para organizar eventos, agendamentos e atividades do dia a dia.",
  alternates: {
    canonical: "/dashboard/calendar",
  },
};

export default function Page() {
  return <Calendar />;
}
