"use client";

import { useState } from "react";

import type { PatientRecord } from "./data";
import { PatientCard } from "./patient-card";
import { PatientDetail } from "./patient-detail";

interface PatientMonitoringProps {
  patients: PatientRecord[];
}

export function PatientMonitoring({ patients }: PatientMonitoringProps) {
  const [selectedPatientId, setSelectedPatientId] = useState("cardiac-04");
  const [acknowledgedPatientIds, setAcknowledgedPatientIds] = useState<string[]>([]);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];

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

      <PatientDetail
        acknowledged={acknowledgedPatientIds.includes(selectedPatient.id)}
        onAcknowledge={acknowledgePatient}
        patient={selectedPatient}
      />
    </div>
  );
}
