import { Check, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";
import { FieldGrid } from "./profile-fields";

interface ProfileDetailsProps {
  profile: ProfileRecord;
}

export function PersonalDetails({ profile }: ProfileDetailsProps) {
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-heading font-medium text-base">Personal information</h2>
        <Badge variant="outline">
          <LockKeyhole data-icon="inline-start" />
          Private
        </Badge>
      </div>
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
      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-heading font-medium text-base">Address and emergency contact</h2>
        <Badge variant="outline">
          <LockKeyhole data-icon="inline-start" />
          Private
        </Badge>
      </div>
      <FieldGrid
        fields={[
          { label: "Home address", value: profile.address },
          { label: "Emergency contact", value: profile.emergencyContact },
          { label: "Emergency phone", value: profile.emergencyPhone },
        ]}
      />
    </>
  );
}

export function EmploymentDetails({ profile }: ProfileDetailsProps) {
  return (
    <>
      <h2 className="mb-4 font-heading font-medium text-base">Employment information</h2>
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
    </>
  );
}

export function TimeOffDetails({ profile }: ProfileDetailsProps) {
  return (
    <>
      <h2 className="mb-4 font-heading font-medium text-base">Time off</h2>
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
    </>
  );
}
