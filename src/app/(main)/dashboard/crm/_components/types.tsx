import { ReactNode } from "react";

import { BarChart, Clock, CreditCard, DollarSign, Plus, ShoppingCart } from "lucide-react";

export type StatType = {
  icon?: ReactNode;
  title: string;
  subtitle: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  chartGraph?: "bar" | "line";
  chart?: {
    data: number[];
    labels?: string[];
  };
};

export const stats: StatType[] = [
  {
    title: "Order",
    subtitle: "Last Week",
    value: "124k",
    change: "+12.6%",
    changeType: "positive",
    chartGraph: "bar",
    chart: { data: [60, 45, 20, 40, 70, 50, 65] },
    // chart: <BarChartMini data={[60, 45, 20, 40, 70, 50, 65]} />,
  },
  {
    title: "Sales",
    subtitle: "Last Year",
    value: "175k",
    change: "-16.2%",
    changeType: "negative",
    chartGraph: "line",
    chart: { data: [10, 30, 60, 50, 70, 45, 60] },
    // chart: <LineChartMini data={[10, 30, 20, 50, 70, 45, 60]} />,
  },
  {
    icon: <CreditCard />,
    title: "Total Profit",
    subtitle: "Last Week",
    value: "1.28k",
    change: "-12.2%",
    changeType: "negative",
  },
  {
    icon: <DollarSign />,
    title: "Total Sales",
    subtitle: "Last Week",
    value: "24.67k",
    change: "+24.67%",
    changeType: "positive",
  },
  {
    title: "Revenue Growth",
    subtitle: "Weekly Report",
    value: "$4,673",
    change: "+15.2%",
    changeType: "positive",
    chartGraph: "bar",
    chart: {
      data: [10, 20, 30, 60, 80, 70, 65],
      labels: ["M", "T", "W", "T", "F", "S", "S"],
    },
  },
];

export const dataMap: Record<string, { label: string; icon: React.ReactNode; data: number[]; labels: string[] }> = {
  Orders: {
    label: "Orders",
    icon: <ShoppingCart size={16} />,
    data: [20, 30, 40, 50, 60, 70, 80, 60, 58, 40, 30, 20],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  Sales: {
    label: "Sales",
    icon: <BarChart size={16} />,
    data: [80, 60, 40, 20, 10, 30, 50, 20, 30, 40, 50, 60],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  Profit: {
    label: "Profit",
    icon: <DollarSign size={16} />,
    data: [40, 60, 50, 40, 70, 65, 35, 10, 30, 50, 20, 30],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  Income: {
    label: "Income",
    icon: <Clock size={16} />,
    data: [80, 60, 40, 20, 10, 30, 50, 20, 30, 40, 50, 60],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  add: {
    label: "Add",
    icon: <Plus size={20} />,
    data: [],
    labels: [],
  },
};

export const countries = [
  {
    name: "United States",
    flag: "/flags/us.svg",
    sales: "$80.45k",
    change: "42.8%",
    isPositive: true,
  },
  {
    name: "Brazil",
    flag: "/flags/br.svg",
    sales: "$17.78k",
    change: "36.2%",
    isPositive: false,
  },
  {
    name: "India",
    flag: "/flags/india.svg",
    sales: "$6.48k",
    change: "12.3%",
    isPositive: true,
  },
  {
    name: "Australia",
    flag: "/flags/au.svg",
    sales: "$15.12k",
    change: "17.9%",
    isPositive: false,
  },
  {
    name: "France",
    flag: "/flags/fr.svg",
    sales: "$2.45k",
    change: "6.2%",
    isPositive: true,
  },
  {
    name: "China",
    flag: "/flags/cn.svg",
    sales: "$7.90k",
    change: "10.8%",
    isPositive: true,
  },
];

export const projects = [
  {
    name: "Laravel",
    desc: "eCommerce",
    percent: 54,
    color: "bg-red-500",
    icon: "/icons/laravel.svg",
  },
  {
    name: "Figma",
    desc: "App UI Kit",
    percent: 85,
    color: "bg-violet-600",
    icon: "/icons/figma.svg",
  },
  {
    name: "VusJs",
    desc: "Calendar App",
    percent: 64,
    color: "bg-green-500",
    icon: "/icons/vuejs.svg",
  },
  {
    name: "React",
    desc: "Dashboard",
    percent: 40,
    color: "bg-cyan-500",
    icon: "/icons/react.svg",
  },
  {
    name: "Bootstrap",
    desc: "Website",
    percent: 17,
    color: "bg-purple-600",
    icon: "/icons/bootstrap.svg",
  },
  {
    name: "Sketch",
    desc: "Website Design",
    percent: 30,
    color: "bg-orange-400",
    icon: "/icons/sketch.svg",
  },
];

export const cards = [
  {
    card: "/cards/visa.png",
    number: "*4230",
    through: "Credit",
    date: "17 Mar 2025",
    amount_status: "Sent",
    status: "verified",
    amount: "+$329",
  },
  {
    card: "/cards/mc.jpg",
    number: "*5578",
    through: "Credit",
    date: "12 Feb 2025",
    amount_status: "Sent",
    status: "Rejected",
    amount: "-$839",
  },

  {
    card: "/cards/ae.jpg",
    number: "*4567",
    through: "ATM",
    date: "28 Feb 2025",
    amount_status: "Sent",
    status: "verified",
    amount: "+$423",
  },
  {
    card: "/cards/visa.png",
    number: "*5699",
    through: "Credit",
    date: "08 Jan 2025",
    amount_status: "Sent",
    status: "Pending",
    amount: "+$2,345",
  },
  {
    card: "/cards/visa.png",
    number: "*2451",
    through: "Credit",
    date: "19 Oct 2025",
    amount_status: "Sent",
    status: "Rejected",
    amount: "+$1,758",
  },
];
export type ActivityContent =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; value: string; designation?: string }
  | { type: "file"; name: string; icon: string };

export type Activity = {
  title: string;
  description: string;
  time: string;
  content: ActivityContent[];
};

export const activities: Activity[] = [
  {
    title: "20 Invoices have been paid",
    description: "Invoices have been paid to the company",
    time: "12 mins ago",
    content: [{ type: "file", name: "invoices.pdf", icon: "/icons/pdf.svg" }],
  },
  {
    title: "Client Meeting",
    description: "Project meeting with john @10:15am",
    time: "26 mins ago",
    content: [
      { type: "image", src: "/avatars/a2.jpg", alt: "picture" },
      { type: "text", value: "Lester McCarthy (Client)", designation: "CEO of Pixinvent" },
    ],
  },
  {
    title: "Create a new project for client",
    description: "5 team members in a project",
    time: "2 mins ago",
    content: [
      { type: "image", src: "/avatars/a1.jpg", alt: "a1 pic" },
      { type: "image", src: "/avatars/a2.jpg", alt: "a2 pic" },
      { type: "image", src: "/avatars/jd.svg", alt: "jd pic" },
      { type: "image", src: "/avatars/mt.png", alt: "mt pic" },
      { type: "image", src: "/avatars/arhamkhnz.png", alt: "khnz pic" },
    ],
  },
];
