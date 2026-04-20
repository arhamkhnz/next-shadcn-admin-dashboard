"use client";

import type * as React from "react";

import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency } from "@/lib/utils";

const activityData = [
  {
    id: 1,
    type: "deal-won",
    title: "Deal closed with Vercel",
    description: "Successfully closed the $85K MVP development deal",
    amount: 85000,
    user: {
      name: "Guillermo Rauch",
      avatar: "https://avatars.githubusercontent.com/u/12345",
      initials: "GR",
    },
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "success",
    priority: "high",
  },
  {
    id: 2,
    type: "meeting-scheduled",
    title: "Demo call scheduled with OpenAI",
    description: "Product demo for the enterprise plan",
    user: {
      name: "Sam Altman",
      avatar: "https://avatars.githubusercontent.com/u/12346",
      initials: "SA",
    },
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "upcoming",
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: "high",
  },
  {
    id: 3,
    type: "email-sent",
    title: "Proposal sent to Shadcn",
    description: "Custom UI kit development proposal - $45K",
    amount: 45000,
    user: {
      name: "Shadcn",
      avatar: "https://avatars.githubusercontent.com/u/12347",
      initials: "SH",
    },
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "pending",
    priority: "medium",
  },
  {
    id: 4,
    type: "lead-qualified",
    title: "Lead qualified: Astro team",
    description: "Moved from New to Qualified stage",
    user: {
      name: "Fred K. Schott",
      avatar: "https://avatars.githubusercontent.com/u/12348",
      initials: "FS",
    },
    time: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: "success",
    priority: "medium",
  },
  {
    id: 5,
    type: "follow-up",
    title: "Follow-up required: Cal.com",
    description: "Stalled for 14 days - needs urgent attention",
    user: {
      name: "Peer Richelsen",
      avatar: "https://avatars.githubusercontent.com/u/12349",
      initials: "PR",
    },
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "at-risk",
    priority: "high",
  },
  {
    id: 6,
    type: "payment-received",
    title: "Payment received from Medusa",
    description: "First installment of $12.5K received",
    amount: 12500,
    user: {
      name: "Sebastian Rindom",
      avatar: "https://avatars.githubusercontent.com/u/12350",
      initials: "SR",
    },
    time: new Date(Date.now() - 36 * 60 * 60 * 1000),
    status: "success",
    priority: "low",
  },
  {
    id: 7,
    type: "call-completed",
    title: "Discovery call with Mail0",
    description: "Great conversation, scheduled follow-up demo",
    user: {
      name: "Nizzy",
      avatar: "https://avatars.githubusercontent.com/u/12351",
      initials: "NZ",
    },
    time: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: "success",
    priority: "medium",
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Demo with OpenAI",
    description: "Enterprise product demo",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    priority: "high",
    type: "meeting",
  },
  {
    id: 2,
    title: "Follow up on Astro deal",
    description: "Send revised proposal",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    priority: "medium",
    type: "email",
  },
  {
    id: 3,
    title: "QBR with Vercel",
    description: "Quarterly business review",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: "high",
    type: "meeting",
  },
  {
    id: 4,
    title: "Update CRM records",
    description: "Clean up stalled deals",
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    priority: "low",
    type: "task",
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  "deal-won": <DollarSign className="size-4" />,
  "meeting-scheduled": <Calendar className="size-4" />,
  "email-sent": <Mail className="size-4" />,
  "lead-qualified": <Users className="size-4" />,
  "follow-up": <Clock className="size-4" />,
  "payment-received": <DollarSign className="size-4" />,
  "call-completed": <Phone className="size-4" />,
};

const statusColors: Record<string, string> = {
  success: "bg-green-500/10 text-green-500",
  pending: "bg-blue-500/10 text-blue-500",
  upcoming: "bg-primary/10 text-primary",
  "at-risk": "bg-destructive/10 text-destructive",
};

const priorityBadges: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"; label: string }
> = {
  high: { variant: "destructive", label: "High" },
  medium: { variant: "secondary", label: "Medium" },
  low: { variant: "outline", label: "Low" },
};

export function ActivityTimeline() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity & Tasks</CardTitle>
            <CardDescription>Track recent activities and upcoming tasks</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-1.5 size-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="mb-4 w-full grid-cols-2">
            <TabsTrigger value="activity" className="flex-1">
              <TrendingUp className="mr-1.5 size-4" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">
              <CheckCircle className="mr-1.5 size-4" />
              Upcoming Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="mt-0">
            <div className="relative">
              {activityData.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        statusColors[activity.status],
                      )}
                    >
                      {typeIcons[activity.type]}
                    </div>
                    {index < activityData.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <Badge variant={priorityBadges[activity.priority].variant} className="h-4 text-[10px]">
                          {priorityBadges[activity.priority].label}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Add Note</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Schedule Follow-up</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{activity.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          <AvatarFallback className="text-[10px]">{activity.user.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-xs">{activity.user.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {formatDistanceToNow(activity.time, { addSuffix: true })}
                      </span>
                      {activity.amount && (
                        <>
                          <span className="text-muted-foreground text-xs">•</span>
                          <span className="font-medium text-xs text-green-500">
                            {formatCurrency(activity.amount, { noDecimals: true })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tasks" className="mt-0">
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50",
                    task.priority === "high" && "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                      task.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : task.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-green-500/10 text-green-500",
                    )}
                  >
                    {task.type === "meeting" ? (
                      <Calendar className="size-3" />
                    ) : task.type === "email" ? (
                      <Mail className="size-3" />
                    ) : (
                      <CheckCircle className="size-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{task.title}</h4>
                      <Badge variant={priorityBadges[task.priority].variant} className="h-4 text-[10px] ml-2 shrink-0">
                        {priorityBadges[task.priority].label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">{task.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs tabular-nums">
                        Due: {format(task.dueDate, "MMM d, h:mm a")}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs" className="shrink-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="cursor-pointer">Mark Complete</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Reschedule</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Delegate</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <CheckCircle className="size-3 text-green-500" />
                <span>8 tasks completed this week</span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All Tasks
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
