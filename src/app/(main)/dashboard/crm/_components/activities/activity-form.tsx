"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  activityPriorityOptions,
  activityTypeOptions,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { currentSalesOwnerId, salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { useDealStore } from "@/app/(main)/dashboard/crm/deals/_components/deals-data/use-deal-store";
import { useLeadStore } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/use-lead-store";
import { CustomFieldFormControl, emptyValueForType } from "@/components/crm/table-engine/custom-field-form-controls";
import { useEntityFormFields } from "@/components/crm/table-engine/use-crm-entity-table";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { validateFieldValue } from "@/lib/crm-table-engine/format";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";
import { customFieldValueSchema } from "@/lib/crm-table-engine/value-schema";
import { cn } from "@/lib/utils";

import type { Activity, ActivityDirection, ActivityStatus, ActivityType } from "./activity-schema";
import { useActivityStore } from "./use-activity-store";

const callDirections = ["Inbound", "Outbound"] as const;
const emailDirections = ["Incoming", "Outgoing"] as const;

const activityFormSchema = z
  .object({
    type: z.enum(["Call", "Meeting", "Email", "Task", "Note"]),
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required." })
      .max(150, { message: "Title must be 150 characters or fewer." }),
    ownerId: z.string().min(1, { message: "Owner is required." }),
    scheduledDate: z.string(),
    scheduledTime: z.string(),
    reminderDate: z.string(),
    reminderTime: z.string(),
    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
    durationMinutes: z.string(),
    direction: z.string(),
    description: z.string().trim().max(2000, { message: "Description must be 2000 characters or fewer." }),
    leadId: z.string(),
    contactId: z.string(),
    companyId: z.string(),
    dealId: z.string(),
    relationships: z.boolean().optional(),
    custom: z.record(z.string(), customFieldValueSchema),
  })
  .superRefine((values, ctx) => {
    const requiresSchedule = values.type !== "Note";
    if (requiresSchedule && !values.scheduledDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledDate"], message: "Scheduled date is required." });
    }
    if (requiresSchedule && !values.scheduledTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledTime"], message: "Scheduled time is required." });
    }
    if (values.scheduledDate && values.scheduledTime) {
      const combined = new Date(`${values.scheduledDate}T${values.scheduledTime}:00`);
      if (Number.isNaN(combined.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledDate"], message: "Enter a valid date and time." });
      }
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
    if (!values.leadId && !values.contactId && !values.companyId && !values.dealId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["relationships"],
        message: "Link the activity to at least one Lead, Contact, Company, or Deal.",
      });
    }
    if (values.durationMinutes) {
      const duration = Number(values.durationMinutes);
      if (!Number.isFinite(duration) || !Number.isInteger(duration) || duration <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["durationMinutes"],
          message: "Duration must be a positive whole number of minutes.",
        });
      }
    }
    if (values.direction && values.type !== "Call" && values.type !== "Email") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["direction"],
        message: "Only Call and Email activities support a direction.",
      });
    }
    if (
      values.direction &&
      values.type === "Call" &&
      !(callDirections as readonly string[]).includes(values.direction)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["direction"],
        message: "Call activities support Inbound or Outbound direction.",
      });
    }
    if (
      values.direction &&
      values.type === "Email" &&
      !(emailDirections as readonly string[]).includes(values.direction)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["direction"],
        message: "Email activities support Incoming or Outgoing direction.",
      });
    }
    if (values.leadId && !useLeadStore.getState().getLeadById(values.leadId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["leadId"], message: "This lead no longer exists." });
    }
    if (values.contactId && !useContactStore.getState().getContactById(values.contactId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contactId"], message: "This contact no longer exists." });
    }
    if (values.companyId && !useCompanyStore.getState().getCompanyById(values.companyId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["companyId"], message: "This company no longer exists." });
    }
    if (values.dealId && !useDealStore.getState().getDealById(values.dealId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dealId"], message: "This deal no longer exists." });
    }
  });

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface PreselectedRecord {
  leadId?: string;
  contactId?: string;
  companyId?: string;
  dealId?: string;
}

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: Activity;
  defaultRelated?: PreselectedRecord;
  defaultType?: ActivityType;
  lockType?: boolean;
}

