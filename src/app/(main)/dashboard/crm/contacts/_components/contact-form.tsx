"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { CustomFieldFormControl, emptyValueForType } from "@/components/crm/table-engine/custom-field-form-controls";
import { useEntityFormFields } from "@/components/crm/table-engine/use-crm-entity-table";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { validateFieldValue } from "@/lib/crm-table-engine/format";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";
import { customFieldValueSchema } from "@/lib/crm-table-engine/value-schema";

import type { Contact } from "./contacts-data/schema";
import {
  contactLifecycleStageSchema,
  contactPreferredContactSchema,
  contactSourceSchema,
} from "./contacts-data/schema";
import { useContactStore } from "./contacts-data/use-contact-store";

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required." })
    .max(120, { message: "Full name must be 120 characters or fewer." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  lifecycleStage: contactLifecycleStageSchema,
  ownerId: z.string().optional(),
  jobTitle: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  companyName: z.string().trim().max(100).optional(),
  companyIndustry: z.string().trim().max(80).optional(),
  companyWebsite: z.string().trim().optional(),
  companySize: z.string().trim().optional(),
  companyLocation: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  timezone: z.string().trim().optional(),
  preferredContact: contactPreferredContactSchema.optional(),
  source: contactSourceSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10),
  isPrimaryContact: z.boolean().optional(),
  nextActivity: z.string().optional(),
  initialNote: z.string().trim().max(2000).optional(),
  custom: z.record(z.string(), customFieldValueSchema),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const lifecycleStageOptions: readonly z.infer<typeof contactLifecycleStageSchema>[] = [
  "Subscriber",
  "Lead",
  "Marketing Qualified",
  "Sales Qualified",
  "Opportunity",
  "Customer",
  "Former Customer",
];

const preferredContactOptions: readonly { value: z.infer<typeof contactPreferredContactSchema>; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "in_person", label: "In Person" },
];

const sourceOptions: readonly z.infer<typeof contactSourceSchema>[] = [
  "Website",
  "Referral",
  "LinkedIn",
  "Event",
  "Partner",
  "Outbound",
  "Organic Search",
  "Paid Campaign",
];

const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"];

const timezoneOptions = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function generateId(): string {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function existingCustomValuesFor(
  contact: Contact | undefined,
  formFields: TableField[],
): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of formFields) {
    const current = contact?.customFields?.[field.systemName];
    values[field.systemName] = current === undefined ? null : current;
  }
  return values;
}

function defaultCustomValuesFor(formFields: TableField[]): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of formFields) {
    values[field.systemName] = emptyValueForType(field.type, field.defaultValue);
  }
  return values;
}

function toFormValues(contact: Contact, formFields: TableField[]): ContactFormValues {
  return {
    name: contact.name,
    email: contact.email,
    lifecycleStage: contact.lifecycleStage,
    ownerId: contact.ownerId ?? "",
    jobTitle: contact.jobTitle ?? "",
    phone: contact.phone ?? "",
    companyName: contact.companyName ?? "",
    companyIndustry: contact.companyIndustry ?? "",
    companyWebsite: contact.companyWebsite ?? "",
    companySize: contact.companySize ?? "",
    companyLocation: "",
    location: contact.location ?? "",
    timezone: contact.timezone ?? "",
    preferredContact: contact.preferredContact,
    source: contact.source,
    tags: contact.tags ? [...contact.tags] : [],
    isPrimaryContact: contact.isPrimaryContact ?? false,
    nextActivity: contact.nextActivity ?? "",
    initialNote: "",
    custom: existingCustomValuesFor(contact, formFields),
  };
}

