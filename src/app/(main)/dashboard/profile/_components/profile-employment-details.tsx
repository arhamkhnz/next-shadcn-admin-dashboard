import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function EmploymentDetails({ profile }: { profile: ProfileRecord }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Role and organization</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Job title</dt>
              <dd className="text-sm">{profile.jobTitle}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Team</dt>
              <dd className="text-sm">{profile.team}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Job level</dt>
              <dd className="text-sm">{profile.jobLevel}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Manager</dt>
              <dd className="text-sm">{profile.manager.name}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Department</dt>
              <dd className="text-sm">{profile.department}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Current project</dt>
              <dd className="text-sm">{profile.currentProject}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Contract details</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Contractor ID</dt>
              <dd className="text-sm">{profile.contractorId}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Engagement status</dt>
              <dd className="text-sm">{profile.engagementStatus}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Employment type</dt>
              <dd className="text-sm">{profile.employmentType}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Contracting entity</dt>
              <dd className="text-sm">{profile.contractingEntity}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Start date</dt>
              <dd className="text-sm">{profile.startDate}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Last working day</dt>
              <dd className="text-sm">{profile.lastWorkingDay}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Notice period</dt>
              <dd className="text-sm">{profile.noticePeriod}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Work arrangement</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Workplace</dt>
              <dd className="text-sm">{profile.workplace}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Time zone</dt>
              <dd className="text-sm">{profile.timeZone}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Weekly hours</dt>
              <dd className="text-sm">{profile.weeklyHours}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Schedule</dt>
              <dd className="text-sm">{profile.schedule}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
