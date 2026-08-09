import { LockKeyhole } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { profile } from "./_components/profile-data";
import { ProfileDocuments } from "./_components/profile-documents";
import { EmploymentDetails } from "./_components/profile-employment-details";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileOverview } from "./_components/profile-overview";
import { PersonalDetails } from "./_components/profile-personal-details";
import { ProfileStatusSidebar } from "./_components/profile-status-sidebar";
import { TimeOffDetails } from "./_components/profile-time-off-details";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4" data-content-padding="false">
      <Breadcrumb className="px-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <span>Dashboard</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>People</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Employee directory</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>{profile.name}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProfileHeader profile={profile} />

      <Tabs className="min-h-0 flex-1 gap-0" defaultValue="overview">
        <div className="scrollbar-none touch-pan-x overflow-x-auto overscroll-x-contain border-y">
          <TabsList
            className="w-max min-w-full justify-start gap-4 px-4 *:data-[slot=tabs-trigger]:flex-none"
            variant="line"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="time-off">Time off</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <div className="px-4 md:px-6">
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_auto_18rem]">
              <div className="py-4 lg:pr-6">
                <ProfileOverview profile={profile} />
              </div>
              <Separator className="hidden lg:block" orientation="vertical" />
              <div className="py-4 lg:pl-6">
                <ProfileStatusSidebar profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent className="py-4" value="personal">
            <PersonalDetails profile={profile} />
          </TabsContent>

          <TabsContent className="py-4" value="employment">
            <EmploymentDetails profile={profile} />
          </TabsContent>

          <TabsContent className="py-4" value="compensation">
            <div className="flex items-start gap-3">
              <LockKeyhole aria-hidden="true" className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Restricted information</p>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  Visible to people administrators and authorized finance roles.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="py-4" value="time-off">
            <TimeOffDetails profile={profile} />
          </TabsContent>

          <TabsContent className="py-4" value="documents">
            <ProfileDocuments documents={profile.documents} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
