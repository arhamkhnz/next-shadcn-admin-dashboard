import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const upcomingEvents = [
  {
    dayOffset: 6,
    title: "Feira de Ciências",
    time: "08:30 - 12:30",
    type: "Na escola",
  },
  {
    dayOffset: 9,
    title: "Reunião de pais",
    time: "14:00 - 17:00",
    type: "Reunião",
  },
  {
    dayOffset: 12,
    title: "Dia de Esportes",
    time: "09:00 - 16:00",
    type: "Esportes",
  },
  {
    dayOffset: 15,
    title: "Simulado da 11ª série",
    time: "09:00 - 12:00",
    type: "Prova",
  },
  {
    dayOffset: 18,
    title: "Planejamento do departamento",
    time: "15:30 - 16:30",
    type: "Reunião",
  },
];

export function UpcomingEvents() {
  const today = new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Próximos eventos</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          Ver calendário <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {upcomingEvents.map((event) => {
          const eventDate = addDays(today, event.dayOffset);

          return (
            <div key={event.title} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-11 shrink-0 overflow-hidden rounded-sm border">
                  <div className="grid h-1/3 place-items-center border-b bg-muted font-medium text-[10px] uppercase leading-none">
                    {format(eventDate, "MMM", { locale: ptBR })}
                  </div>
                  <div className="grid h-2/3 place-items-center text-lg leading-none">{format(eventDate, "d")}</div>
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <div className="truncate font-medium text-sm leading-none">{event.title}</div>
                  <div className="text-muted-foreground text-xs leading-none">{event.time}</div>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-md px-2.5 py-1 font-medium text-[10px]">
                {event.type}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
