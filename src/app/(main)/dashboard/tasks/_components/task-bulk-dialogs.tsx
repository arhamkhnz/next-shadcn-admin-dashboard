"use client";

import { useState } from "react";

import { CalendarClock, CheckCircle2, CircleDotDashed, Flag, User, XCircle } from "lucide-react";

import type {
  ActivityPriority,
  ActivityStatus,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import { activityPriorityOptions } from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BulkDialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
}

function taskLabel(count: number) {
  return count === 1 ? "task" : "tasks";
}

interface BulkAssignOwnerDialogProps extends BulkDialogBaseProps {
  onConfirm: (ownerId: string) => void;
}

export function TaskBulkAssignOwnerDialog({ open, onOpenChange, count, onConfirm }: BulkAssignOwnerDialogProps) {
  const [ownerId, setOwnerId] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setOwnerId("");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-4" />
            Assign Owner to {count} {taskLabel(count)}
          </DialogTitle>
          <DialogDescription>Select a sales owner to assign to the selected tasks.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>
              New Owner <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {salesOwners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!ownerId}
            onClick={() => {
              if (!ownerId) return;
              onConfirm(ownerId);
              handleOpenChange(false);
            }}
          >
            Assign Owner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkSetPriorityDialogProps extends BulkDialogBaseProps {
  onConfirm: (priority: ActivityPriority) => void;
}

export function TaskBulkSetPriorityDialog({ open, onOpenChange, count, onConfirm }: BulkSetPriorityDialogProps) {
  const [priority, setPriority] = useState<ActivityPriority | "">("");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setPriority("");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="size-4" />
            Change Priority for {count} {taskLabel(count)}
          </DialogTitle>
          <DialogDescription>Choose a new priority for the selected tasks.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>
              Priority <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={priority} onValueChange={(v) => setPriority(v as ActivityPriority)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activityPriorityOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!priority}
            onClick={() => {
              if (!priority) return;
              onConfirm(priority);
              handleOpenChange(false);
            }}
          >
            Change Priority
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkSetStatusDialogProps extends BulkDialogBaseProps {
  onConfirm: (status: ActivityStatus) => void;
}

export function TaskBulkSetStatusDialog({ open, onOpenChange, count, onConfirm }: BulkSetStatusDialogProps) {
  const [status, setStatus] = useState<ActivityStatus | "">("");
  const activeStatuses: readonly ActivityStatus[] = ["To Do", "In Progress"];

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setStatus("");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CircleDotDashed className="size-4" />
            Change Status for {count} {taskLabel(count)}
          </DialogTitle>
          <DialogDescription>Move the selected tasks to To Do or In Progress.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>
              Status <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={status} onValueChange={(v) => setStatus(v as ActivityStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activeStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!status}
            onClick={() => {
              if (!status) return;
              onConfirm(status);
              handleOpenChange(false);
            }}
          >
            Change Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkRescheduleDialogProps extends BulkDialogBaseProps {
  onConfirm: (dueAt: string) => void;
}

export function TaskBulkRescheduleDialog({ open, onOpenChange, count, onConfirm }: BulkRescheduleDialogProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setDate("");
      setTime("10:00");
    }
    onOpenChange(nextOpen);
  }

  const valid = Boolean(date && time && !Number.isNaN(new Date(`${date}T${time}:00`).getTime()));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="size-4" />
            Reschedule {count} {taskLabel(count)}
          </DialogTitle>
          <DialogDescription>Set a new due date and time for the selected tasks.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Field className="gap-1.5">
              <FieldLabel>
                New Due Date <span className="text-destructive">*</span>
              </FieldLabel>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field className="gap-1.5">
              <FieldLabel>
                New Due Time <span className="text-destructive">*</span>
              </FieldLabel>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!valid}
            onClick={() => {
              if (!valid) return;
              onConfirm(new Date(`${date}T${time}:00`).toISOString());
              handleOpenChange(false);
            }}
          >
            Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkCompleteDialogProps extends BulkDialogBaseProps {
  onConfirm: (outcome: string) => void;
}

export function TaskBulkCompleteDialog({ open, onOpenChange, count, onConfirm }: BulkCompleteDialogProps) {
  const [outcome, setOutcome] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setOutcome("");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Complete {count} {taskLabel(count)}
          </DialogTitle>
          <DialogDescription>The shared outcome is recorded on every completed task.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>
              Outcome <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="e.g. Follow-up completed during weekly review"
              className="min-h-[70px]"
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!outcome.trim()}
            onClick={() => {
              if (!outcome.trim()) return;
              onConfirm(outcome.trim());
              handleOpenChange(false);
            }}
          >
            Mark Completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkCancelDialogProps extends BulkDialogBaseProps {
  onConfirm: (reason?: string) => void;
}

export function TaskBulkCancelDialog({ open, onOpenChange, count, onConfirm }: BulkCancelDialogProps) {
  const [reason, setReason] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setReason("");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="size-4" />
            Cancel {count} {taskLabel(count)}
          </DialogTitle>
          <DialogDescription>The selected tasks will be marked as Canceled.</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>Reason (optional)</FieldLabel>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. No longer required by the customer"
              className="min-h-[70px]"
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Keep Tasks
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm(reason.trim() || undefined);
              handleOpenChange(false);
            }}
          >
            Cancel Tasks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
