"use client";

import { useState } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Handshake,
  Phone,
  RotateCcw,
  User,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  activityPriorityMeta,
  activityStatusMeta,
  activityTypeMeta,
  getOwnerLabel,
  getRelatedRecords,
  getScheduleState,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import { ActivityForm } from "../../../_components/activities/activity-form";
import {
  CancelActivityDialog,
  CompleteActivityDialog,
  RescheduleActivityDialog,
} from "../../../_components/activities/activity-workflows";
import { useActivityStore } from "../../../_components/activities/use-activity-store";

const today = new Date(2026, 7, 16);

const relatedRecordIcons = {
  Lead: UserRound,
  Contact: User,
  Company: Building2,
  Deal: Handshake,
} as const;

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-foreground text-sm">{children}</span>
    </div>
  );
}

export function ActivityDetail({ activityId }: { activityId: string }) {
  const storeActivity = useActivityStore((s) => s.activities.find((a) => a.id === activityId));
  const activity = storeActivity;
  if (!activity) notFound();

  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const typeMeta = activityTypeMeta[activity.type];
  const statusMeta = activityStatusMeta[activity.status];
  const priorityMeta = activityPriorityMeta[activity.priority];
  const TypeIcon = typeMeta.icon;

  const isScheduled = activity.status === "Scheduled";
  const isCanceled = activity.status === "Canceled";
  const scheduleState = getScheduleState(activity, today);
  const ownerName = getOwnerLabel(activity);
  const relatedRecords = getRelatedRecords(activity);

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        <Link
          href="/dashboard/crm/activities"
          className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Activities
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-full border",
                typeMeta.badgeClass,
              )}
            >
              <TypeIcon className="size-6" />
            </div>
            <div className="min-w-0 space-y-1">
              <h1 className="font-heading font-semibold text-xl tracking-tight">{activity.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                <span className="font-mono text-xs">{activity.id}</span>
                <span className="text-border">·</span>
                <Badge className={cn("font-medium", typeMeta.badgeClass)} variant="outline">
                  {activity.type}
                </Badge>
                <Badge className={cn("gap-1.5 font-medium", statusMeta.badgeClass)} variant="outline">
                  <span className={cn("size-1.5 rounded-full", statusMeta.dotClass)} />
                  {activity.status}
                </Badge>
                <Badge className={cn("font-medium", priorityMeta.badgeClass)} variant="outline">
                  {activity.priority}
                </Badge>
              </div>
              <div className="text-muted-foreground text-sm tabular-nums">
                {format(parseISO(activity.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
                {scheduleState === "Overdue" ? (
                  <span className="ml-2 font-medium text-destructive">Overdue</span>
                ) : null}
                {scheduleState === "Due Today" ? (
                  <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">Due today</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            {isScheduled ? (
              <>
                <Button size="sm" className="gap-1.5" onClick={() => setCompleteOpen(true)}>
                  <CheckCircle2 className="size-3.5" />
                  Mark Complete
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setRescheduleOpen(true)}>
                  <CalendarClock className="size-3.5" />
                  Reschedule
                </Button>
                <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setCancelOpen(true)}>
                  <XCircle className="size-3.5" />
                  Cancel Activity
                </Button>
              </>
            ) : null}
            {isCanceled ? (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setRescheduleOpen(true)}>
                <RotateCcw className="size-3.5" />
                Reschedule
              </Button>
            ) : null}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {activity.description ? (
                  <p className="text-foreground text-sm leading-relaxed">{activity.description}</p>
                ) : (
                  <p className="text-muted-foreground text-sm">No description provided.</p>
                )}
              </CardContent>
            </Card>

            {activity.status === "Completed" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Completion Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem label="Completed On">
                    {activity.completedAt ? format(parseISO(activity.completedAt), "MMM d, yyyy 'at' h:mm a") : "—"}
                  </InfoItem>
                  {activity.durationMinutes ? (
                    <InfoItem label="Actual Duration">{activity.durationMinutes} minutes</InfoItem>
                  ) : null}
                  <Separator />
                  <InfoItem label="Outcome">
                    {activity.outcome ?? <span className="text-muted-foreground">No outcome recorded.</span>}
                  </InfoItem>
                  {activity.completionNotes ? (
                    <InfoItem label="Completion Notes">
                      <p className="text-foreground text-sm leading-relaxed">{activity.completionNotes}</p>
                    </InfoItem>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {activity.status === "Canceled" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem label="Canceled On">
                    {activity.updatedAt ? format(parseISO(activity.updatedAt), "MMM d, yyyy 'at' h:mm a") : "—"}
                  </InfoItem>
                  <InfoItem label="Reason">
                    {activity.cancelReason ?? <span className="text-muted-foreground">No reason recorded.</span>}
                  </InfoItem>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem label="Owner">
                  {activity.ownerId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5 font-medium">
                        <AvatarFallback className="text-[10px]">{getInitials(ownerName)}</AvatarFallback>
                      </Avatar>
                      {ownerName}
                    </div>
                  ) : (
                    "Unassigned"
                  )}
                </InfoItem>
                <InfoItem label="Scheduled For">
                  {format(parseISO(activity.scheduledAt), "EEE, MMM d, yyyy 'at' h:mm a")}
                </InfoItem>
                {(activity.type === "Call" || activity.type === "Email") && activity.direction ? (
                  <InfoItem label="Direction">{activity.direction}</InfoItem>
                ) : null}
                {activity.durationMinutes ? (
                  <InfoItem label="Planned Duration">{activity.durationMinutes} minutes</InfoItem>
                ) : null}
                <Separator />
                <InfoItem label="Created">{format(parseISO(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}</InfoItem>
                {activity.updatedAt ? (
                  <InfoItem label="Updated">{format(parseISO(activity.updatedAt), "MMM d, yyyy 'at' h:mm a")}</InfoItem>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Records</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedRecords.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {relatedRecords.map((record) => {
                      const Icon = relatedRecordIcons[record.type];
                      return record.found ? (
                        <Link
                          key={`${record.type}-${record.id}`}
                          href={record.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-muted/50",
                            record.archived && "opacity-70",
                          )}
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-sm">{record.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {record.type}
                              {record.archived ? " · Archived" : ""}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div
                          key={`${record.type}-${record.id}`}
                          className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5 opacity-70"
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-sm">Unknown {record.type.toLowerCase()}</div>
                            <div className="truncate text-muted-foreground text-xs">{record.id}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Phone />
                      </EmptyMedia>
                      <EmptyTitle>No linked records</EmptyTitle>
                      <EmptyDescription>This activity is not linked to any CRM record.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ActivityForm
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) setEditOpen(false);
        }}
        activity={activity}
      />
      <CompleteActivityDialog
        activity={activity}
        open={completeOpen}
        onOpenChange={(open) => {
          if (!open) setCompleteOpen(false);
        }}
      />
      <CancelActivityDialog
        activity={activity}
        open={cancelOpen}
        onOpenChange={(open) => {
          if (!open) setCancelOpen(false);
        }}
      />
      {activity ? (
        <RescheduleActivityDialog
          activity={activity}
          open={rescheduleOpen}
          onOpenChange={(open) => {
            if (!open) setRescheduleOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
