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
  status: "Signed" | "Verified" | "Current";
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
  probationEnd: string;
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
  timeOffAvailable: string;
  timeOffUsed: string;
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
  probationEnd: "Completed June 18, 2022",
  birthday: "September 9, 1993",
  address: "1842 Valencia Street, San Francisco, CA 94110",
  emergencyContact: "Daniel Chen · Brother",
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
  timeOffPolicy: "US Flexible Time Off",
  timeOffAvailable: "18 days available",
  timeOffUsed: "7 days used in 2026",
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "October 3, 2026",
  updatedBy: "Arham Khan",
  updatedAt: "August 8, 2026",
  documents: [
    { id: "doc-1", name: "Employment agreement", category: "Employment", updated: "Mar 18, 2022", status: "Signed" },
    {
      id: "doc-2",
      name: "Confidentiality agreement",
      category: "Compliance",
      updated: "Mar 18, 2022",
      status: "Signed",
    },
    { id: "doc-3", name: "Form I-9", category: "Eligibility", updated: "Mar 21, 2022", status: "Verified" },
    {
      id: "doc-4",
      name: "Employee handbook acknowledgement",
      category: "Policy",
      updated: "Jan 8, 2026",
      status: "Current",
    },
  ],
};
