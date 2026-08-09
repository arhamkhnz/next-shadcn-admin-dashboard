import { Check, LockKeyhole } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";
import { DetailsPanel, FieldGrid, SectionHeader } from "./profile-fields";

interface ProfileDetailsProps {
  profile: ProfileRecord;
}

export function PersonalDetails({ profile }: ProfileDetailsProps) {
  return (
    <DetailsPanel>
      <SectionHeader privateSection title="Personal information" />
      <FieldGrid
        fields={[
          { label: "Preferred name", value: profile.preferredName },
          { label: "Legal name", value: profile.legalName },
          { label: "Pronouns", value: profile.pronouns },
          { label: "Date of birth", value: profile.birthday },
          { label: "Personal email", value: profile.personalEmail },
          { label: "Work phone", value: profile.workPhone },
        ]}
      />
      <Separator className="my-7" />
      <SectionHeader privateSection title="Address and emergency contact" />
      <FieldGrid
        fields={[
          { label: "Home address", value: profile.address },
          { label: "Emergency contact", value: profile.emergencyContact },
          { label: "Emergency phone", value: profile.emergencyPhone },
        ]}
      />
    </DetailsPanel>
  );
}

export function EmploymentDetails({ profile }: ProfileDetailsProps) {
  return (
    <DetailsPanel>
      <SectionHeader title="Employment information" />
      <FieldGrid
        fields={[
          { label: "Job title", value: profile.jobTitle },
          { label: "Department", value: profile.department },
          { label: "Team", value: profile.team },
          { label: "Manager", value: profile.manager.name },
          { label: "Workplace", value: profile.workplace },
          { label: "Employment type", value: profile.employmentType },
          { label: "Weekly hours", value: profile.weeklyHours },
          { label: "Schedule", value: profile.schedule },
          { label: "Probation", value: profile.probationEnd },
        ]}
      />
    </DetailsPanel>
  );
}

export function CompensationDetails({ profile }: ProfileDetailsProps) {
  return (
    <DetailsPanel>
      <div className="mb-6 flex items-start gap-3 border-b pb-5">
        <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">Restricted information</p>
          <p className="mt-0.5 text-muted-foreground text-sm">
            Visible to people administrators and authorized finance roles.
          </p>
        </div>
      </div>
      <SectionHeader privateSection title="Compensation" />
      <FieldGrid
        fields={[
          { label: "Base salary", value: profile.salary },
          { label: "Pay frequency", value: profile.payFrequency },
          { label: "Currency", value: profile.currency },
          { label: "Effective from", value: profile.compensationEffective },
          { label: "Variable compensation", value: profile.bonusTarget },
          { label: "Payroll", value: profile.payrollStatus },
        ]}
      />
    </DetailsPanel>
  );
}

export function TimeOffDetails({ profile }: ProfileDetailsProps) {
  return (
    <DetailsPanel>
      <SectionHeader title="Time off" />
      <FieldGrid
        fields={[
          { label: "Policy", value: profile.timeOffPolicy },
          { label: "Current balance", value: profile.timeOffAvailable },
          { label: "Used this year", value: profile.timeOffUsed },
          { label: "Next leave", value: profile.nextLeave },
        ]}
      />
      <div className="mt-6 flex items-center gap-2 border-t pt-5 text-sm">
        <Check aria-hidden="true" className="size-4 text-muted-foreground" />
        No requests are waiting for approval.
      </div>
    </DetailsPanel>
  );
}