function fromFormValues(
  values: ContactFormValues,
  customValues: Record<string, CustomFieldValue>,
  formFields: TableField[],
  existingContact?: Contact,
  authorName?: string,
): Contact {
  const now = new Date().toISOString().slice(0, 10);
  const notes =
    existingContact?.notes ??
    (values.initialNote
      ? [
          {
            id: `cn-${Date.now()}-1`,
            content: values.initialNote,
            author: authorName ?? "Current User",
            createdAt: `${new Date().toISOString().slice(0, 16)}:00.000Z`,
            pinned: false,
          },
        ]
      : []);

  return {
    id: existingContact?.id ?? generateId(),
    name: values.name,
    email: values.email.toLowerCase(),
    jobTitle: values.jobTitle || undefined,
    phone: values.phone || undefined,
    companyId: existingContact?.companyId ?? null,
    companyName: values.companyName || undefined,
    lifecycleStage: values.lifecycleStage,
    ownerId: values.ownerId || null,
    tags: values.tags && values.tags.length > 0 ? values.tags : existingContact?.tags,
    openDealCount: existingContact?.openDealCount ?? 0,
    openDealValue: existingContact?.openDealValue ?? 0,
    closedDealCount: existingContact?.closedDealCount,
    closedDealValue: existingContact?.closedDealValue,
    lastContacted: existingContact?.lastContacted ?? null,
    nextActivity: values.nextActivity || null,
    createdAt: existingContact?.createdAt ?? now,
    updatedAt: now,
    location: values.location || undefined,
    timezone: values.timezone || undefined,
    preferredContact: values.preferredContact,
    profileUrl: existingContact?.profileUrl,
    source: values.source,
    isPrimaryContact: values.isPrimaryContact,
    companyWebsite: values.companyWebsite || undefined,
    companyIndustry: values.companyIndustry || undefined,
    companySize: values.companySize || undefined,
    activityTimeline: existingContact?.activityTimeline,
    tasks: existingContact?.tasks,
    notes,
    relatedDeals: existingContact?.relatedDeals,
    customFields: (() => {
      const merged: Record<string, CustomFieldValue> = { ...(existingContact?.customFields ?? {}) };
      for (const field of formFields) {
        merged[field.systemName] = customValues[field.systemName] ?? null;
      }
      return merged;
    })(),
  };
}

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact;
}

