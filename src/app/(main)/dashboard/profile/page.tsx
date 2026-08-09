import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { profile } from "./_components/profile-data";
import { CompensationDetails, EmploymentDetails, PersonalDetails, TimeOffDetails } from "./_components/profile-details";
import { ProfileDocuments } from "./_components/profile-documents";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileOverview } from "./_components/profile-overview";
import { ProfileStatusSidebar } from "./_components/profile-status-sidebar";

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

      <Tabs defaultValue="overview">
        <TabsList
          className="w-full justify-start gap-4 border-y px-4 *:data-[slot=tabs-trigger]:flex-none"
          variant="line"
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
          <TabsTrigger value="time-off">Time off</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <div className="px-4 md:px-6">
          <TabsContent value="overview">
            <div className="grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <ProfileOverview profile={profile} />
              <ProfileStatusSidebar profile={profile} />
            </div>
          </TabsContent>

          <TabsContent value="personal">
            <PersonalDetails profile={profile} />
          </TabsContent>

          <TabsContent value="employment">
            <EmploymentDetails profile={profile} />
          </TabsContent>

          <TabsContent value="compensation">
            <CompensationDetails profile={profile} />
          </TabsContent>

          <TabsContent value="time-off">
            <TimeOffDetails profile={profile} />
          </TabsContent>

          <TabsContent value="documents">
            <ProfileDocuments documents={profile.documents} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
