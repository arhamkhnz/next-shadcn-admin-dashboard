import { CalendarDays, CircleCheck, Clock3 } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function ProfileStatusSidebar({ profile }: { profile: ProfileRecord }) {
  return (
    <aside>
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-sm font-medium">Record status</h2>
        <div className="flex items-start gap-2">
          <CircleCheck aria-hidden="true" className="text-muted-foreground mt-0.5 size-4" />
          <div>
            <p className="text-sm font-medium">Active contractor</p>
            <p className="text-muted-foreground text-xs">Contract and access active</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          Updated {profile.updatedAt} by {profile.updatedBy}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-medium">Upcoming events</h2>
        <div className="flex flex-col">
          <div className="flex gap-3 py-2.5">
            <CalendarDays aria-hidden="true" className="text-muted-foreground mt-0.5 size-4" />
            <div>
              <p className="text-sm font-medium">Time off</p>
              <p className="text-muted-foreground text-xs">{profile.nextLeave}</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3 py-2.5">
            <Clock3 aria-hidden="true" className="text-muted-foreground mt-0.5 size-4" />
            <div>
              <p className="text-sm font-medium">Last working day</p>
              <p className="text-muted-foreground text-xs">{profile.lastWorkingDay}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
