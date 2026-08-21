"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
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

import { sourceOptions, statusOptions } from "./leads-data/data";
import type { Lead, LeadSource, LeadStatus } from "./leads-data/schema";
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
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

function generateId(): string {
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toFormValues(lead: Lead): LeadFormValues {
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
  };
}

function fromFormValues(values: LeadFormValues, existingLead?: Lead): Lead {
  const now = new Date().toISOString().slice(0, 10);
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
  };
}

interface LeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

export function LeadForm({ open, onOpenChange, lead }: LeadFormProps) {
  const isEditing = Boolean(lead);
  const addLead = useLeadStore((s) => s.addLead);
  const updateLead = useLeadStore((s) => s.updateLead);
  const [dirty, setDirty] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: lead
      ? toFormValues(lead)
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
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        lead
          ? toFormValues(lead)
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
            },
      );
      setDirty(false);
    }
  }, [open, lead, form]);

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
    const leadData = fromFormValues(values, lead);
    if (isEditing && lead) {
      updateLead(lead.id, leadData);
      toast("Lead updated", { description: `${leadData.name} has been updated.` });
    } else {
      addLead(leadData);
      toast("Lead created", { description: `${leadData.name} has been added.` });
    }
    setDirty(false);
    onOpenChange(false);
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Lead" : "Add Lead"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the lead details below." : "Fill in the details to add a new lead."}
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
            <Button type="submit">{isEditing ? "Save Changes" : "Add Lead"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