function generateActivityId(): string {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function combineDateTime(date: string, time: string): string {
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

function splitDateTime(iso: string): { date: string; time: string } {
  const parsed = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
    time: `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`,
  };
}

function emptyValues(defaults?: { type?: ActivityType; related?: PreselectedRecord }): ActivityFormValues {
  return {
    type: defaults?.type ?? "Call",
    title: "",
    ownerId: currentSalesOwnerId,
    scheduledDate: "",
    scheduledTime: "",
    reminderDate: "",
    reminderTime: "",
    priority: "Medium",
    durationMinutes: "",
    direction: "",
    description: "",
    leadId: defaults?.related?.leadId ?? "",
    contactId: defaults?.related?.contactId ?? "",
    companyId: defaults?.related?.companyId ?? "",
    dealId: defaults?.related?.dealId ?? "",
    custom: {},
  };
}

function toFormValues(activity: Activity, formFields: TableField[]): ActivityFormValues {
  const { date, time } = splitDateTime(activity.scheduledAt);
  const reminder = activity.reminderAt ? splitDateTime(activity.reminderAt) : null;
  return {
    type: activity.type,
    title: activity.title,
    ownerId: activity.ownerId ?? "",
    scheduledDate: date,
    scheduledTime: time,
    reminderDate: reminder ? reminder.date : "",
    reminderTime: reminder ? reminder.time : "",
    priority: activity.priority,
    durationMinutes: activity.durationMinutes != null ? String(activity.durationMinutes) : "",
    direction: activity.direction ?? "",
    description: activity.description ?? "",
    leadId: activity.leadId ?? "",
    contactId: activity.contactId ?? "",
    companyId: activity.companyId ?? "",
    dealId: activity.dealId ?? "",
    custom: existingCustomValuesFor(activity, formFields),
  };
}

function resolveDirection(values: ActivityFormValues): ActivityDirection | null {
  if (values.type === "Call" && (callDirections as readonly string[]).includes(values.direction)) {
    return values.direction as "Inbound" | "Outbound";
  }
  if (values.type === "Email" && (emailDirections as readonly string[]).includes(values.direction)) {
    return values.direction as "Incoming" | "Outgoing";
  }
  return null;
}

function existingCustomValuesFor(
  activity: Activity | undefined,
  fields: TableField[],
): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of fields) {
    const current = activity?.customFields?.[field.systemName];
    values[field.systemName] = current === undefined ? null : current;
  }
  return values;
}

function defaultCustomValuesFor(fields: TableField[]): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of fields) {
    values[field.systemName] = emptyValueForType(field.type, field.defaultValue);
  }
  return values;
}

function buildActivityFromForm(values: ActivityFormValues, formFields: TableField[], existing?: Activity): Activity {
  const now = new Date().toISOString();
  const hasSchedule = Boolean(values.scheduledDate && values.scheduledTime);
  const scheduledAt = hasSchedule ? combineDateTime(values.scheduledDate, values.scheduledTime) : now;
  const isInstantNote = values.type === "Note" && !hasSchedule;
  const duration = values.durationMinutes ? Number.parseInt(values.durationMinutes, 10) : null;
  const direction = resolveDirection(values);
  const reminderAt =
    values.reminderDate && values.reminderTime ? combineDateTime(values.reminderDate, values.reminderTime) : null;
  let initialStatus: ActivityStatus = "Scheduled";
  if (isInstantNote) {
    initialStatus = "Completed";
  } else if (values.type === "Task") {
    initialStatus = "To Do";
  }

  return {
    id: existing?.id ?? generateActivityId(),
    type: values.type,
    title: values.title,
    description: values.description || undefined,
    status: existing?.status ?? initialStatus,
    priority: values.priority,
    ownerId: values.ownerId,
    createdBy: existing?.createdBy ?? currentSalesOwnerId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    scheduledAt,
    dueAt: values.type === "Task" ? scheduledAt : (existing?.dueAt ?? null),
    reminderAt,
    completedAt: existing?.completedAt ?? (isInstantNote ? now : null),
    durationMinutes: duration,
    outcome: existing?.outcome ?? null,
    completionNotes: existing?.completionNotes,
    cancelReason: existing?.cancelReason,
    direction,
    leadId: values.leadId || null,
    contactId: values.contactId || null,
    companyId: values.companyId || null,
    dealId: values.dealId || null,
    customFields: (() => {
      const merged: Record<string, CustomFieldValue> = { ...(existing?.customFields ?? {}) };
      for (const field of formFields) {
        merged[field.systemName] = values.custom?.[field.systemName] ?? null;
      }
      return merged;
    })(),
  };
}

