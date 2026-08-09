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
  department: string;
  team: string;
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
  nextReview: string;
  lastUpdated: string;
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
  department: "Product",
  team: "Growth Experience",
  workEmail: "hello@arhamkhnz.com",
  personalEmail: "arhamkhnz@gmail.com",
  workPhone: "+1 (415) 555-0148",
  location: "San Francisco, CA",
  workplace: "Remote",
  timezone: "UTC+5:30",
  employeeId: "ST-0284",
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
    name: "Noah Williams",
    role: "VP, Product",
    initials: "NW",
  },
  peers: [
    { name: "Owen Grant", role: "Product Manager", initials: "OG" },
    { name: "Alicia Torres", role: "Staff Researcher", initials: "AT" },
    { name: "Sam Rivera", role: "Design Engineer", initials: "SR" },
  ],
  bio: "Arham leads product design for Growth Experience, partnering with research and engineering from discovery through release. His current focus is making onboarding clearer for multi-team organizations.",
  salary: "$168,000 per year",
  payFrequency: "Semi-monthly",
  currency: "USD",
  compensationEffective: "January 1, 2026",
  bonusTarget: "12% annual target",
  payrollStatus: "Enrolled · Direct deposit",
  timeOffPolicy: "US Flexible Time Off",
  timeOffAvailable: "18 days available",
  timeOffUsed: "7 days used in 2026",
  nextLeave: "August 21–23 · Approved",
  nextReview: "September 30, 2026",
  lastUpdated: "August 8, 2026 by Priya Shah",
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
