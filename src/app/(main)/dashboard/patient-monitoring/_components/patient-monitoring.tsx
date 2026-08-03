"use client";

import { Fragment, useState } from "react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { PatientRecord } from "./data";
import { PatientCard } from "./patient-card";
import { PatientDetail } from "./patient-detail";
import { PatientTrends } from "./patient-trends";

interface PatientMonitoringProps {
  patients: PatientRecord[];
}

export function PatientMonitoring({ patients }: PatientMonitoringProps) {
  const [selectedPatientId, setSelectedPatientId] = useState("cardiac-04");
  const [acknowledgedPatientIds, setAcknowledgedPatientIds] = useState<string[]>([]);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];
  const acknowledged = acknowledgedPatientIds.includes(selectedPatient.id);
  const hasActiveAlarm = selectedPatient.status === "alarm" && !acknowledged;

  function acknowledgePatient(patientId: string) {
    setAcknowledgedPatientIds((current) => (current.includes(patientId) ? current : [...current, patientId]));
  }

  return (
    <div className="grid min-w-0 flex-1 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="grid grid-cols-2 content-start *:border-border *:border-r *:border-b *:even:border-r-0">
        {patients.map((patient) => (
          <PatientCard
            acknowledged={acknowledgedPatientIds.includes(patient.id)}
            active={patient.id === selectedPatient.id}
            key={patient.id}
            onSelect={setSelectedPatientId}
            patient={patient}
          />
        ))}
      </div>

      <div className="flex min-w-0 flex-col border-border lg:border-l">
        <div className="flex min-h-11 items-center gap-4 bg-muted/50 px-3">
          <div className="flex items-center gap-3 font-medium">
            <Badge className="rounded-none" variant="outline">
              {selectedPatient.bed}
            </Badge>
            <span className="text-lg">{selectedPatient.name}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {selectedPatient.age} {selectedPatient.sex} · {selectedPatient.diagnosis}
          </div>
        </div>
        <Separator />

        {selectedPatient.alarm && (
          <Alert
            className={cn(
              "min-h-9 rounded-none border-x-0 border-t-0 pr-32",
              hasActiveAlarm
                ? "border-amber-500 bg-amber-400 text-amber-950"
                : "border-border bg-muted text-foreground",
            )}
            variant="default"
          >
            <AlertTitle>{selectedPatient.alarm}</AlertTitle>
            {selectedPatient.alarmDuration && (
              <AlertDescription className={cn(hasActiveAlarm && "text-amber-950")}>
                Active for {selectedPatient.alarmDuration}
              </AlertDescription>
            )}
            <AlertAction className="top-1/2 -translate-y-1/2">
              <Button
                className="rounded-none"
                disabled={acknowledged}
                onClick={() => acknowledgePatient(selectedPatient.id)}
                size="sm"
                variant="secondary"
              >
                {acknowledged ? "Acknowledged" : "Acknowledge"}
              </Button>
            </AlertAction>
          </Alert>
        )}

        <PatientDetail hasActiveAlarm={hasActiveAlarm} patient={selectedPatient} />

        <Tabs className="min-h-0 flex-1 gap-0" defaultValue="trends">
          <TabsList
            className="w-full justify-start gap-0 border-b p-0 *:h-full *:max-w-32 *:rounded-none *:border-0 *:border-border *:border-r *:after:-bottom-px!"
            variant="line"
          >
            <TabsTrigger value="real-time">Real time</TabsTrigger>
            <TabsTrigger value="events">Event review</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="disclosure">Full disclosure</TabsTrigger>
          </TabsList>

          <TabsContent
            className="m-0 flex flex-col items-center justify-center gap-1 px-4 text-center"
            value="real-time"
          >
            <p className="font-medium text-sm">Live monitoring is active</p>
            <p className="text-muted-foreground text-xs">Waveforms and vital signs update continuously above.</p>
          </TabsContent>
          <TabsContent className="m-0" value="events">
            <div className="min-h-44">
              <div className="grid grid-cols-[4rem_1fr] bg-muted/40 px-4 py-2 font-medium text-muted-foreground text-xs">
                <span>Time</span>
                <span>Event</span>
              </div>
              <Separator />
              {selectedPatient.recentEvents.map((event, index) => (
                <Fragment key={`${event.time}-${event.label}`}>
                  <div className="grid min-h-11 grid-cols-[4rem_1fr] items-center px-4 py-2 text-sm">
                    <span className="text-muted-foreground tabular-nums">{event.time}</span>
                    <span>{event.label}</span>
                  </div>
                  {index < selectedPatient.recentEvents.length - 1 && <Separator />}
                </Fragment>
              ))}
            </div>
          </TabsContent>
          <TabsContent className="m-0" value="trends">
            <PatientTrends patient={selectedPatient} />
          </TabsContent>
          <TabsContent
            className="m-0 flex flex-col items-center justify-center gap-1 px-4 text-center"
            value="disclosure"
          >
            <p className="font-medium text-sm">Full disclosure recording is active</p>
            <p className="text-muted-foreground text-xs">
              Continuous waveform history is available for the last 24 hours.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
