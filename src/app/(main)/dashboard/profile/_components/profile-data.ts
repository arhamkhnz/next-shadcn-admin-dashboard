interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: "Signed" | "Current";
  isRestricted: boolean;
}

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  engagementStatus: "Active";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  workplace: string;
  timeZone: string;
  contractorId: string;
  startDate: string;
  engagementLength: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  bio: string;
  leavePolicy: string;
  annualLeaveAllowance: string;
  remainingLeave: string;
  carriedOverLeave: string;
  usedLeave: string;
  scheduledLeave: string;
  pendingLeaveRequests: string;
  leaveYear: string;
  nextLeave: string;
  lastWorkingDay: string;
  updatedBy: string;
  updatedAt: string;
  documents: ProfileDocument[];
}

export const profile: ProfileRecord = {
  name: "Arham Khan",
  preferredName: "Arham",
  legalName: "Arham Khan",
  pronouns: "He / him",
  initials: "AK",
  avatar: "https://avatars.githubusercontent.com/u/43849669",
  engagementStatus: "Active",
  jobTitle: "Software Engineer",
  jobLevel: "Senior",
  department: "Product",
  team: "Product",
  currentProject: "Autonomous Bid Agent",
  workEmail: "hello@arhamkhnz.com",
  personalEmail: "arhamkhnz@gmail.com",
  workPhone: "+1 (415) 555-0148",
  workplace: "Remote",
  timeZone: "UTC+5:30",
  contractorId: "WS-2301",
  startDate: "March 18, 2022",
  engagementLength: "4 years, 4 months",
  employmentType: "Contractor",
  weeklyHours: "40 hours",
  schedule: "Monday–Friday · 9:00 AM–5:30 PM",
  contractingEntity: "Studio Technologies Pte. Ltd.",
  noticePeriod: "30 days",
  dateOfBirth: "September 9, 1993",
  address: "1842 Valencia Street, San Francisco, CA 94110",
  emergencyContact: "Ammar K. · Brother",
  emergencyPhone: "+1 (510) 555-0177",
  manager: {
    name: "Pravi K.",
    role: "Head of Product",
    initials: "PK",
  },
  bio: "Arham is a software engineer on the product team, building bids and tender management software, including autonomous bid agents that streamline opportunity discovery, requirement analysis, document preparation, compliance checks, pricing, and submission. He focuses on turning complex tender workflows into reliable, easy-to-use products that help teams work faster and make better bidding decisions.",
  leavePolicy: "Contract leave allowance",
  annualLeaveAllowance: "25 days",
  remainingLeave: "18 days",
  carriedOverLeave: "0 days",
  usedLeave: "7 days",
  scheduledLeave: "5 days",
  pendingLeaveRequests: "0",
  leaveYear: "January 1–December 31, 2026",
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "October 3, 2026",
  updatedBy: "Arham Khan",
  updatedAt: "August 8, 2026",
  documents: [
    {
      id: "doc-1",
      name: "Contractor agreement",
      category: "Contract",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "Confidentiality agreement",
      category: "Compliance",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "Information security policy acknowledgement",
      category: "Policy",
      updatedAt: "Jan 8, 2026",
      status: "Current",
      isRestricted: false,
    },
  ],
};
