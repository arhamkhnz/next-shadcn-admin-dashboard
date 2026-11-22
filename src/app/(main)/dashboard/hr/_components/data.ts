import { BriefcaseBusiness, CalendarDays, UserRoundMinus, UserRoundPlus, Users } from "lucide-react";

export const departments = [
  "Finance",
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Human resources",
  "Operations",
  "Support",
];

export const overtimePeriods = [
  {
    value: "this-month",
    label: "This month",
    data: { approved: 98, pending: 20, rejected: 8 },
  },
  {
    value: "last-month",
    label: "Last month",
    data: { approved: 84, pending: 10, rejected: 6 },
  },
  {
    value: "last-3-months",
    label: "Last 3 months",
    data: { approved: 254, pending: 36, rejected: 20 },
  },
];

export const genderByAgeGroup = [
  { ageGroup: "20–24", female: 12, male: 25 },
  { ageGroup: "25–29", female: 34, male: 18 },
  { ageGroup: "30–34", female: 22, male: 38 },
  { ageGroup: "35–39", female: 30, male: 20 },
  { ageGroup: "40–44", female: 14, male: 24 },
  { ageGroup: "45–49", female: 16, male: 7 },
  { ageGroup: "50+", female: 8, male: 4 },
];

export const employeeTenure = [
  { years: "<1 yr", employees: 42 },
  { years: "1–2 yrs", employees: 76 },
  { years: "3–5 yrs", employees: 94 },
  { years: "6–9 yrs", employees: 44 },
  { years: "10+ yrs", employees: 16 },
];

export const hiringPipeline = [
  { stage: "Applied", candidates: 124 },
  { stage: "Screening", candidates: 38 },
  { stage: "Assessment", candidates: 24 },
  { stage: "Interview", candidates: 18 },
  { stage: "Offer", candidates: 6 },
];

export const kpiMetrics = [
  {
    label: "Total employees",
    value: "272",
    icon: Users,
    change: "+6%",
    comparison: "vs last month",
  },
  {
    label: "New hires",
    value: "18",
    icon: UserRoundPlus,
    change: "+4",
    comparison: "vs last month",
  },
  {
    label: "Open positions",
    value: "12",
    icon: BriefcaseBusiness,
    change: "",
    comparison: "5 departments hiring",
  },
  {
    label: "On leave today",
    value: "8",
    icon: CalendarDays,
    change: "",
    comparison: "3 returning tomorrow",
  },
  {
    label: "Employees left",
    value: "6",
    icon: UserRoundMinus,
    change: "",
    comparison: "This month",
  },
];

export const attendanceData = [
  { date: "2026-11-02", present: 208, onLeave: 18, absent: 9 },
  { date: "2026-11-03", present: 248, onLeave: 7, absent: 4 },
  { date: "2026-11-04", present: 178, onLeave: 28, absent: 14 },
  { date: "2026-11-05", present: 236, onLeave: 12, absent: 6 },
  { date: "2026-11-06", present: 162, onLeave: 24, absent: 10 },
  { date: "2026-11-09", present: 222, onLeave: 9, absent: 5 },
  { date: "2026-11-10", present: 194, onLeave: 32, absent: 16 },
  { date: "2026-11-11", present: 254, onLeave: 6, absent: 3 },
  { date: "2026-11-12", present: 172, onLeave: 26, absent: 18 },
  { date: "2026-11-13", present: 148, onLeave: 35, absent: 12 },
  { date: "2026-11-16", present: 232, onLeave: 14, absent: 8 },
  { date: "2026-11-17", present: 184, onLeave: 30, absent: 15 },
  { date: "2026-11-18", present: 258, onLeave: 5, absent: 3 },
  { date: "2026-11-19", present: 216, onLeave: 20, absent: 11 },
  { date: "2026-11-20", present: 168, onLeave: 8, absent: 19 },
];
