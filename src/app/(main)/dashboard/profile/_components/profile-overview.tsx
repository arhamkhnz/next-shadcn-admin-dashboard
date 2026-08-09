"use client";

import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { PersonReference, ProfileRecord } from "./profile-data";

interface ProfileOverviewProps {
  profile: ProfileRecord;
}

interface FieldItem {
  label: string;
  value: string;
}

function SectionHeader({ title, privateSection = false }: { title: string; privateSection?: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="font-heading font-medium text-base">{title}</h2>
        {privateSection && (
          <Badge variant="outline">
            <LockKeyhole data-icon="inline-start" />
            Private
          </Badge>
        )}
      </div>
      <Button size="sm" variant="ghost">
        <Pencil data-icon="inline-start" />
        Edit
      </Button>
    </div>
  );
}

function FieldGrid({ fields }: { fields: FieldItem[] }) {
  return (
    <dl className="grid border-t sm:grid-cols-2">
      {fields.map((field) => (
        <div className="border-b py-3 sm:even:pl-6 sm:odd:pr-6" key={field.label}>
          <dt className="text-muted-foreground text-xs">{field.label}</dt>
          <dd className="mt-1 text-sm">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
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

function VisibilityPanel({ profile }: ProfileOverviewProps) {
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

function OverviewTab({ profile }: ProfileOverviewProps) {
  return (
    <div className="grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
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

      <VisibilityPanel profile={profile} />
    </div>
  );
}

function DetailsTab({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl py-6">{children}</div>;
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  return (
    <Tabs defaultValue="overview">
      <div className="overflow-x-auto border-y px-4 md:px-6">
        <TabsList className="h-11 gap-5 p-0" variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="job">Job</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="time-off">Time off</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
      </div>

      <div className="px-4 md:px-6">
        <TabsContent value="overview">
          <OverviewTab profile={profile} />
        </TabsContent>

        <TabsContent value="personal">
          <DetailsTab>
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
          </DetailsTab>
        </TabsContent>

        <TabsContent value="job">
          <DetailsTab>
            <SectionHeader title="Job information" />
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
          </DetailsTab>
        </TabsContent>

        <TabsContent value="compensation">
          <DetailsTab>
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
          </DetailsTab>
        </TabsContent>

        <TabsContent value="time-off">
          <DetailsTab>
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
          </DetailsTab>
        </TabsContent>

        <TabsContent value="documents">
          <DetailsTab>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-medium text-base">Documents</h2>
                <p className="mt-0.5 text-muted-foreground text-sm">Files attached to this employee record</p>
              </div>
              <Button size="sm">
                <FileText data-icon="inline-start" />
                Add document
              </Button>
            </div>
            <div className="border-y">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead aria-label="Actions" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>{document.category}</TableCell>
                      <TableCell>{document.updated}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{document.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button aria-label={`Download ${document.name}`} size="icon-sm" variant="ghost">
                          <Download />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DetailsTab>
        </TabsContent>
      </div>
    </Tabs>
  );
}