export function ContactForm({ open, onOpenChange, contact }: ContactFormProps) {
  const isEditing = Boolean(contact);
  const addContact = useContactStore((s) => s.addContact);
  const updateContact = useContactStore((s) => s.updateContact);
  const allContacts = useContactStore((s) => s.contacts);
  const [dirty, setDirty] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const formFields = useEntityFormFields("contact");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact
      ? toFormValues(contact, formFields)
      : {
          name: "",
          email: "",
          lifecycleStage: "Lead",
          ownerId: "",
          jobTitle: "",
          phone: "",
          companyName: "",
          companyIndustry: "",
          companyWebsite: "",
          companySize: "",
          companyLocation: "",
          location: "",
          timezone: "",
          tags: [],
          isPrimaryContact: false,
          nextActivity: "",
          initialNote: "",
          custom: {},
        },
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (open) {
      form.reset(
        contact
          ? toFormValues(contact, formFields)
          : {
              name: "",
              email: "",
              lifecycleStage: "Lead",
              ownerId: "",
              jobTitle: "",
              phone: "",
              companyName: "",
              companyIndustry: "",
              companyWebsite: "",
              companySize: "",
              companyLocation: "",
              location: "",
              timezone: "",
              tags: [],
              isPrimaryContact: false,
              nextActivity: "",
              initialNote: "",
              custom: defaultCustomValuesFor(formFields),
            },
      );
      setDirty(false);
      setNewTag("");
    }
  }, [open, contact, form, formFields]);

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

  function handleAddTag() {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const currentTags = form.getValues("tags") ?? [];
    const duplicate = currentTags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) {
      form.setError("tags", { message: `Tag "${trimmed}" already exists.` });
      return;
    }
    if (currentTags.length >= 10) {
      form.setError("tags", { message: "Maximum 10 tags allowed." });
      return;
    }
    form.setValue("tags", [...currentTags, trimmed], { shouldDirty: true });
    setNewTag("");
    form.clearErrors("tags");
  }

  function handleRemoveTag(index: number) {
    const currentTags = form.getValues("tags") ?? [];
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
    form.clearErrors("tags");
  }

  function onSubmit(values: ContactFormValues) {
    if (!isEditing) {
      const normalizedEmail = values.email.toLowerCase().trim();
      const duplicate = allContacts.some((c) => c.email.toLowerCase() === normalizedEmail);
      if (duplicate) {
        form.setError("email", {
          message: `A contact with the email "${normalizedEmail}" already exists.`,
        });
        form.setFocus("email");
        return;
      }
    }

    if (values.companyWebsite) {
      try {
        const url = values.companyWebsite.startsWith("http")
          ? values.companyWebsite
          : `https://${values.companyWebsite}`;
        new URL(url);
      } catch {
        form.setError("companyWebsite", { message: "Please enter a valid website URL." });
        form.setFocus("companyWebsite");
        return;
      }
    }

    const seen = new Set<string>();
    for (const tag of values.tags) {
      const lower = tag.toLowerCase();
      if (seen.has(lower)) {
        form.setError("tags", { message: `Duplicate tag "${tag}".` });
        return;
      }
      seen.add(lower);
    }

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

    const contactData = fromFormValues(values, customValues, formFields, contact);
    if (isEditing && contact) {
      updateContact(contact.id, contactData);
      toast("Contact updated", { description: `${contactData.name} has been updated.` });
    } else {
      addContact(contactData);
      toast("Contact added", {
        description: `${contactData.name} has been added to the current session.`,
      });
    }
    setDirty(false);
    onOpenChange(false);
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Contact" : "Add Contact"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the contact details below." : "Fill in the details to add a new contact."}
          </SheetDescription>
        </SheetHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4">
            <FieldGroup className="gap-5 py-4">
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Contact Information
                </h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-name">
                          Full Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-name"
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
                        <FieldLabel htmlFor="contact-email">
                          Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-email"
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
                    name="lifecycleStage"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Lifecycle Stage <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select lifecycle stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {lifecycleStageOptions.map((s) => (
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
                </FieldGroup>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Job &amp; Contact Details
                </h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="jobTitle"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-job-title">Job Title</FieldLabel>
                        <Input
                          {...field}
                          id="contact-job-title"
                          placeholder="e.g. VP of Engineering"
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
                        <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
                        <Input
                          {...field}
                          id="contact-phone"
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
                    name="preferredContact"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Preferred Contact Method</FieldLabel>
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
                              {preferredContactOptions.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
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
                    name="location"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-location">Contact Location</FieldLabel>
                        <Input
                          {...field}
                          id="contact-location"
                          placeholder="e.g. New York, NY"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="timezone"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Timezone</FieldLabel>
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
                              {timezoneOptions.map((tz) => (
                                <SelectItem key={tz} value={tz}>
                                  {tz}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Company Information
                </h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="companyName"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-company-name">Company Name</FieldLabel>
                        <Input
                          {...field}
                          id="contact-company-name"
                          placeholder="e.g. Asteron Bioworks"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="companyIndustry"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-company-industry">Industry</FieldLabel>
                        <Input
                          {...field}
                          id="contact-company-industry"
                          placeholder="e.g. Biotechnology"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="companyWebsite"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-company-website">Website</FieldLabel>
                        <Input
                          {...field}
                          id="contact-company-website"
                          placeholder="e.g. https://asteron.com"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="companySize"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Company Size</FieldLabel>
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
                              {companySizeOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s} employees
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
                    name="companyLocation"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-company-location">Company Location</FieldLabel>
                        <Input
                          {...field}
                          id="contact-company-location"
                          placeholder="e.g. San Francisco, CA"
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
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Additional Details
                </h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="source"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Acquisition Source</FieldLabel>
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
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
                    name="nextActivity"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-next-activity">Next Activity Date</FieldLabel>
                        <Input {...field} id="contact-next-activity" type="date" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isPrimaryContact"
                    render={({ field }) => (
                      <Field className="flex flex-row items-center justify-between gap-4">
                        <FieldLabel className="cursor-pointer">Primary Contact</FieldLabel>
                        <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="tags"
                    render={({ fieldState }) => {
                      const tags = form.getValues("tags") ?? [];
                      return (
                        <div className="flex flex-col gap-1.5">
                          <FieldLabel>Tags</FieldLabel>
                          <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag, index) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs"
                              >
                                {tag}
                                <button
                                  type="button"
                                  className="ml-0.5 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleRemoveTag(index)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a tag"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                              Add
                            </Button>
                          </div>
                          {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
                        </div>
                      );
                    }}
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
                                <FieldLabel htmlFor={`contact-custom-${field.systemName}`}>
                                  {field.displayLabel}
                                  {field.required ? " *" : ""}
                                </FieldLabel>
                                <CustomFieldFormControl
                                  id={`contact-custom-${field.systemName}`}
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

              {!isEditing ? (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Initial Note
                    </h3>
                    <Controller
                      control={form.control}
                      name="initialNote"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <Textarea
                            {...field}
                            id="contact-initial-note"
                            placeholder="Add an optional note about this contact..."
                            className="min-h-[80px]"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </>
              ) : null}
            </FieldGroup>
          </div>

          <SheetFooter className="border-t px-6 pt-4">
            <SheetClose asChild ref={closeRef}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {isEditing ? "Save Changes" : "Add Contact"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
