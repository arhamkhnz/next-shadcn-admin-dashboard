import { CalendarDays, CircleCheck, Clock3, ShieldCheck } from "lucide-react";

import type { ProfileRecord } from "./profile-data";

export function ProfileStatusSidebar({ profile }: { profile: ProfileRecord }) {
  return (
    <aside className="border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
      <h2 className="font-heading font-medium text-sm">Record status</h2>
      <div className="mt-3 flex flex-col divide-y">
        <div className="flex items-start gap-2 py-3">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Active employee</p>
            <p className="text-muted-foreground text-xs">Payroll and access enabled</p>
          </div>
        </div>
        <div className="flex items-start gap-2 py-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Admin view</p>
            <p className="text-muted-foreground text-xs">Private fields are visible</p>
          </div>
        </div>
        <div className="py-3">
          <p className="text-muted-foreground text-xs">Last updated</p>
          <p className="mt-1 text-sm">{profile.lastUpdated}</p>
        </div>
      </div>

      <h2 className="mt-7 font-heading font-medium text-sm">Upcoming</h2>
      <div className="mt-3 flex flex-col divide-y border-y">
        <div className="flex gap-3 py-3">
          <CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Time off</p>
            <p className="text-muted-foreground text-xs">{profile.nextLeave}</p>
          </div>
        </div>
        <div className="flex gap-3 py-3">
          <Clock3 aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Performance review</p>
            <p className="text-muted-foreground text-xs">{profile.nextReview}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
