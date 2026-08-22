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
import { Textarea } from "@/components/ui/textarea";
import { validateFieldValue } from "@/lib/crm-table-engine/format";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";
import { customFieldValueSchema } from "@/lib/crm-table-engine/value-schema";

import { industryOptions, sizeOptions, typeOptions } from "./companies-data/data";
import type { Company, CompanyIndustry, CompanySize, CompanyType } from "./companies-data/schema";
import { useCompanyStore } from "./companies-data/use-company-store";

const companyFormSchema = z.object({
  name: z.string().min(1, { message: "Company name is required." }),
  industry: z.enum(industryOptions as unknown as [string, ...string[]]),
  type: z.enum(typeOptions as unknown as [string, ...string[]]),
  size: z.enum(sizeOptions as unknown as [string, ...string[]]),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  ownerId: z.string().optional(),
  description: z.string().optional(),
  custom: z.record(z.string(), customFieldValueSchema),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

function generateId(): string {
  return `company-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function existingCustomValuesFor(
  company: Company | undefined,
  formFields: TableField[],
): Record<string, CustomFieldValue> {
  const values: Record<string, CustomFieldValue> = {};
  for (const field of formFields) {
    const current = company?.customFields?.[field.systemName];
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

function toFormValues(company: Company, formFields: TableField[]): CompanyFormValues {
  return {
    name: company.name,
    industry: company.industry,
    type: company.type,
    size: company.size,
    location: company.location ?? "",
    phone: company.phone ?? "",
    website: company.website ?? "",
    ownerId: company.ownerId ?? "",
    description: company.description ?? "",
    custom: existingCustomValuesFor(company, formFields),
  };
}

function fromFormValues(
  values: CompanyFormValues,
  customValues: Record<string, CustomFieldValue>,
  formFields: TableField[],
  existingCompany?: Company,
): Company {
  const now = new Date().toISOString().slice(0, 10);
  return {
    id: existingCompany?.id ?? generateId(),
    name: values.name,
    domain: existingCompany?.domain ?? null,
    industry: values.industry as CompanyIndustry,
    type: values.type as CompanyType,
    size: values.size as CompanySize,
    location: values.location || null,
    ownerId: values.ownerId || null,
    website: values.website || null,
    primaryContactId: existingCompany?.primaryContactId,
    source: existingCompany?.source,
    openDealCount: existingCompany?.openDealCount ?? 0,
    openPipelineValue: existingCompany?.openPipelineValue ?? 0,
    wonRevenue: existingCompany?.wonRevenue ?? 0,
    lastActivity: existingCompany?.lastActivity ?? null,
    tags: existingCompany?.tags,
    description: values.description || undefined,
    phone: values.phone || null,
    address: existingCompany?.address,
    activityTimeline: existingCompany?.activityTimeline,
    tasks: existingCompany?.tasks,
    notes: existingCompany?.notes,
    deals: existingCompany?.deals,
    archivedAt: existingCompany?.archivedAt,
    archivedBy: existingCompany?.archivedBy,
    createdAt: existingCompany?.createdAt ?? now,
    updatedAt: now,
    customFields: (() => {
      const merged: Record<string, CustomFieldValue> = { ...(existingCompany?.customFields ?? {}) };
      for (const field of formFields) {
        merged[field.systemName] = customValues[field.systemName] ?? null;
      }
      return merged;
    })(),
  };
}

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company;
}

export function CompanyForm({ open, onOpenChange, company }: CompanyFormProps) {
  const isEditing = Boolean(company);
  const addCompany = useCompanyStore((s) => s.addCompany);
  const updateCompany = useCompanyStore((s) => s.updateCompany);
  const [dirty, setDirty] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const formFields = useEntityFormFields("company");

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: company
      ? toFormValues(company, formFields)
      : {
          name: "",
          industry: "Technology",
          type: "Prospect",
          size: "11-50",
          location: "",
          phone: "",
          website: "",
          ownerId: "",
          description: "",
          custom: {},
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        company
          ? toFormValues(company, formFields)
          : {
              name: "",
              industry: "Technology",
              type: "Prospect",
              size: "11-50",
              location: "",
              phone: "",
              website: "",
              ownerId: "",
              description: "",
              custom: defaultCustomValuesFor(formFields),
            },
      );
      setDirty(false);
    }
  }, [open, company, form, formFields]);

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

  function onSubmit(values: CompanyFormValues) {
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

    const companyData = fromFormValues(values, customValues, formFields, company);
    if (isEditing && company) {
      updateCompany(company.id, companyData);
      toast("Company updated", { description: `${companyData.name} has been updated.` });
    } else {
      addCompany(companyData);
      toast("Company created", { description: `${companyData.name} has been added.` });
    }
    setDirty(false);
    onOpenChange(false);
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Company" : "Add Company"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the company details below." : "Fill in the details to add a new company."}
          </SheetDescription>
        </SheetHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4">
            <FieldGroup className="gap-5 py-4">
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Profile</h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company-name">Company Name *</FieldLabel>
                        <Input
                          {...field}
                          id="company-name"
                          placeholder="e.g. Asteron Bioworks"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="industry"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Industry *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {industryOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                    name="type"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Type *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {typeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                    name="size"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Company Size *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {sizeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                  Contact Details
                </h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="location"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company-location">Location</FieldLabel>
                        <Input
                          {...field}
                          id="company-location"
                          placeholder="e.g. San Francisco, CA"
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
                        <FieldLabel htmlFor="company-phone">Phone</FieldLabel>
                        <Input
                          {...field}
                          id="company-phone"
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
                    name="website"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company-website">Website</FieldLabel>
                        <Input
                          {...field}
                          id="company-website"
                          type="url"
                          placeholder="https://example.com"
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
                              {salesOwners.map((owner) => (
                                <SelectItem key={owner.id} value={owner.id}>
                                  {owner.name}
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
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company-description">Description</FieldLabel>
                        <Textarea
                          {...field}
                          id="company-description"
                          rows={3}
                          placeholder="Short summary of the company…"
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
                                <FieldLabel htmlFor={`company-custom-${field.systemName}`}>
                                  {field.displayLabel}
                                  {field.required ? " *" : ""}
                                </FieldLabel>
                                <CustomFieldFormControl
                                  id={`company-custom-${field.systemName}`}
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
            </FieldGroup>
          </div>

          <SheetFooter className="border-t px-6 pt-4">
            <SheetClose asChild ref={closeRef}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit">{isEditing ? "Save Changes" : "Add Company"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
