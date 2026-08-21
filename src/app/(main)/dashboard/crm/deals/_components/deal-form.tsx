"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { currentSalesOwnerId, salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
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
import { cn, formatCurrency } from "@/lib/utils";

import type { Deal, DealHealth, DealPriority, DealProduct, DealSource, DealStage } from "./deals-data/schema";
import { useDealStore } from "./deals-data/use-deal-store";

const openStages: readonly DealStage[] = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"];

const allStages: readonly DealStage[] = [
  "Discovery",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const healthOptions: readonly DealHealth[] = ["Healthy", "Attention", "At Risk"];

const priorityOptions: readonly DealPriority[] = ["Low", "Medium", "High"];

const sourceOptions: readonly DealSource[] = [
  "Inbound",
  "Outbound",
  "Referral",
  "Partner",
  "Event",
  "Website",
  "Cold Call",
];

const stageProbabilityDefaults: Record<DealStage, number> = {
  Discovery: 15,
  Qualified: 35,
  "Proposal Sent": 60,
  Negotiation: 80,
  "Closed Won": 100,
  "Closed Lost": 0,
};

const dealFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Deal name is required." })
    .max(120, { message: "Deal name must be 120 characters or fewer." }),
  companyId: z.string().min(1, { message: "Company is required." }),
  primaryContactId: z.string().optional(),
  stage: z.enum(["Discovery", "Qualified", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"]),
  value: z
    .number({ message: "Value must be a valid number." })
    .finite({ message: "Value must be a valid number." })
    .positive({ message: "Value must be greater than zero." })
    .max(100_000_000, { message: "Value must be 100,000,000 or fewer." }),
  currency: z.string(),
  probability: z
    .number({ message: "Probability must be a valid number." })
    .int({ message: "Probability must be a whole number." })
    .min(0, { message: "Probability must be at least 0." })
    .max(100, { message: "Probability must be at most 100." }),
  expectedCloseDate: z.string().min(1, { message: "Expected close date is required." }),
  health: z.enum(["Healthy", "Attention", "At Risk"]),
  priority: z.enum(["Low", "Medium", "High"]),
  source: z.enum(["Inbound", "Outbound", "Referral", "Partner", "Event", "Website", "Cold Call"]),
  ownerId: z.string().optional(),
  tags: z.array(z.string().trim().min(1).max(30).max(30)).max(10),
  nextActivityDate: z.string().optional(),
  description: z.string().trim().max(2000).optional(),
  initialNote: z.string().trim().max(2000).optional(),
  products: z.array(
    z.object({
      name: z.string().trim().min(1, { message: "Product name is required." }),
      quantity: z
        .number({ message: "Quantity must be a valid number." })
        .int({ message: "Quantity must be a whole number." })
        .min(1, { message: "Quantity must be at least 1." }),
      unitPrice: z
        .number({ message: "Unit price must be a valid number." })
        .min(0, { message: "Unit price must be non-negative." }),
    }),
  ),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

function generateDealId(): string {
  return `dl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toFormValues(deal: Deal): DealFormValues {
  return {
    name: deal.name,
    companyId: deal.companyId,
    primaryContactId: deal.primaryContactId ?? "",
    stage: deal.stage,
    value: deal.value,
    currency: deal.currency ?? "USD",
    probability: deal.probability,
    expectedCloseDate: deal.expectedCloseDate ?? "",
    health: deal.health,
    priority: deal.priority === "Critical" ? "High" : deal.priority,
    source: deal.source,
    ownerId: deal.ownerId ?? "",
    tags: deal.tags ? [...deal.tags] : [],
    nextActivityDate: deal.nextActivityDate ?? "",
    description: "",
    initialNote: "",
    products: deal.products.map((p) => ({ name: p.name, quantity: p.quantity, unitPrice: p.unitPrice })),
  };
}

function buildDealFromForm(values: DealFormValues, existingDeal?: Deal): Deal {
  const now = new Date().toISOString().slice(0, 10);
  const notes =
    existingDeal?.notes ??
    (values.initialNote
      ? [
          {
            id: `dn-${Date.now()}-1`,
            content: values.initialNote,
            authorId: currentSalesOwnerId,
            pinned: false,
            createdAt: new Date().toISOString(),
          },
        ]
      : []);

  const products: DealProduct[] = values.products.map((p) => ({
    name: p.name,
    quantity: p.quantity,
    unitPrice: p.unitPrice,
  }));

  return {
    id: existingDeal?.id ?? generateDealId(),
    name: values.name,
    companyId: values.companyId,
    primaryContactId: values.primaryContactId || null,
    stage: values.stage,
    value: values.value,
    currency: values.currency,
    probability: values.probability,
    health: values.health,
    priority: values.priority,
    ownerId: values.ownerId || currentSalesOwnerId,
    source: values.source,
    expectedCloseDate: values.expectedCloseDate,
    actualCloseDate: existingDeal?.actualCloseDate ?? null,
    lastActivityDate: existingDeal?.lastActivityDate ?? null,
    nextActivityDate: values.nextActivityDate || null,
    lostReason: existingDeal?.lostReason ?? null,
    createdAt: existingDeal?.createdAt ?? now,
    updatedAt: now,
    activities: existingDeal?.activities ?? [],
    tasks: existingDeal?.tasks ?? [],
    notes,
    products,
    tags: values.tags.length > 0 ? values.tags : existingDeal?.tags,
    proposalSummary: existingDeal?.proposalSummary ?? null,
  };
}

interface DealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal;
}

export function DealForm({ open, onOpenChange, deal }: DealFormProps) {
  const isEditing = Boolean(deal);
  const isClosedStage = deal?.stage === "Closed Won" || deal?.stage === "Closed Lost";
  const addDeal = useDealStore((s) => s.addDeal);
  const updateDeal = useDealStore((s) => s.updateDeal);
  const [dirty, setDirty] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [contactSearchOpen, setContactSearchOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: deal
      ? toFormValues(deal)
      : {
          name: "",
          companyId: "",
          primaryContactId: "",
          stage: "Discovery",
          value: 0,
          currency: "USD",
          probability: 15,
          expectedCloseDate: "",
          health: "Healthy",
          priority: "Medium",
          source: "Inbound",
          ownerId: "",
          tags: [],
          nextActivityDate: "",
          description: "",
          initialNote: "",
          products: [],
        },
  });

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const watchedCompanyId = form.watch("companyId");
  const watchedStage = form.watch("stage");
  const watchedProducts = form.watch("products");

  const allCompanies = useCompanyStore((s) => s.companies);
  const selectedCompany = allCompanies.find((c) => c.id === watchedCompanyId);

  const allContacts = useContactStore((s) => s.contacts);

  const probabilityMax = isClosedStage ? (watchedStage === "Closed Won" ? 100 : 0) : 99;
  const probabilityHint = isClosedStage
    ? watchedStage === "Closed Won"
      ? "Closed Won deals are set to 100%."
      : "Closed Lost deals are set to 0%."
    : `Default for ${watchedStage}: ${stageProbabilityDefaults[watchedStage]}%.`;

  const companyContacts = watchedCompanyId
    ? allContacts.filter((c) => c.companyId === watchedCompanyId && !c.archivedAt)
    : [];

  useEffect(() => {
    if (open) {
      form.reset(
        deal
          ? toFormValues(deal)
          : {
              name: "",
              companyId: "",
              primaryContactId: "",
              stage: "Discovery",
              value: 0,
              currency: "USD",
              probability: 15,
              expectedCloseDate: "",
              health: "Healthy",
              priority: "Medium",
              source: "Inbound",
              ownerId: "",
              tags: [],
              nextActivityDate: "",
              description: "",
              initialNote: "",
              products: [],
            },
      );
      setDirty(false);
      setNewTag("");
      setCompanySearchOpen(false);
      setContactSearchOpen(false);
    }
  }, [open, deal, form]);

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

  const handleStageChange = useCallback(
    (newStage: DealStage) => {
      if (isClosedStage) return;
      const currentProb = form.getValues("probability");
      const defaultProb = stageProbabilityDefaults[newStage];
      if (currentProb === stageProbabilityDefaults[form.getValues("stage")]) {
        form.setValue("probability", defaultProb, { shouldDirty: true });
      }
      form.setValue("stage", newStage, { shouldDirty: true });
    },
    [form, isClosedStage],
  );

  function handleCompanyChange(companyId: string) {
    form.setValue("companyId", companyId, { shouldDirty: true });
    form.clearErrors("companyId");
    const currentContactId = form.getValues("primaryContactId");
    if (currentContactId) {
      const contact = allContacts.find((c) => c.id === currentContactId);
      if (contact && contact.companyId !== companyId) {
        if (window.confirm("The selected contact does not belong to the new company. Clear the contact?")) {
          form.setValue("primaryContactId", "", { shouldDirty: true });
        }
      }
    }
    setCompanySearchOpen(false);
  }

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

  function onSubmit(values: DealFormValues) {
    const dealData = buildDealFromForm(values, deal);
    if (isEditing && deal) {
      updateDeal(deal.id, dealData);
      toast("Deal updated", { description: `${dealData.name} has been updated.` });
    } else {
      addDeal(dealData);
      toast("Deal added", {
        description: `${dealData.name} has been added to the current session.`,
      });
    }
    setDirty(false);
    onOpenChange(false);
  }

  const productsTotal = watchedProducts.reduce((sum, p) => sum + (p.quantity || 0) * (p.unitPrice || 0), 0);

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Deal" : "Add Deal"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the deal details below." : "Fill in the details to add a new deal."}
          </SheetDescription>
        </SheetHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4">
            <FieldGroup className="gap-5 py-4">
              {/* Deal Details */}
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Deal Details</h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="deal-name">
                          Deal Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="deal-name"
                          placeholder="e.g. CRM Enterprise License"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Company */}
                  <Controller
                    control={form.control}
                    name="companyId"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Company <span className="text-destructive">*</span>
                        </FieldLabel>
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
                              aria-invalid={fieldState.invalid}
                            >
                              {selectedCompany ? selectedCompany.name : "Select company..."}
                              <XIcon
                                className="ml-2 size-4 shrink-0 opacity-50 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  form.setValue("companyId", "", { shouldDirty: true });
                                  form.setValue("primaryContactId", "", { shouldDirty: true });
                                }}
                              />
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

                  {/* Primary Contact */}
                  <Controller
                    control={form.control}
                    name="primaryContactId"
                    render={({ field, fieldState }) => {
                      const selectedContact = allContacts.find((c) => c.id === field.value);
                      const hasArchivedContact =
                        field.value && allContacts.find((c) => c.id === field.value)?.archivedAt;
                      return (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel>Primary Contact</FieldLabel>
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
                                disabled={!watchedCompanyId}
                              >
                                {(() => {
                                  if (selectedContact) {
                                    return `${selectedContact.name}${hasArchivedContact ? " (Archived)" : ""}`;
                                  }
                                  if (!watchedCompanyId) return "Select a company first";
                                  if (companyContacts.length === 0) return "No contacts available";
                                  return "Select contact...";
                                })()}
                                {field.value && (
                                  <XIcon
                                    className="ml-2 size-4 shrink-0 opacity-50 hover:opacity-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      form.setValue("primaryContactId", "", { shouldDirty: true });
                                    }}
                                  />
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                <CommandInput placeholder="Search contacts..." />
                                <CommandList>
                                  <CommandEmpty>No contact found.</CommandEmpty>
                                  <CommandGroup>
                                    {companyContacts.map((contact) => (
                                      <CommandItem
                                        key={contact.id}
                                        value={`${contact.name} ${contact.email}`}
                                        onSelect={() => {
                                          form.setValue("primaryContactId", contact.id, { shouldDirty: true });
                                          form.clearErrors("primaryContactId");
                                          setContactSearchOpen(false);
                                        }}
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
                      );
                    }}
                  />

                  {/* Stage */}
                  <Controller
                    control={form.control}
                    name="stage"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Stage <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => handleStageChange(v as DealStage)}
                          disabled={isClosedStage}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {(isEditing && isClosedStage ? allStages : openStages).map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isClosedStage && (
                          <p className="text-muted-foreground text-xs">Stage is locked for closed deals.</p>
                        )}
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Separator />

              {/* Value & Dates */}
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Value &amp; Dates
                </h3>
                <FieldGroup className="gap-4">
                  <Controller
                    control={form.control}
                    name="value"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="deal-value">
                          Value <span className="text-destructive">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm">
                            $
                          </span>
                          <Input
                            {...field}
                            id="deal-value"
                            type="number"
                            step="1"
                            min="0"
                            className="pl-7 tabular-nums"
                            placeholder="0"
                            aria-invalid={fieldState.invalid}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? 0 : Number.parseFloat(val));
                            }}
                          />
                        </div>
                        {field.value > 0 && (
                          <p className="text-muted-foreground text-xs">
                            {formatCurrency(field.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                        )}
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="probability"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="deal-probability">
                          Probability <span className="text-destructive">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="deal-probability"
                            type="number"
                            step="1"
                            min="0"
                            max={probabilityMax}
                            className="pr-8 tabular-nums"
                            aria-invalid={fieldState.invalid}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? 0 : Number.parseInt(val, 10));
                            }}
                          />
                          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">
                            %
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">{probabilityHint}</p>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="expectedCloseDate"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="deal-expected-close">
                          Expected Close Date <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input {...field} id="deal-expected-close" type="date" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <Separator />

              {/* Additional Details */}
              <div>
                <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Additional Details
                </h3>
                <FieldGroup className="gap-4">
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
                    name="health"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Health</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select health" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {healthOptions.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
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
                              {priorityOptions.map((p) => (
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

                  <Controller
                    control={form.control}
                    name="source"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel>Source</FieldLabel>
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
                    name="nextActivityDate"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="deal-next-activity">Next Activity Date</FieldLabel>
                        <Input {...field} id="deal-next-activity" type="date" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="deal-description">Description</FieldLabel>
                        <Textarea
                          {...field}
                          id="deal-description"
                          placeholder="Add a description for this deal..."
                          className="min-h-[80px]"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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

              <Separator />

              {/* Products */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Products &amp; Services
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => appendProduct({ name: "", quantity: 1, unitPrice: 0 })}
                  >
                    <PlusIcon className="size-3" />
                    Add Line
                  </Button>
                </div>
                {productFields.length > 0 ? (
                  <div className="space-y-3">
                    {productFields.map((field, index) => (
                      <div key={field.id} className="rounded-lg border border-border/60 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-muted-foreground text-xs">Line {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeProduct(index)}
                          >
                            <TrashIcon className="size-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <Controller
                            control={form.control}
                            name={`products.${index}.name`}
                            render={({ field: f, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">Product Name</FieldLabel>
                                <Input {...f} placeholder="Product name" className="h-8 text-xs" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name={`products.${index}.quantity`}
                            render={({ field: f, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">Qty</FieldLabel>
                                <Input
                                  {...f}
                                  type="number"
                                  step="1"
                                  min="1"
                                  className="h-8 text-xs tabular-nums"
                                  onChange={(e) => f.onChange(Number.parseInt(e.target.value, 10) || 1)}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name={`products.${index}.unitPrice`}
                            render={({ field: f, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">Unit Price</FieldLabel>
                                <Input
                                  {...f}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="h-8 text-xs tabular-nums"
                                  onChange={(e) => f.onChange(Number.parseFloat(e.target.value) || 0)}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end border-border border-t pt-2">
                      <span className="font-medium text-sm tabular-nums">
                        Products Total:{" "}
                        {formatCurrency(productsTotal, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    No line items added. Click "Add Line" to add products or services.
                  </p>
                )}
              </div>

              {/* Initial Note (Add only) */}
              {!isEditing && (
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
                            id="deal-initial-note"
                            placeholder="Add an optional note about this deal..."
                            className="min-h-[80px]"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </>
              )}
            </FieldGroup>
          </div>

          <SheetFooter className="border-t px-6 pt-4">
            <SheetClose asChild ref={closeRef}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {isEditing ? "Save Changes" : "Add Deal"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
