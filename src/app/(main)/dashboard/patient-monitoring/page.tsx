import { Network, Printer, Volume2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { patients } from "./_components/data";
import { PatientMonitoring } from "./_components/patient-monitoring";

export default function Page() {
  return (
    <div
      className="flex min-h-[calc(100svh-var(--dashboard-header-height))] min-w-0 flex-col"
      data-content-padding="false"
    >
      <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-3 py-2 text-sm lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:py-0">
        <div className="truncate lg:overflow-visible">CENTRAL PATIENT MONITORING</div>
        <div className="whitespace-nowrap">{patients.length} Patients</div>
        <div className="col-span-2 flex items-center justify-between gap-5 text-muted-foreground lg:col-span-1 lg:justify-end">
          <span className="whitespace-nowrap tabular-nums">03 Aug 2026&nbsp;&nbsp;00:02:03</span>
          <Tooltip>
            <TooltipTrigger aria-label="Alarm audio enabled" className="inline-flex" type="button">
              <Volume2 aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Alarm audio enabled</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger aria-label="Monitoring network connected" className="inline-flex" type="button">
              <Network aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Monitoring network connected</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />

      <PatientMonitoring patients={patients} />

      <Separator />
      <footer className="flex flex-wrap gap-2 p-2 *:data-[slot=button]:h-11 *:data-[slot=button]:min-w-32 *:data-[slot=button]:flex-1 *:data-[slot=button]:rounded-none">
        <Button variant="outline">Main screen</Button>
        <Button variant="outline">Patient setup</Button>
        <Button variant="outline">Alarm review</Button>
        <Button variant="outline">Wave review</Button>
        <Button variant="outline">Trends</Button>
        <Button variant="outline">
          <Printer data-icon="inline-start" />
          Print
        </Button>
        <Button variant="outline">
          <Volume2 data-icon="inline-start" />
          Silence
        </Button>
        <Badge className="h-11 min-w-44 flex-1 rounded-none text-muted-foreground" variant="outline">
          Device C04 connected
        </Badge>
      </footer>
    </div>
  );
}
