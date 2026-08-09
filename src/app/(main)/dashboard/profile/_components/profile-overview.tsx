import { ChevronRight, Clock3, Mail, MapPin, Phone, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { PersonReference, ProfileRecord } from "./profile-data";
import { FieldGrid, SectionHeader } from "./profile-fields";

interface ProfileOverviewProps {
  profile: ProfileRecord;
}

function PersonRow({ person, label }: { person: PersonReference; label?: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Avatar>
        <AvatarFallback>{person.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        {label && <p className="text-muted-foreground text-xs">{label}</p>}
        <p className="truncate font-medium text-sm">{person.name}</p>
        <p className="truncate text-muted-foreground text-xs">{person.role}</p>
      </div>
      <Button aria-label={`View ${person.name}`} size="icon-sm" variant="ghost">
        <ChevronRight />
      </Button>
    </div>
  );
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  return (
    <div className="min-w-0">
      <section>
        <SectionHeader title="Public profile" />
        <p className="max-w-3xl text-muted-foreground text-sm leading-6">{profile.bio}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail aria-hidden="true" className="size-4 text-muted-foreground" />
            <span>{profile.workEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone aria-hidden="true" className="size-4 text-muted-foreground" />
            <span>{profile.workPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin aria-hidden="true" className="size-4 text-muted-foreground" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock3 aria-hidden="true" className="size-4 text-muted-foreground" />
            <span>{profile.timezone}</span>
          </div>
        </div>
      </section>

      <Separator className="my-7" />

      <section>
        <SectionHeader title="Employment" />
        <FieldGrid
          fields={[
            { label: "Employee ID", value: profile.employeeId },
            { label: "Employment status", value: profile.status },
            { label: "Job title", value: profile.jobTitle },
            { label: "Department", value: profile.department },
            { label: "Team", value: profile.team },
            { label: "Employment type", value: profile.employmentType },
            { label: "Start date", value: profile.startDate },
            { label: "Tenure", value: profile.tenure },
          ]}
        />
      </section>

      <Separator className="my-7" />

      <section>
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-medium text-base">Reporting line</h2>
            <p className="mt-0.5 text-muted-foreground text-sm">Manager and closest collaborators</p>
          </div>
          <Button size="sm" variant="ghost">
            <Users data-icon="inline-start" />
            Org chart
          </Button>
        </div>
        <PersonRow label="Manager" person={profile.manager} />
        <div className="grid border-t sm:grid-cols-3 sm:divide-x">
          {profile.peers.map((peer) => (
            <div className="sm:px-3 sm:last:pr-0 sm:first:pl-0" key={peer.name}>
              <PersonRow person={peer} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
