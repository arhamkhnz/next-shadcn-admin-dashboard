import { Network, Volume2 } from "lucide-react";

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
      <div className="grid min-h-10 grid-cols-[1fr_auto_1fr] items-center px-3 text-sm">
        <div>CENTRAL PATIENT MONITORING</div>
        <div>{patients.length} Patients</div>
        <div className="flex items-center justify-end gap-5 text-muted-foreground">
          <span className="tabular-nums">03 Aug 2026&nbsp;&nbsp;00:02:03</span>
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
    </div>
  );
}
