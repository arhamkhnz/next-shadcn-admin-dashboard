/* eslint-disable max-lines */

import { ChartConfig } from "@/components/ui/chart";

export const leadsChartData = [
  { date: "1-5", newLeads: 120, disqualified: 40 },
  { date: "6-10", newLeads: 95, disqualified: 30 },
  { date: "11-15", newLeads: 60, disqualified: 22 },
  { date: "16-20", newLeads: 100, disqualified: 35 },
  { date: "21-25", newLeads: 150, disqualified: 70 },
  { date: "26-30", newLeads: 110, disqualified: 60 },
];

export const leadsChartConfig = {
  newLeads: {
    label: "New Leads",
    color: "var(--chart-1)",
  },
  disqualified: {
    label: "Disqualified",
    color: "var(--chart-3)",
  },
  background: {
    color: "var(--primary)",
  },
} as ChartConfig;

export const proposalsChartData = [
  { date: "1-5", proposalsSent: 9 },
  { date: "6-10", proposalsSent: 16 },
  { date: "11-15", proposalsSent: 6 },
  { date: "16-20", proposalsSent: 18 },
  { date: "21-25", proposalsSent: 11 },
  { date: "26-30", proposalsSent: 14 },
];

export const proposalsChartConfig = {
  proposalsSent: {
    label: "Proposals Sent",
    color: "var(--chart-1)",
  },
} as ChartConfig;

export const revenueChartData = [
  { month: "Jul 2024", revenue: 6700 },
  { month: "Aug 2024", revenue: 7100 },
  { month: "Sep 2024", revenue: 6850 },
  { month: "Oct 2024", revenue: 7500 },
  { month: "Nov 2024", revenue: 8000 },
  { month: "Dec 2024", revenue: 8300 },
  { month: "Jan 2025", revenue: 7900 },
  { month: "Feb 2025", revenue: 8400 },
  { month: "Mar 2025", revenue: 8950 },
  { month: "Apr 2025", revenue: 9700 },
  { month: "May 2025", revenue: 11200 },
  { month: "Jun 2025", revenue: 9500 },
];

export const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} as ChartConfig;

export const leadsBySourceChartData = [
  { source: "website", leads: 170, fill: "var(--color-website)" },
  { source: "referral", leads: 105, fill: "var(--color-referral)" },
  { source: "social", leads: 90, fill: "var(--color-social)" },
  { source: "cold", leads: 62, fill: "var(--color-cold)" },
  { source: "other", leads: 48, fill: "var(--color-other)" },
];

