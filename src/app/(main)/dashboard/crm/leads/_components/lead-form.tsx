"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { CustomFieldFormControl, emptyValueForType } from "@/components/crm/table-engine/custom-field-form-controls";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { validateFieldValue } from "@/lib/crm-table-engine/format";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";

import { useCrmConfigStore, useLeadEntityLabels } from "./leads-config/use-crm-config-store";
import { sourceOptions, statusOptions } from "./leads-data/data";
import { customFieldValueSchema, type Lead, type LeadSource, type LeadStatus } from "./leads-data/schema";
import { useLeadStore } from "./leads-data/use-lead-store";

const leadFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  source: z.enum(sourceOptions as unknown as [string, ...string[]]),
  status: z.enum(statusOptions as unknown as [string, ...string[]]),
  score: z.number().int().min(0).max(100),
  ownerId: z.string().optional(),
  nextActivity: z.string().optional(),
  custom: z.record(z.string(), customFieldValueSchema),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

function generateId(): string {
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toFormValues(lead: Lead, formFields: TableField[]): LeadFormValues {
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "",
    jobTitle: lead.jobTitle ?? "",
    company: lead.company ?? "",
    source: lead.source,
    status: lead.status,
    score: lead.score,
    ownerId: lead.ownerId ?? "",
    nextActivity: lead.nextActivity ?? "",
    custom: existingCustomValuesFor(lead, formFields),
  };
}

function defaultCustomValuesFor(formFields: TableField[]): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of formFields) {
    values[field.systemName] = emptyValueForType(field.type, field.defaultValue);
  }
  return values;
}

function existingCustomValuesFor(lead: Lead | undefined, formFields: TableField[]): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of formFields) {
    const current = lead?.customFields?.[field.systemName];
    values[field.systemName] = current === undefined ? null : current;
  }
  return values;
}

function fromFormValues(
  values: LeadFormValues,
  customValues: Record<string, CustomFieldValue>,
  formFields: TableField[],
  existingLead?: Lead,
): Lead {
  const now = new Date().toISOString().slice(0, 10);
  const customFields: Record<string, CustomFieldValue> = { ...(existingLead?.customFields ?? {}) };
  for (const field of formFields) {
    customFields[field.systemName] = customValues[field.systemName] ?? null;
  }
  return {
    id: existingLead?.id ?? generateId(),
    name: values.name,
    email: values.email,
    phone: values.phone || undefined,
    jobTitle: values.jobTitle || undefined,
    company: values.company || undefined,
    source: values.source as LeadSource,
    status: values.status as LeadStatus,
    score: values.score,
    ownerId: values.ownerId || null,
    lastActivity: existingLead?.lastActivity ?? now,
    nextActivity: values.nextActivity || null,
    createdAt: existingLead?.createdAt ?? now,
    updatedAt: now,
    tags: existingLead?.tags,
    location: existingLead?.location,
    timezone: existingLead?.timezone,
    preferredContact: existingLead?.preferredContact,
    companyWebsite: existingLead?.companyWebsite,
    companyIndustry: existingLead?.companyIndustry,
    companySize: existingLead?.companySize,
    activityTimeline: existingLead?.activityTimeline,
    tasks: existingLead?.tasks,
    notes: existingLead?.notes,
    archivedAt: existingLead?.archivedAt,
    archivedBy: existingLead?.archivedBy,
    customFields,
  };
}

interface LeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

