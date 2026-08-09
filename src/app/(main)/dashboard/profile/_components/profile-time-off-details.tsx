import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function TimeOffDetails({ profile }: { profile: ProfileRecord }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Leave balance</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Policy</dt>
              <dd className="text-sm">{profile.leavePolicy}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Carried over</dt>
              <dd className="text-sm">{profile.carriedOverLeave}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Annual allowance</dt>
              <dd className="text-sm">{profile.annualLeaveAllowance}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Used this year</dt>
              <dd className="text-sm">{profile.usedLeave}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Remaining</dt>
              <dd className="text-sm">{profile.remainingLeave}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Scheduled</dt>
              <dd className="text-sm">{profile.scheduledLeave}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Upcoming and approvals</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Next leave</dt>
              <dd className="text-sm">{profile.nextLeave}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Pending requests</dt>
              <dd className="text-sm">{profile.pendingLeaveRequests}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Leave year</dt>
              <dd className="text-sm">{profile.leaveYear}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Approver</dt>
              <dd className="text-sm">{profile.manager.name}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
