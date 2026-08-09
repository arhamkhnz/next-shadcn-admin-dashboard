export interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updated: string;
  status: "Signed" | "Current";
  restricted: boolean;
}

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  status: "Active";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  location: string;
  workplace: string;
  timezone: string;
  employeeId: string;
  startDate: string;
  tenure: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  birthday: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  peers: PersonReference[];
  bio: string;
  salary: string;
  payFrequency: string;
  currency: string;
  compensationEffective: string;
  bonusTarget: string;
  payrollStatus: string;
  timeOffPolicy: string;
  timeOffAnnualAllowance: string;
  timeOffRemaining: string;
  timeOffCarriedOver: string;
  timeOffUsed: string;
  timeOffScheduled: string;
  timeOffPendingRequests: string;
  timeOffLeaveYear: string;
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
  status: "Active",
  jobTitle: "Software Engineer",
  jobLevel: "Senior",
  department: "Product",
  team: "Product",
  currentProject: "Autonomous Bid Agent",
  workEmail: "hello@arhamkhnz.com",
  personalEmail: "arhamkhnz@gmail.com",
  workPhone: "+1 (415) 555-0148",
  location: "San Francisco, CA",
  workplace: "Remote",
  timezone: "UTC+5:30",
  employeeId: "WS-2301",
  startDate: "March 18, 2022",
  tenure: "4 years, 4 months",
  employmentType: "Contractor",
  weeklyHours: "40 hours",
  schedule: "Monday–Friday · 9:00 AM–5:30 PM",
  contractingEntity: "Studio Technologies Pte. Ltd.",
  noticePeriod: "30 days",
  birthday: "September 9, 1993",
  address: "1842 Valencia Street, San Francisco, CA 94110",
  emergencyContact: "Ammar K. · Brother",
  emergencyPhone: "+1 (510) 555-0177",
  manager: {
    name: "Pravi K.",
    role: "Head of Product",
    initials: "PK",
  },
  peers: [
    { name: "Owen Grant", role: "Product Manager", initials: "OG" },
    { name: "Alicia Torres", role: "Staff Researcher", initials: "AT" },
    { name: "Sam Rivera", role: "Design Engineer", initials: "SR" },
  ],
  bio: "Arham is a software engineer on the product team, building bids and tender management software, including autonomous bid agents that streamline opportunity discovery, requirement analysis, document preparation, compliance checks, pricing, and submission. He focuses on turning complex tender workflows into reliable, easy-to-use products that help teams work faster and make better bidding decisions.",
  salary: "$168,000 per year",
  payFrequency: "Semi-monthly",
  currency: "USD",
  compensationEffective: "January 1, 2026",
  bonusTarget: "12% annual target",
  payrollStatus: "Enrolled · Direct deposit",
  timeOffPolicy: "Contract leave allowance",
  timeOffAnnualAllowance: "25 days",
  timeOffRemaining: "18 days",
  timeOffCarriedOver: "0 days",
  timeOffUsed: "7 days",
  timeOffScheduled: "5 days",
  timeOffPendingRequests: "0",
  timeOffLeaveYear: "January 1–December 31, 2026",
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "October 3, 2026",
  updatedBy: "Arham Khan",
  updatedAt: "August 8, 2026",
  documents: [
    {
      id: "doc-1",
      name: "Employment agreement",
      category: "Employment",
      updated: "Mar 18, 2022",
      status: "Signed",
      restricted: false,
    },
    {
      id: "doc-2",
      name: "Confidentiality agreement",
      category: "Compliance",
      updated: "Mar 18, 2022",
      status: "Signed",
      restricted: true,
    },
    {
      id: "doc-4",
      name: "Employee handbook acknowledgement",
      category: "Policy",
      updated: "Jan 8, 2026",
      status: "Current",
      restricted: false,
    },
  ],
};
