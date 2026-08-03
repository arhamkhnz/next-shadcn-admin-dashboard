"use client";

import { useState } from "react";

import { Printer, Volume2, VolumeX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

import type { PatientRecord } from "./data";
import { PatientCard } from "./patient-card";
import { PatientDetail } from "./patient-detail";

interface PatientMonitoringProps {
  patients: PatientRecord[];
}

export function PatientMonitoring({ patients }: PatientMonitoringProps) {
  const [selectedPatientId, setSelectedPatientId] = useState("cardiac-04");
  const [acknowledgedPatientIds, setAcknowledgedPatientIds] = useState<string[]>([]);
  const [alarmAudioMuted, setAlarmAudioMuted] = useState(false);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];

  function acknowledgePatient(patientId: string) {
    setAcknowledgedPatientIds((current) => (current.includes(patientId) ? current : [...current, patientId]));
  }

  return (
    <>
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

        <PatientDetail
          acknowledged={acknowledgedPatientIds.includes(selectedPatient.id)}
          onAcknowledge={acknowledgePatient}
          patient={selectedPatient}
        />
      </div>

      <Separator />
      <footer className="flex flex-wrap gap-2 p-2">
        <Button className="h-11 min-w-32 flex-1 rounded-none" variant="outline">
          Main screen
        </Button>
        <Button className="h-11 min-w-32 flex-1 rounded-none" variant="outline">
          Patient setup
        </Button>
        <Button className="h-11 min-w-32 flex-1 rounded-none" variant="outline">
          Alarm review
        </Button>
        <Button className="h-11 min-w-32 flex-1 rounded-none" variant="outline">
          Wave review
        </Button>
        <Button className="h-11 min-w-32 flex-1 rounded-none" variant="outline">
          Trends
        </Button>
        <Button className="h-11 min-w-32 flex-1 rounded-none" variant="outline">
          <Printer data-icon="inline-start" />
          Print
        </Button>
        <Toggle
          aria-label="Toggle alarm audio"
          className="h-11 min-w-32 flex-1 rounded-none"
          onPressedChange={setAlarmAudioMuted}
          pressed={alarmAudioMuted}
          variant="outline"
        >
          {alarmAudioMuted ? <VolumeX data-icon="inline-start" /> : <Volume2 data-icon="inline-start" />}
          {alarmAudioMuted ? "Resume audio" : "Silence"}
        </Toggle>
        <Badge className="h-11 min-w-44 flex-1 rounded-none text-muted-foreground" variant="outline">
          Device {selectedPatient.bed} connected
        </Badge>
      </footer>
    </>
  );
}
