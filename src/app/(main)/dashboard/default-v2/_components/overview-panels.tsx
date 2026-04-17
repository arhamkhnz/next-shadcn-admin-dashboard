"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { CustomerFlowRow } from "./customer-flow-table/schema";
import { CustomerFlowTable } from "./customer-flow-table/table";

const recentCustomersData: CustomerFlowRow[] = [
  {
    id: "sarah-parker",
    name: "Sarah Parker",
    accountCount: 3,
    status: "Upgraded",
    statusTone: "success",
    revenue: "$2,500.00",
    assignee: "Sarah P.",
    assigneeInitials: "C",
    assigneeTone: "bg-amber-400",
    lastActivity: "2 days ago",
    paymentStatus: "Full Payment",
    joined: "1 month ago",
    avatarTone: "bg-amber-400",
  },
  {
    id: "mike-brown",
    name: "Mike Brown",
    accountCount: null,
    status: "Trial",
    statusTone: "info",
    revenue: "$420.00",
    assignee: "Alex W.",
    assigneeInitials: "C",
    assigneeTone: "bg-rose-400",
    lastActivity: "3 hours ago",
    paymentStatus: "N/A",
    joined: "5 days ago",
    avatarTone: "bg-sky-400",
  },
  {
    id: "linda-chen",
    name: "Linda Chen",
    accountCount: null,
    status: "At Risk",
    statusTone: "danger",
    revenue: "$1,180.00",
    assignee: "Jane D.",
    assigneeInitials: "S",
    assigneeTone: "bg-violet-400",
    lastActivity: "1 week ago",
    paymentStatus: "Renewal due",
    joined: "2 weeks ago",
    avatarTone: "bg-violet-400",
  },
  {
    id: "david-lee",
    name: "David Lee",
    accountCount: null,
    status: "Active",
    statusTone: "success",
    revenue: "$5,000.00",
    assignee: "John S.",
    assigneeInitials: "C",
    assigneeTone: "bg-lime-400",
    lastActivity: "4 days ago",
    paymentStatus: "$1K Deposit",
    joined: "6 days ago",
    avatarTone: "bg-yellow-400",
  },
  {
    id: "emily-white",
    name: "Emily White",
    accountCount: 5,
    status: "At Risk",
    statusTone: "neutral",
    revenue: "$860.00",
    assignee: "Ali M.",
    assigneeInitials: "S",
    assigneeTone: "bg-zinc-400",
    lastActivity: "15 mins ago",
    paymentStatus: "N/A",
    joined: "1 day ago",
    avatarTone: "bg-rose-400",
  },
  {
    id: "jessica-wong",
    name: "Jessica Wong",
    accountCount: null,
    status: "Active",
    statusTone: "success",
    revenue: "$3,000.00",
    assignee: "Sarah P.",
    assigneeInitials: "C",
    assigneeTone: "bg-amber-400",
    lastActivity: "1 week ago",
    paymentStatus: "Installments: 2/6",
    joined: "3 weeks ago",
    avatarTone: "bg-sky-400",
  },
  {
    id: "kevin-harris",
    name: "Kevin Harris",
    accountCount: null,
    status: "Trial",
    statusTone: "warning",
    revenue: "$310.00",
    assignee: "Jane D.",
    assigneeInitials: "S",
    assigneeTone: "bg-violet-400",
    lastActivity: "1 day ago",
    paymentStatus: "N/A",
    joined: "1 week ago",
    avatarTone: "bg-sky-400",
  },
];

export function OverviewPanels() {
  return (
    <Tabs defaultValue="recent-customers" className="grid gap-4">
      <TabsList variant="line" className="w-fit">
        <TabsTrigger value="recent-customers">Recent Customers</TabsTrigger>
        <TabsTrigger value="key-accounts">Key Accounts</TabsTrigger>
        <TabsTrigger value="billing-watch">Billing Watch</TabsTrigger>
        <TabsTrigger value="customer-health">Customer Health</TabsTrigger>
      </TabsList>
      <CustomerFlowTable
        tabs={[
          { value: "recent-customers", data: recentCustomersData },
          { value: "key-accounts", data: [] },
          { value: "billing-watch", data: [] },
          { value: "customer-health", data: [] },
        ]}
      />
    </Tabs>
  );
}
