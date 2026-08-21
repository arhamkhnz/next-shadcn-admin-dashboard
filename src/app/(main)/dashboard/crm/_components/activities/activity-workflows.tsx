"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { Activity } from "./activity-schema";
import { formatActivityDateTime, getTaskDueAt, isTaskActivity } from "./activity-utils";
import { useActivityStore } from "./use-activity-store";

/* -------------------------------------------------------------------------- */
/* Complete Activity Dialog                                                   */
/* -------------------------------------------------------------------------- */

const completeSchema = z.object({
  outcome: z
    .string()
    .trim()
    .min(1, { message: "Outcome is required." })
    .max(300, { message: "Outcome must be 300 characters or fewer." }),
  completionNotes: z.string().trim().max(2000, { message: "Notes must be 2000 characters or fewer." }),
  actualDurationMinutes: z.string(),
  completedDate: z.string(),
});

type CompleteValues = z.infer<typeof completeSchema>;

interface CompleteActivityDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function todayDateString(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function CompleteActivityDialog({ activity, open, onOpenChange }: CompleteActivityDialogProps) {
  const completeActivity = useActivityStore((s) => s.completeActivity);

  const form = useForm<CompleteValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: { outcome: "", completionNotes: "", actualDurationMinutes: "", completedDate: todayDateString() },
  });

  useEffect(() => {
    if (open) {
      form.reset({ outcome: "", completionNotes: "", actualDurationMinutes: "", completedDate: todayDateString() });
    }
  }, [open, form]);

  function onSubmit(values: CompleteValues) {
    if (!activity) return;
    const actualDuration = values.actualDurationMinutes ? Number.parseInt(values.actualDurationMinutes, 10) : null;
    let completedAt: string | undefined;
    if (values.completedDate) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const parsed = new Date(
        `${values.completedDate}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      );
      completedAt = Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
    }
    completeActivity(activity.id, {
      outcome: values.outcome,
      completionNotes: values.completionNotes || undefined,
      actualDurationMinutes: actualDuration,
      completedAt,
    });
    toast(activity.type === "Task" ? "Task completed" : "Activity completed", {
      description: `"${activity.title}" was marked as completed.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) form.reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Complete</DialogTitle>
          <DialogDescription>
            Record the outcome of this activity. It will be marked as completed and added to the related record
            timelines.
          </DialogDescription>
        </DialogHeader>
        {activity ? (
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4 py-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="font-medium text-sm">{activity.title}</div>
                <div className="mt-1 text-muted-foreground text-xs">
                  Scheduled for {formatActivityDateTime(activity.scheduledAt)}
                </div>
              </div>
              <Controller
                control={form.control}
                name="outcome"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="complete-outcome">
                      Outcome <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="complete-outcome"
                      placeholder="e.g. Positive — agreed to next steps"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="completionNotes"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="complete-notes">Completion notes</FieldLabel>
                    <Textarea
                      {...field}
                      id="complete-notes"
                      placeholder="Optional notes about what was discussed or decided..."
                      className="min-h-[80px]"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="completedDate"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="complete-date">Completed date</FieldLabel>
                    <Input {...field} id="complete-date" type="date" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {activity.type === "Call" || activity.type === "Meeting" || activity.type === "Task" ? (
                <Controller
                  control={form.control}
                  name="actualDurationMinutes"
                  render={({ field, fieldState }) => (
                    <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="complete-duration">Actual duration (minutes)</FieldLabel>
                      <Input
                        {...field}
                        id="complete-duration"
                        type="number"
                        min="1"
                        step="1"
                        placeholder={
                          activity.durationMinutes != null ? `Planned: ${activity.durationMinutes}` : "e.g. 30"
                        }
                        className="tabular-nums"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ) : null}
            </FieldGroup>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Mark Complete</Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Cancel Activity Dialog                                                     */
/* -------------------------------------------------------------------------- */

const cancelSchema = z.object({
  reason: z.string().trim().max(500, { message: "Reason must be 500 characters or fewer." }),
});

type CancelValues = z.infer<typeof cancelSchema>;

interface CancelActivityDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelActivityDialog({ activity, open, onOpenChange }: CancelActivityDialogProps) {
  const cancelActivity = useActivityStore((s) => s.cancelActivity);

  const form = useForm<CancelValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { reason: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ reason: "" });
    }
  }, [open, form]);

  function onSubmit(values: CancelValues) {
    if (!activity) return;
    cancelActivity(activity.id, values.reason || undefined);
    toast("Activity canceled", { description: `"${activity.title}" was canceled.` });
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) form.reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Activity</DialogTitle>
          <DialogDescription>
            This activity will be marked as canceled. You can reschedule it later to return it to Scheduled.
          </DialogDescription>
        </DialogHeader>
        {activity ? (
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4 py-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="font-medium text-sm">{activity.title}</div>
                <div className="mt-1 text-muted-foreground text-xs">
                  Scheduled for {formatActivityDateTime(activity.scheduledAt)}
                </div>
              </div>
              <Controller
                control={form.control}
                name="reason"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="cancel-reason">Reason (optional)</FieldLabel>
                    <Textarea
                      {...field}
                      id="cancel-reason"
                      placeholder="e.g. Customer requested reschedule"
                      className="min-h-[80px]"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Keep Activity
                </Button>
              </DialogClose>
              <Button type="submit" variant="destructive">
                Cancel Activity
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Reschedule Activity Dialog                                                 */
/* -------------------------------------------------------------------------- */

const rescheduleSchema = z
  .object({
    date: z.string().min(1, { message: "A new date is required." }),
    time: z.string().min(1, { message: "A new time is required." }),
    reminderDate: z.string(),
    reminderTime: z.string(),
    reason: z.string().trim().max(500, { message: "Reason must be 500 characters or fewer." }),
  })
  .superRefine((values, ctx) => {
    const combined = new Date(`${values.date}T${values.time}:00`);
    if (Number.isNaN(combined.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["date"], message: "Enter a valid date and time." });
      return;
    }
    if (combined.getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        message: "The new schedule must be in the future.",
      });
    }
    if (Boolean(values.reminderDate) !== Boolean(values.reminderTime)) {
      const field = values.reminderDate ? "reminderTime" : "reminderDate";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: "Provide both a reminder date and time, or clear both.",
      });
    }
    if (values.reminderDate && values.reminderTime) {
      const reminder = new Date(`${values.reminderDate}T${values.reminderTime}:00`);
      if (Number.isNaN(reminder.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reminderDate"],
          message: "Enter a valid reminder date and time.",
        });
      }
    }
  });

