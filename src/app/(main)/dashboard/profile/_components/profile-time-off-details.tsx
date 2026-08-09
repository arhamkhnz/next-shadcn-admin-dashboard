import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function TimeOffDetails({ profile }: { profile: ProfileRecord }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Leave balance</h2>
        <dl className="grid gap-x-12 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Policy</dt>
            <dd className="text-sm">{profile.timeOffPolicy}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Annual allowance</dt>
            <dd className="text-sm">{profile.timeOffAnnualAllowance}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Remaining</dt>
            <dd className="text-sm">{profile.timeOffRemaining}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Carried over</dt>
            <dd className="text-sm">{profile.timeOffCarriedOver}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Used this year</dt>
            <dd className="text-sm">{profile.timeOffUsed}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Scheduled</dt>
            <dd className="text-sm">{profile.timeOffScheduled}</dd>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Upcoming and approvals</h2>
        <dl className="grid gap-x-12 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Next leave</dt>
            <dd className="text-sm">{profile.nextLeave}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Pending requests</dt>
            <dd className="text-sm">{profile.timeOffPendingRequests}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Leave year</dt>
            <dd className="text-sm">{profile.timeOffLeaveYear}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">Approver</dt>
            <dd className="text-sm">{profile.manager.name}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