export function LeadForm({ open, onOpenChange, lead }: LeadFormProps) {
  const isEditing = Boolean(lead);
  const labels = useLeadEntityLabels();
  const singularLabel = labels.singularLabel;
  const addLead = useLeadStore((s) => s.addLead);
  const updateLead = useLeadStore((s) => s.updateLead);
  const allCustomFields = useCrmConfigStore((s) => s.customFields);
  const [dirty, setDirty] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const formFields = useMemo(
    () =>
      allCustomFields
        .filter((f) => f.entityType === "lead" && !f.archivedAt && f.visibleInForm)
        .sort((a, b) => a.position - b.position),
    [allCustomFields],
  );

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      ...(lead
        ? toFormValues(lead, [])
        : {
            name: "",
            email: "",
            phone: "",
            jobTitle: "",
            company: "",
            source: "Website",
            status: "New",
            score: 50,
            ownerId: "",
            nextActivity: "",
          }),
      custom: {},
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        ...(lead
          ? toFormValues(lead, formFields)
          : {
              name: "",
              email: "",
              phone: "",
              jobTitle: "",
              company: "",
              source: "Website",
              status: "New",
              score: 50,
              ownerId: "",
              nextActivity: "",
            }),
        custom: isEditing ? existingCustomValuesFor(lead, formFields) : defaultCustomValuesFor(formFields),
      });
      const customValues = existingCustomValuesFor(lead, formFields);
      if (!isEditing) {
        Object.assign(customValues, defaultCustomValuesFor(formFields));
      }
      for (const [systemName, value] of Object.entries(customValues)) {
        form.setValue(`custom.${systemName}`, value, { shouldDirty: false });
      }
      setDirty(false);
    }
  }, [open, lead, form, formFields, isEditing]);

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

  function onSubmit(values: LeadFormValues) {
    let customInvalid = false;
    const customValues: Record<string, CustomFieldValue> = {};
    for (const field of formFields) {
      const submitted = values.custom[field.systemName];
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

    const leadData = fromFormValues(values, customValues, formFields, lead);
    if (isEditing && lead) {
      updateLead(lead.id, leadData);
      toast(`${singularLabel} updated`, { description: `${leadData.name} has been updated.` });
    } else {
      addLead(leadData);
      toast(`${singularLabel} created`, { description: `${leadData.name} has been added.` });
    }
    setDirty(false);
    onOpenChange(false);
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? `Edit ${singularLabel}` : `Add ${singularLabel}`}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? `Update the ${singularLabel.toLowerCase()} details below.`
              : `Fill in the details to add a new ${singularLabel.toLowerCase()}.`}
          </SheetDescription>
        </SheetHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4">
            <FieldGroup className="gap-5 py-4">
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Contact</h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-name">Full Name *</FieldLabel>
                        <Input
                          {...field}
                          id="lead-name"
                          placeholder="e.g. Cameron Ruiz"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-email">Email *</FieldLabel>
                        <Input
                          {...field}
                          id="lead-email"
                          type="email"
                          placeholder="cameron@example.com"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-phone">Phone</FieldLabel>
                        <Input
                          {...field}
                          id="lead-phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          autoComplete="tel"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="jobTitle"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-job-title">Job Title</FieldLabel>
                        <Input
                          {...field}
                          id="lead-job-title"
                          placeholder="e.g. VP of Engineering"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Lead Details</h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="source"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Source *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {sourceOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Status *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {statusOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="score"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-score">Score (0–100) *</FieldLabel>
                        <Input
                          id="lead-score"
                          type="number"
                          min={0}
                          max={100}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                        <FieldLabel>Owner</FieldLabel>
                        <Select
                          value={field.value || "none"}
                          onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">Unassigned</SelectItem>
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
                  <Controller
                    control={form.control}
                    name="nextActivity"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-next-activity">Next Activity</FieldLabel>
                        <Input {...field} id="lead-next-activity" type="date" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Separator />

              {formFields.length > 0 ? (
                <div>
                  <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Additional Information
                  </h3>
                  <FieldGroup className="gap-4">
                    {formFields.map((field) => (
                      <Controller
                        key={field.id}
                        control={form.control}
                        name={`custom.${field.systemName}`}
                        render={({ field: controllerField, fieldState }) => {
                          const value = (controllerField.value ?? null) as CustomFieldValue;
                          return (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={`lead-custom-${field.systemName}`}>
                                {field.displayLabel}
                                {field.required ? " *" : ""}
                              </FieldLabel>
                              <CustomFieldFormControl
                                id={`lead-custom-${field.systemName}`}
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
              ) : null}

              {formFields.length > 0 ? <Separator /> : null}

              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Company</h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="company"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-company">Company Name</FieldLabel>
                        <Input
                          {...field}
                          id="lead-company"
                          placeholder="e.g. Asteron Bioworks"
                          aria-invalid={fieldState.invalid}
                        />
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
            <Button type="submit">{isEditing ? "Save Changes" : `Add ${singularLabel}`}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