type RescheduleValues = z.infer<typeof rescheduleSchema>;

interface RescheduleActivityDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function nextWeekSlot(): { date: string; time: string } {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function splitIsoDateTime(iso: string): { date: string; time: string } {
  const parsed = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  if (Number.isNaN(parsed.getTime())) {
    return nextWeekSlot();
  }
  return {
    date: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
    time: `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`,
  };
}

function buildRescheduleDefaults(activity: Activity | null): RescheduleValues {
  if (!activity) {
    return { ...nextWeekSlot(), reminderDate: "", reminderTime: "", reason: "" };
  }
  const scheduleSource = isTaskActivity(activity) ? getTaskDueAt(activity) : activity.scheduledAt;
  const { date, time } = splitIsoDateTime(scheduleSource);
  const reminder = activity.reminderAt ? splitIsoDateTime(activity.reminderAt) : null;
  return {
    date,
    time,
    reminderDate: reminder ? reminder.date : "",
    reminderTime: reminder ? reminder.time : "",
    reason: "",
  };
}

export function RescheduleActivityDialog({ activity, open, onOpenChange }: RescheduleActivityDialogProps) {
  const rescheduleActivity = useActivityStore((s) => s.rescheduleActivity);
  const isTask = Boolean(activity && isTaskActivity(activity));

  const form = useForm<RescheduleValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: buildRescheduleDefaults(activity),
  });

  useEffect(() => {
    if (!open) return;
    form.reset(buildRescheduleDefaults(activity));
  }, [open, activity, form]);

  if (!activity) {
    return null;
  }

  function onSubmit(values: RescheduleValues) {
    if (!activity) return;
    const reminderAt =
      values.reminderDate && values.reminderTime
        ? new Date(`${values.reminderDate}T${values.reminderTime}:00`).toISOString()
        : null;
    rescheduleActivity(activity.id, new Date(`${values.date}T${values.time}:00`).toISOString(), reminderAt);
    toast(isTask ? "Task rescheduled" : "Activity rescheduled", {
      description: `"${activity.title}" was moved to ${values.date} at ${values.time}.${
        values.reason.trim() ? ` Reason: ${values.reason.trim()}` : ""
      }`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) form.reset(buildRescheduleDefaults(activity));
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isTask ? "Reschedule Task" : "Reschedule Activity"}</DialogTitle>
          <DialogDescription>
            {isTask
              ? "Pick a new future due date and time. The task will return to To Do if it was canceled."
              : "Pick a new future date and time. The activity will return to Scheduled."}
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 py-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="font-medium text-sm">{activity.title}</div>
              <div className="mt-1 text-muted-foreground text-xs">
                Currently {isTask ? "due" : "scheduled"} for {formatActivityDateTime(getTaskDueAt(activity))}
                {activity.status === "Canceled" ? " · canceled" : ""}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reschedule-date">
                      New Date <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input {...field} id="reschedule-date" type="date" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="time"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reschedule-time">
                      New Time <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input {...field} id="reschedule-time" type="time" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            {isTask ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="reminderDate"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reschedule-reminder-date">Reminder Date</FieldLabel>
                        <Input {...field} id="reschedule-reminder-date" type="date" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="reminderTime"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reschedule-reminder-time">Reminder Time</FieldLabel>
                        <Input {...field} id="reschedule-reminder-time" type="time" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="reason"
                  render={({ field, fieldState }) => (
                    <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reschedule-reason">Reason (optional)</FieldLabel>
                      <Textarea
                        {...field}
                        id="reschedule-reason"
                        placeholder="e.g. Customer asked to move it to next week"
                        className="min-h-[60px]"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </>
            ) : null}
          </FieldGroup>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Reschedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Reopen Task Dialog                                                         */
/* -------------------------------------------------------------------------- */

const reopenSchema = z
  .object({
    date: z.string().min(1, { message: "A new due date is required." }),
    time: z.string().min(1, { message: "A new due time is required." }),
    reason: z.string().trim().max(500, { message: "Reason must be 500 characters or fewer." }),
  })
  .superRefine((values, ctx) => {
    const combined = new Date(`${values.date}T${values.time}:00`);
    if (Number.isNaN(combined.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["date"], message: "Enter a valid date and time." });
    }
  });

type ReopenValues = z.infer<typeof reopenSchema>;

interface ReopenTaskDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReopenTaskDialog({ activity, open, onOpenChange }: ReopenTaskDialogProps) {
  const reopenActivity = useActivityStore((s) => s.reopenActivity);

  const form = useForm<ReopenValues>({
    resolver: zodResolver(reopenSchema),
    defaultValues: { date: "", time: "10:00", reason: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ date: "", time: "10:00", reason: "" });
    }
  }, [open, form]);

  function onSubmit(values: ReopenValues) {
    if (!activity) return;
    const dueAt = new Date(`${values.date}T${values.time}:00`).toISOString();
    const reopened = reopenActivity(activity.id, { dueAt });
    if (!reopened) {
      toast("Task cannot be reopened", {
        description: `"${activity.title}" is not in a status that can be reopened.`,
      });
      onOpenChange(false);
      return;
    }
    toast("Task reopened", {
      description: `"${activity.title}" was moved back to To Do with a due date of ${values.date}.${
        values.reason.trim() ? ` Reason: ${values.reason.trim()}` : ""
      }`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) form.reset({ date: "", time: "10:00", reason: "" });
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reopen Task</DialogTitle>
          <DialogDescription>
            This task will move back to To Do. Its completion record is kept, but the completed timestamp is cleared
            until it is completed again.
          </DialogDescription>
        </DialogHeader>
        {activity ? (
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4 py-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="font-medium text-sm">{activity.title}</div>
                <div className="mt-1 text-muted-foreground text-xs">
                  Completed on {activity.completedAt ? formatActivityDateTime(activity.completedAt) : "an unknown date"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field, fieldState }) => (
                    <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reopen-date">
                        New Due Date <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input {...field} id="reopen-date" type="date" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="time"
                  render={({ field, fieldState }) => (
                    <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reopen-time">
                        New Due Time <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input {...field} id="reopen-time" type="time" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              <Controller
                control={form.control}
                name="reason"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reopen-reason">Reason (optional)</FieldLabel>
                    <Textarea
                      {...field}
                      id="reopen-reason"
                      placeholder="e.g. Follow-up was left incomplete"
                      className="min-h-[60px]"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Reopen Task</Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