export function ActivityForm({
  open,
  onOpenChange,
  activity,
  defaultRelated,
  defaultType,
  lockType,
}: ActivityFormProps) {
  const isEditing = Boolean(activity);
  const createActivity = useActivityStore((s) => s.createActivity);
  const updateActivity = useActivityStore((s) => s.updateActivity);
  const [dirty, setDirty] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [leadSearchOpen, setLeadSearchOpen] = useState(false);
  const [contactSearchOpen, setContactSearchOpen] = useState(false);
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [dealSearchOpen, setDealSearchOpen] = useState(false);

  const isTaskEntity = lockType === true || defaultType === "Task";
  const formEntityType: "task" | "activity" = isTaskEntity ? "task" : "activity";
  const formFields = useEntityFormFields(formEntityType);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: activity
      ? toFormValues(activity, formFields)
      : emptyValues({ type: defaultType, related: defaultRelated }),
  });

  const watchedType = form.watch("type");
  const watchedLeadId = form.watch("leadId");
  const watchedContactId = form.watch("contactId");
  const watchedCompanyId = form.watch("companyId");
  const watchedDealId = form.watch("dealId");

  const allLeads = useLeadStore((s) => s.leads);
  const allContacts = useContactStore((s) => s.contacts);
  const allDeals = useDealStore((s) => s.deals);
  const allCompanies = useCompanyStore((s) => s.companies);

  const activeLeads = useMemo(() => allLeads.filter((l) => !l.archivedAt), [allLeads]);
  const activeContacts = useMemo(() => allContacts.filter((c) => !c.archivedAt), [allContacts]);
  const activeDeals = useMemo(() => allDeals.filter((d) => !d.archivedAt), [allDeals]);

  const selectedLead = allLeads.find((l) => l.id === watchedLeadId);
  const selectedContact = allContacts.find((c) => c.id === watchedContactId);
  const selectedCompany = allCompanies.find((c) => c.id === watchedCompanyId);
  const selectedDeal = allDeals.find((d) => d.id === watchedDealId);

  const requiresSchedule = watchedType !== "Note";
  const supportsDirection = watchedType === "Call" || watchedType === "Email";
  const directionOptions = watchedType === "Call" ? callDirections : emailDirections;
  const showsDuration = watchedType === "Call" || watchedType === "Meeting" || watchedType === "Task";
  const isTaskForm = lockType === true || (!isEditing && defaultType === "Task") || watchedType === "Task";
  const scheduleLabel = isTaskForm ? "Due" : "Scheduled";

  const defaultLeadId = defaultRelated?.leadId;
  const defaultContactId = defaultRelated?.contactId;
  const defaultCompanyId = defaultRelated?.companyId;
  const defaultDealId = defaultRelated?.dealId;

  useEffect(() => {
    if (open) {
      const base = activity
        ? toFormValues(activity, formFields)
        : emptyValues({
            type: defaultType,
            related: {
              leadId: defaultLeadId,
              contactId: defaultContactId,
              companyId: defaultCompanyId,
              dealId: defaultDealId,
            },
          });
      base.custom = activity ? existingCustomValuesFor(activity, formFields) : defaultCustomValuesFor(formFields);
      form.reset(base);
      setDirty(false);
      setLeadSearchOpen(false);
      setContactSearchOpen(false);
      setCompanySearchOpen(false);
      setDealSearchOpen(false);
    }
  }, [open, activity, defaultType, defaultLeadId, defaultContactId, defaultCompanyId, defaultDealId, form, formFields]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && dirty) {
        if (!window.confirm("You have unsaved changes. Discard them?")) return;
      }
      onOpenChange(nextOpen);
    },
    [dirty, onOpenChange],
  );

  function handleTypeChange(nextType: ActivityType) {
    form.setValue("type", nextType, { shouldDirty: true });
    if (nextType !== "Call" && nextType !== "Email") {
      form.setValue("direction", "", { shouldDirty: true });
    }
    if (nextType === "Email" || nextType === "Note") {
      form.setValue("durationMinutes", "", { shouldDirty: true });
    }
  }

  function handleDealChange(dealId: string) {
    form.setValue("dealId", dealId, { shouldDirty: true });
    form.clearErrors("dealId");
    const deal = allDeals.find((d) => d.id === dealId);
    if (deal) {
      if (deal.companyId) {
        form.setValue("companyId", deal.companyId, { shouldDirty: true });
      }
      if (deal.primaryContactId) {
        form.setValue("contactId", deal.primaryContactId, { shouldDirty: true });
      }
    }
    setDealSearchOpen(false);
  }

  function handleContactChange(contactId: string) {
    form.setValue("contactId", contactId, { shouldDirty: true });
    form.clearErrors("contactId");
    const contact = allContacts.find((c) => c.id === contactId);
    if (contact?.companyId && !form.getValues("companyId")) {
      form.setValue("companyId", contact.companyId, { shouldDirty: true });
    }
    setContactSearchOpen(false);
  }

  function handleCompanyChange(companyId: string) {
    const currentContactId = form.getValues("contactId");
    if (currentContactId) {
      const contact = allContacts.find((c) => c.id === currentContactId);
      if (contact?.companyId && contact.companyId !== companyId) {
        if (window.confirm("The selected contact does not belong to the new company. Clear the contact?")) {
          form.setValue("contactId", "", { shouldDirty: true });
        }
      }
    }
    form.setValue("companyId", companyId, { shouldDirty: true });
    form.clearErrors("companyId");
    setCompanySearchOpen(false);
  }

  function onSubmit(values: ActivityFormValues) {
    let customInvalid = false;
    const customValues: Record<string, CustomFieldValue> = {};
    for (const field of formFields) {
      const submitted = values.custom?.[field.systemName];
      const normalized: CustomFieldValue = submitted === undefined ? null : submitted;
      customValues[field.systemName] = normalized;
      const error = validateFieldValue(field, normalized);
      if (error) {
        customInvalid = true;
        form.setError(`custom.${field.systemName}`, { message: error });
      } else {
        form.clearErrors(`custom.${field.systemName}`);
      }
    }
    if (customInvalid) return;

    const activityData = buildActivityFromForm(values, formFields, activity ?? undefined);
    if (isEditing && activity) {
      updateActivity(activity.id, activityData);
      toast(isTaskForm ? "Task updated" : "Activity updated", {
        description: `"${activityData.title}" has been updated.`,
      });
    } else {
      createActivity(activityData);
      let createdTitle = "Activity scheduled";
      if (isTaskForm) {
        createdTitle = activityData.status === "Completed" ? "Task logged" : "Task created";
      } else if (activityData.status === "Completed") {
        createdTitle = "Activity logged";
      }
      toast(createdTitle, {
        description: `"${activityData.title}" has been added to the current session.`,
      });
    }
    setDirty(false);
    onOpenChange(false);
  }

  let sheetTitle = isTaskForm ? "Add Task" : "Add Activity";
  let sheetDescription = isTaskForm
    ? "Create a task with an owner, due date, priority, and related CRM record."
    : "Log a call, meeting, email, task, or note against a CRM record.";
  if (isEditing) {
    sheetTitle = isTaskForm ? "Edit Task" : "Edit Activity";
    sheetDescription = isTaskForm ? "Update the task details below." : "Update the activity details below.";
  }
  const submitLabel = isTaskForm ? "Add Task" : "Add Activity";

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4">
            <FieldGroup className="gap-5 py-4">
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Activity Details
                </h3>
                <FieldGroup className="gap-4">
                  {lockType ? (
                    <Controller
                      control={form.control}
                      name="type"
                      render={() => <input type="hidden" value="Task" readOnly />}
                    />
                  ) : (
                    <Controller
                      control={form.control}
                      name="type"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            Type <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Select value={field.value} onValueChange={(v) => handleTypeChange(v as ActivityType)}>
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {activityTypeOptions.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  )}

                  <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="activity-title">
                          Title <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="activity-title"
                          placeholder="e.g. Follow-up call on proposal"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="ownerId"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Owner <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {salesOwners.map((o) => (
                                <SelectItem key={o.id} value={o.id}>
                                  {o.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="scheduledDate"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="activity-scheduled-date">
                            {scheduleLabel} Date{" "}
                            {!requiresSchedule ? <span className="text-muted-foreground">(optional)</span> : null}
                            {requiresSchedule ? <span className="text-destructive">*</span> : null}
                          </FieldLabel>
                          <Input
                            {...field}
                            id="activity-scheduled-date"
                            type="date"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="scheduledTime"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="activity-scheduled-time">
                            {scheduleLabel} Time{" "}
                            {!requiresSchedule ? <span className="text-muted-foreground">(optional)</span> : null}
                            {requiresSchedule ? <span className="text-destructive">*</span> : null}
                          </FieldLabel>
                          <Input
                            {...field}
                            id="activity-scheduled-time"
                            type="time"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  {isTaskForm ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Controller
                        control={form.control}
                        name="reminderDate"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="activity-reminder-date">Reminder Date</FieldLabel>
                            <Input
                              {...field}
                              id="activity-reminder-date"
                              type="date"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="reminderTime"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="activity-reminder-time">Reminder Time</FieldLabel>
                            <Input
                              {...field}
                              id="activity-reminder-time"
                              type="time"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="priority"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel>Priority</FieldLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Select priority" />
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
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {showsDuration ? (
                      <Controller
                        control={form.control}
                        name="durationMinutes"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="activity-duration">Duration (minutes)</FieldLabel>
                            <Input
                              {...field}
                              id="activity-duration"
                              type="number"
                              min="1"
                              step="1"
                              placeholder="e.g. 30"
                              className="tabular-nums"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    ) : null}

                    {supportsDirection ? (
                      <Controller
                        control={form.control}
                        name="direction"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel>Direction</FieldLabel>
                            <Select
                              value={field.value || "none"}
                              onValueChange={(v) =>
                                form.setValue("direction", v === "none" ? "" : v, { shouldDirty: true })
                              }
                            >
                              <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Select direction" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="none">Not specified</SelectItem>
                                  {directionOptions.map((d) => (
                                    <SelectItem key={d} value={d}>
                                      {d}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    ) : null}
                  </div>

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="activity-description">Description</FieldLabel>
                        <Textarea
                          {...field}
                          id="activity-description"
                          placeholder="Add context for this activity..."
                          className="min-h-[80px]"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              {formFields.length > 0 ? (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Custom Fields
                    </h3>
                    <FieldGroup className="gap-4">
                      {formFields.map((field) => (
                        <Controller
                          key={field.id}
                          control={form.control}
                          name={`custom.${field.systemName}` as const}
                          render={({ field: controllerField, fieldState }) => {
                            const value = (controllerField.value ?? null) as CustomFieldValue;
                            return (
                              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`activity-custom-${field.systemName}`}>
                                  {field.displayLabel}
                                  {field.required ? " *" : ""}
                                </FieldLabel>
                                <CustomFieldFormControl
                                  id={`activity-custom-${field.systemName}`}
                                  field={field}
                                  value={value}
                                  onChange={(next) => controllerField.onChange(next)}
                                />
                                {field.description && field.type !== "long_text" ? (
                                  <p className="text-muted-foreground text-xs">{field.description}</p>
                                ) : null}
                                {fieldState.invalid && fieldState.error ? (
                                  <FieldError errors={[fieldState.error]} />
                                ) : null}
                              </Field>
                            );
                          }}
                        />
                      ))}
                    </FieldGroup>
                  </div>
                </>
              ) : null}

              <Separator />

              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Related Records
                </h3>
                <p className="mb-3 text-muted-foreground text-xs">
                  Link the activity to at least one Lead, Contact, Company, or Deal. Archived records cannot receive new
                  activities.
                </p>
                {form.formState.errors.relationships ? (
                  <p className="mb-3 text-destructive text-xs">{form.formState.errors.relationships.message}</p>
                ) : null}
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="dealId"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Deal</FieldLabel>
                        <Popover open={dealSearchOpen} onOpenChange={setDealSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={dealSearchOpen}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {selectedDeal ? selectedDeal.name : "Select deal..."}
                              {field.value ? (
                                <XIcon
                                  className="ml-2 size-4 shrink-0 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setValue("dealId", "", { shouldDirty: true });
                                  }}
                                />
                              ) : null}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Search deals..." />
                              <CommandList>
                                <CommandEmpty>No deal found.</CommandEmpty>
                                <CommandGroup>
                                  {(activeDeals.some((d) => d.id === field.value) || !field.value
                                    ? activeDeals
                                    : [...activeDeals, ...(selectedDeal ? [selectedDeal] : [])]
                                  ).map((deal) => (
                                    <CommandItem
                                      key={deal.id}
                                      value={`${deal.name} ${deal.id}`}
                                      onSelect={() => handleDealChange(deal.id)}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 size-4",
                                          field.value === deal.id ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {deal.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="companyId"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Company</FieldLabel>
                        <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={companySearchOpen}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {selectedCompany ? selectedCompany.name : "Select company..."}
                              {field.value ? (
                                <XIcon
                                  className="ml-2 size-4 shrink-0 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setValue("companyId", "", { shouldDirty: true });
                                  }}
                                />
                              ) : null}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Search companies..." />
                              <CommandList>
                                <CommandEmpty>No company found.</CommandEmpty>
                                <CommandGroup>
                                  {allCompanies.map((company) => (
                                    <CommandItem
                                      key={company.id}
                                      value={`${company.name} ${company.id}`}
                                      onSelect={() => handleCompanyChange(company.id)}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 size-4",
                                          field.value === company.id ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {company.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="contactId"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Contact</FieldLabel>
                        <Popover open={contactSearchOpen} onOpenChange={setContactSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={contactSearchOpen}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {selectedContact
                                ? `${selectedContact.name}${selectedContact.archivedAt ? " (Archived)" : ""}`
                                : "Select contact..."}
                              {field.value ? (
                                <XIcon
                                  className="ml-2 size-4 shrink-0 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setValue("contactId", "", { shouldDirty: true });
                                  }}
                                />
                              ) : null}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Search contacts..." />
                              <CommandList>
                                <CommandEmpty>No contact found.</CommandEmpty>
                                <CommandGroup>
                                  {(activeContacts.some((c) => c.id === field.value) || !field.value
                                    ? activeContacts
                                    : [...activeContacts, ...(selectedContact ? [selectedContact] : [])]
                                  ).map((contact) => (
                                    <CommandItem
                                      key={contact.id}
                                      value={`${contact.name} ${contact.email}`}
                                      onSelect={() => handleContactChange(contact.id)}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 size-4",
                                          field.value === contact.id ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {contact.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="leadId"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Lead</FieldLabel>
                        <Popover open={leadSearchOpen} onOpenChange={setLeadSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={leadSearchOpen}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {selectedLead
                                ? `${selectedLead.name}${selectedLead.archivedAt ? " (Archived)" : ""}`
                                : "Select lead..."}
                              {field.value ? (
                                <XIcon
                                  className="ml-2 size-4 shrink-0 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setValue("leadId", "", { shouldDirty: true });
                                  }}
                                />
                              ) : null}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Search leads..." />
                              <CommandList>
                                <CommandEmpty>No lead found.</CommandEmpty>
                                <CommandGroup>
                                  {(activeLeads.some((l) => l.id === field.value) || !field.value
                                    ? activeLeads
                                    : [...activeLeads, ...(selectedLead ? [selectedLead] : [])]
                                  ).map((lead) => (
                                    <CommandItem
                                      key={lead.id}
                                      value={`${lead.name} ${lead.company ?? ""}`}
                                      onSelect={() => {
                                        form.setValue("leadId", lead.id, { shouldDirty: true });
                                        form.clearErrors("leadId");
                                        setLeadSearchOpen(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 size-4",
                                          field.value === lead.id ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {lead.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            </FieldGroup>
          </div>

          <SheetFooter className="border-t px-6 pt-4">
            <SheetClose asChild ref={closeRef}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {isEditing ? "Save Changes" : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