export const leadsBySourceChartConfig = {
  leads: {
    label: "Leads",
  },
  website: {
    label: "Website",
    color: "var(--chart-1)",
  },
  referral: {
    label: "Referral",
    color: "var(--chart-2)",
  },
  social: {
    label: "Social Media",
    color: "var(--chart-3)",
  },
  cold: {
    label: "Cold Outreach",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} as ChartConfig;

export const projectRevenueChartData = [
  { name: "MVP Development", actual: 82000, target: 90000 },
  { name: "Consultation", actual: 48000, target: 65000 },
  { name: "Framer Sites", actual: 34000, target: 45000 },
  { name: "DevOps Support", actual: 77000, target: 90000 },
  { name: "LLM Training", actual: 68000, target: 80000 },
  { name: "Product Launch", actual: 52000, target: 70000 },
].map((row) => ({
  ...row,
  remaining: Math.max(0, row.target - row.actual),
}));

export const projectRevenueChartConfig = {
  actual: {
    label: "Actual",
    color: "var(--chart-1)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--primary-foreground)",
  },
} as ChartConfig;

export const salesPipelineChartData = [
  { stage: "Leads", value: 680, fill: "var(--chart-1)" },
  { stage: "Qualified", value: 480, fill: "var(--chart-2)" },
  { stage: "Proposal Sent", value: 210, fill: "var(--chart-3)" },
  { stage: "Negotiation", value: 120, fill: "var(--chart-4)" },
  { stage: "Won", value: 45, fill: "var(--chart-5)" },
];

export const salesPipelineChartConfig = {
  value: {
    label: "Leads",
    color: "var(--chart-1)",
  },
  stage: {
    label: "Stage",
  },
} as ChartConfig;

export const regionSalesData = [
  {
    region: "North America",
    sales: 37800,
    percentage: 31,
    growth: "-3.2%",
    isPositive: false,
  },
  {
    region: "Europe",
    sales: 40100,
    percentage: 34,
    growth: "+9.4%",
    isPositive: true,
  },
  {
    region: "Asia Pacific",
    sales: 30950,
    percentage: 26,
    growth: "+12.8%",
    isPositive: true,
  },
  {
    region: "Latin America",
    sales: 12200,
    percentage: 7,
    growth: "-1.7%",
    isPositive: false,
  },
  {
    region: "Middle East & Africa",
    sales: 2450,
    percentage: 2,
    growth: "+6.0%",
    isPositive: true,
  },
];

export const actionItems = [
  {
    id: 1,
    title: "Send kickoff docs",
    desc: "Send onboarding documents and timeline",
    due: "Due today",
    priority: "High",
    priorityColor: "bg-red-100 text-red-700",
    checked: false,
  },
  {
    id: 2,
    title: "Demo call for SaaS MVP",
    desc: "Book Zoom call with client",
    due: "Due tomorrow",
    priority: "Medium",
    priorityColor: "bg-yellow-100 text-yellow-700",
    checked: true,
  },
  {
    id: 3,
    title: "Update case study",
    desc: "Add latest LLM project",
    due: "Due this week",
    priority: "Low",
    priorityColor: "bg-green-100 text-green-700",
    checked: false,
  },
];

export const recentLeadsData = [
  {
    id: "L-1012",
    name: "Guillermo Rauch",
    company: "Vercel",
    status: "Qualified",
    source: "Website",
    lastActivity: "30m ago",
  },
  {
    id: "L-1018",
    name: "Nizzy",
    company: "Mail0",
    status: "Qualified",
    source: "Website",
    lastActivity: "35m ago",
  },
  {
    id: "L-1005",
    name: "Sahaj",
    company: "Tweakcn",
    status: "Negotiation",
    source: "Website",
    lastActivity: "1h ago",
  },
  {
    id: "L-1001",
    name: "Shadcn",
    company: "Shadcn/ui",
    status: "Qualified",
    source: "Website",
    lastActivity: "2h ago",
  },
  {
    id: "L-1003",
    name: "Sam Altman",
    company: "OpenAI",
    status: "Proposal Sent",
    source: "Social Media",
    lastActivity: "4h ago",
  },
  {
    id: "L-1008",
    name: "Michael Andreuzza",
    company: "Lexington Themes",
    status: "Contacted",
    source: "Social Media",
    lastActivity: "5h ago",
  },
  {
    id: "L-1016",
    name: "Skyleen",
    company: "Animate UI",
    status: "Proposal Sent",
    source: "Referral",
    lastActivity: "7h ago",
  },
  {
    id: "L-1007",
    name: "Arham Khan",
    company: "Weblabs Studio",
    status: "Won",
    source: "Website",
    lastActivity: "6h ago",
  },
  {
    id: "L-1011",
    name: "Sebastian Rindom",
    company: "Medusa",
    status: "Proposal Sent",
    source: "Referral",
    lastActivity: "10h ago",
  },
  {
    id: "L-1014",
    name: "Fred K. Schott",
    company: "Astro",
    status: "Contacted",
    source: "Social Media",
    lastActivity: "12h ago",
  },
  {
    id: "L-1010",
    name: "Peer Richelsen",
    company: "Cal.com",
    status: "New",
    source: "Other",
    lastActivity: "8h ago",
  },
  {
    id: "L-1002",
    name: "Ammar Khnz",
    company: "BE",
    status: "Contacted",
    source: "Referral",
    lastActivity: "1d ago",
  },
  {
    id: "L-1015",
    name: "Toby",
    company: "Shadcn UI Kit ",
    status: "Negotiation",
    source: "Other",
    lastActivity: "2d ago",
  },
  {
    id: "L-1006",
    name: "David Haz",
    company: "React Bits",
    status: "Qualified",
    source: "Referral",
    lastActivity: "2d ago",
  },
  {
    id: "L-1004",
    name: "Erşad",
    company: "Align UI",
    status: "New",
    source: "Cold Outreach",
    lastActivity: "3d ago",
  },
];
