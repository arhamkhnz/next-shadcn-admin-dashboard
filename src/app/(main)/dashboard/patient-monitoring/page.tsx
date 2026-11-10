import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Network, Printer, Volume2 } from "lucide-react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { patients } from "./_components/data";
import { PatientMonitoring } from "./_components/patient-monitoring";

export const metadata: Metadata = {
  title: "Dashboard open source de monitoramento de pacientes com shadcn/ui",
  description:
    "Explore um dashboard open source de monitoramento de pacientes com sinais vitais ao vivo, ondas de ECG, tendências, alarmes e status dos dispositivos.",
  alternates: {
    canonical: "/dashboard/patient-monitoring",
  },
};

export default function Page() {
  const now = new Date();

  return (
    <div
      className="flex min-h-[calc(100svh-var(--dashboard-header-height))] min-w-0 flex-col"
      data-content-padding="false"
    >
      <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-2 py-2 text-sm lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:py-0">
        <div className="truncate lg:overflow-visible">CENTRAL DE MONITORAMENTO DE PACIENTES</div>
        <div className="whitespace-nowrap">{patients.length} pacientes</div>
        <div className="col-span-2 flex items-center justify-between gap-5 text-muted-foreground lg:col-span-1 lg:justify-end">
          <span className="whitespace-nowrap tabular-nums">
            {format(now, "dd MMM yyyy", { locale: ptBR })}&nbsp;&nbsp;{format(now, "HH:mm:ss")}
          </span>
          <Tooltip>
            <TooltipTrigger aria-label="Áudio de alarmes ativado" className="inline-flex" type="button">
              <Volume2 aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Áudio de alarmes ativado</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger aria-label="Rede de monitoramento conectada" className="inline-flex" type="button">
              <Network aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Rede de monitoramento conectada</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />

      {/*
        data.ts holds the patients and PatientMonitoring renders the screen.
        use-patient-vital-series.ts repeats templates from waveform-data.ts,
        while use-realtime-tick.ts and realtime-utils.ts move the charts.
      */}
      <PatientMonitoring patients={patients} />

      <Separator />
      <footer className="flex flex-wrap gap-2 p-2 *:data-[slot=button]:h-11 *:data-[slot=button]:min-w-32 *:data-[slot=button]:flex-1 *:data-[slot=button]:rounded-none">
        <Button variant="outline">Tela principal</Button>
        <Button variant="outline">Configuração do paciente</Button>
        <Button variant="outline">Revisão de alarmes</Button>
        <Button variant="outline">Revisão de ondas</Button>
        <Button variant="outline">Tendências</Button>
        <Button variant="outline">
          <Printer data-icon="inline-start" />
          Imprimir
        </Button>
        <Button variant="outline">
          <Volume2 data-icon="inline-start" />
          Silenciar
        </Button>
        <Badge className="h-11 min-w-44 flex-1 rounded-none text-muted-foreground" variant="outline">
          Dispositivo C04 conectado
        </Badge>
      </footer>
    </div>
  );
}
