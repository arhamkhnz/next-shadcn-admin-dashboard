"use client";

import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, RotateCcw, Trophy, XCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { currentSalesOwnerId } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { Deal, DealStage } from "./deals-data/schema";
import { useDealStore } from "./deals-data/use-deal-store";

const openStages: readonly DealStage[] = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"];

const stageOrder: readonly DealStage[] = [
  "Discovery",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const stageProbabilityDefaults: Record<DealStage, number> = {
  Discovery: 15,
  Qualified: 35,
  "Proposal Sent": 60,
  Negotiation: 80,
  "Closed Won": 100,
  "Closed Lost": 0,
};

const lossReasons = [
  "Price",
  "Competitor",
  "No Budget",
  "No Decision",
  "Timing",
  "Requirements Mismatch",
  "Lost Contact",
  "Other",
] as const;

function isForwardMove(from: DealStage, to: DealStage): boolean {
  return stageOrder.indexOf(to) > stageOrder.indexOf(from);
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function generateActivityId(): string {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* -------------------------------------------------------------------------- */
/* Change Stage Dialog                                                        */
/* -------------------------------------------------------------------------- */

const changeStageSchema = z.object({
  newStage: z.enum(["Discovery", "Qualified", "Proposal Sent", "Negotiation"]),
  probability: z
    .number({ message: "Probability must be a valid number." })
    .int({ message: "Probability must be a whole number." })
    .min(1, { message: "Open deals must have a probability between 1 and 99." })
    .max(99, { message: "Open deals must have a probability between 1 and 99." }),
  note: z.string().max(500, { message: "Note must be 500 characters or fewer." }).optional(),
});

type ChangeStageValues = z.infer<typeof changeStageSchema>;

interface ChangeStageDialogProps {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeStageDialog({ deal, open, onOpenChange }: ChangeStageDialogProps) {
  const updateDeal = useDealStore((s) => s.updateDeal);
  const [confirmBackward, setConfirmBackward] = useState(false);

  const form = useForm<ChangeStageValues>({
    resolver: zodResolver(changeStageSchema),
    defaultValues: {
      newStage: "Discovery",
      probability: 15,
      note: "",
    },
  });

  const watchedNewStage = form.watch("newStage");
  const backward = isForwardMove(deal.stage, watchedNewStage) === false && deal.stage !== watchedNewStage;

  const handleStageChange = useCallback(
    (stage: DealStage) => {
      form.setValue("newStage", stage as "Discovery" | "Qualified" | "Proposal Sent" | "Negotiation", {
        shouldDirty: true,
      });
      form.setValue("probability", stageProbabilityDefaults[stage], { shouldDirty: true });
      form.clearErrors("newStage");
      form.clearErrors("probability");
    },
    [form],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setConfirmBackward(false);
        form.reset();
      }
      onOpenChange(nextOpen);
    },
    [form, onOpenChange],
  );

  function onSubmit(values: ChangeStageValues) {
    if (backward && !confirmBackward) {
      setConfirmBackward(true);
      return;
    }

    const now = new Date().toISOString();
    const activity = {
      id: generateActivityId(),
      type: "status_change" as const,
      title: `Stage changed from ${deal.stage} to ${values.newStage}`,
      description: values.note || undefined,
      date: now,
      createdBy: currentSalesOwnerId,
    };

    updateDeal(deal.id, {
      stage: values.newStage,
      probability: values.probability,
      updatedAt: now,
      activities: [...deal.activities, activity],
    });

    toast("Stage updated", {
      description: `${deal.name} moved from ${deal.stage} to ${values.newStage}.`,
    });

    setConfirmBackward(false);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Stage</DialogTitle>
          <DialogDescription>Move this deal to a different stage in the pipeline.</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 py-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="font-medium text-sm">{deal.name}</div>
              <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
                <span>Current: {deal.stage}</span>
                <ArrowRight className="size-3" />
                <span className="font-medium text-foreground">{watchedNewStage}</span>
              </div>
              <div className="mt-1 text-muted-foreground text-xs">Current probability: {deal.probability}%</div>
            </div>

            <Controller
              control={form.control}
              name="newStage"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    New Stage <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={(v) => handleStageChange(v as DealStage)}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {openStages.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                            <span className="ml-1 text-muted-foreground text-xs">({stageProbabilityDefaults[s]}%)</span>
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
              name="probability"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stage-probability">
                    Probability <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="stage-probability"
                      type="number"
                      step="1"
                      min="1"
                      max="99"
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
                  <p className="text-muted-foreground text-xs">
                    Suggested for {watchedNewStage}: {stageProbabilityDefaults[watchedNewStage]}%
                  </p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stage-note">Note (optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="stage-note"
                    placeholder="Add a note about this stage change..."
                    className="min-h-[60px]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {backward && confirmBackward && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900/30 dark:bg-amber-500/10 dark:text-amber-300">
                <p className="font-medium text-sm">Moving backward in the pipeline</p>
                <p className="mt-0.5 text-xs">
                  You are moving {deal.name} from {deal.stage} back to {watchedNewStage}. This will lower the
                  probability. Are you sure?
                </p>
              </div>
            )}
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant={backward && !confirmBackward ? "outline" : "default"}>
              {backward && !confirmBackward ? "Confirm Backward Move" : "Change Stage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Mark Won Dialog                                                            */
/* -------------------------------------------------------------------------- */

const markWonSchema = z.object({
  actualCloseDate: z.string().min(1, { message: "Actual close date is required." }),
  finalValue: z
    .number({ message: "Value must be a valid number." })
    .positive({ message: "Value must be greater than zero." }),
  note: z.string().max(500, { message: "Note must be 500 characters or fewer." }).optional(),
});

type MarkWonValues = z.infer<typeof markWonSchema>;

interface MarkWonDialogProps {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkWonDialog({ deal, open, onOpenChange }: MarkWonDialogProps) {
  const updateDeal = useDealStore((s) => s.updateDeal);
  const company = useCompanyStore((s) => s.getCompanyById(deal.companyId));

  const form = useForm<MarkWonValues>({
    resolver: zodResolver(markWonSchema),
    defaultValues: {
      actualCloseDate: todayString(),
      finalValue: deal.value,
      note: "",
    },
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) form.reset();
      onOpenChange(nextOpen);
    },
    [form, onOpenChange],
  );

  function onSubmit(values: MarkWonValues) {
    const now = new Date().toISOString();
    const activity = {
      id: generateActivityId(),
      type: "status_change" as const,
      title: `Deal marked as won`,
      description: values.note || undefined,
      date: now,
      createdBy: currentSalesOwnerId,
    };

    updateDeal(deal.id, {
      stage: "Closed Won",
      probability: 100,
      actualCloseDate: values.actualCloseDate,
      value: values.finalValue,
      lostReason: null,
      updatedAt: now,
      activities: [...deal.activities, activity],
    });

    toast.success("Deal marked as won", {
      description: `${deal.name} has been marked as won.`,
    });

    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="size-4 text-emerald-600 dark:text-emerald-400" />
            Mark Deal Won
          </DialogTitle>
          <DialogDescription>Confirm that this deal has been won.</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 py-2">
            <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3">
              <div className="font-medium text-sm">{deal.name}</div>
              {company && <div className="text-muted-foreground text-xs">Company: {company.name}</div>}
              <div className="text-muted-foreground text-xs">Stage: {deal.stage}</div>
              <div className="text-muted-foreground text-xs">Current value: ${deal.value.toLocaleString()}</div>
            </div>

            <Controller
              control={form.control}
              name="actualCloseDate"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="won-close-date">
                    Actual Close Date <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input {...field} id="won-close-date" type="date" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="finalValue"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="won-final-value">
                    Final Value <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      {...field}
                      id="won-final-value"
                      type="number"
                      step="1"
                      min="0"
                      className="pl-7 tabular-nums"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : Number.parseFloat(val));
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Defaults to the current deal value. Adjust if the final amount differs.
                  </p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="won-note">Closing Note (optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="won-note"
                    placeholder="Add a note about closing this deal..."
                    className="min-h-[60px]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="gap-1.5">
              <Trophy className="size-3.5" />
              Mark Deal Won
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Mark Lost Dialog                                                           */
/* -------------------------------------------------------------------------- */

const markLostSchema = z
  .object({
    actualCloseDate: z.string().min(1, { message: "Actual close date is required." }),
    lossReason: z.string().min(1, { message: "Loss reason is required." }),
    customReason: z.string().max(200, { message: "Custom reason must be 200 characters or fewer." }).optional(),
    note: z.string().max(500, { message: "Note must be 500 characters or fewer." }).optional(),
  })
  .refine(
    (data) => {
      if (data.lossReason === "Other") return Boolean(data.customReason?.trim());
      return true;
    },
    { message: "Please provide a custom reason when selecting Other.", path: ["customReason"] },
  );

type MarkLostValues = z.infer<typeof markLostSchema>;

interface MarkLostDialogProps {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkLostDialog({ deal, open, onOpenChange }: MarkLostDialogProps) {
  const updateDeal = useDealStore((s) => s.updateDeal);
  const company = useCompanyStore((s) => s.getCompanyById(deal.companyId));

  const form = useForm<MarkLostValues>({
    resolver: zodResolver(markLostSchema),
    defaultValues: {
      actualCloseDate: todayString(),
      lossReason: "",
      customReason: "",
      note: "",
    },
  });

  const watchedLossReason = form.watch("lossReason");

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) form.reset();
      onOpenChange(nextOpen);
    },
    [form, onOpenChange],
  );

  function onSubmit(values: MarkLostValues) {
    const reason = values.lossReason === "Other" ? values.customReason?.trim() : values.lossReason;
    const now = new Date().toISOString();
    const activity = {
      id: generateActivityId(),
      type: "status_change" as const,
      title: `Deal marked as lost`,
      description: [reason, values.note].filter(Boolean).join(" — ") || undefined,
      date: now,
      createdBy: currentSalesOwnerId,
    };

    updateDeal(deal.id, {
      stage: "Closed Lost",
      probability: 0,
      actualCloseDate: values.actualCloseDate,
      lostReason: reason ?? null,
      updatedAt: now,
      activities: [...deal.activities, activity],
    });

    toast.success("Deal marked as lost", {
      description: `${deal.name} has been marked as lost.`,
    });

    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="size-4 text-rose-600 dark:text-rose-400" />
            Mark Deal Lost
          </DialogTitle>
          <DialogDescription>Confirm that this deal has been lost and provide a reason.</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 py-2">
            <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3">
              <div className="font-medium text-sm">{deal.name}</div>
              {company && <div className="text-muted-foreground text-xs">Company: {company.name}</div>}
              <div className="text-muted-foreground text-xs">Stage: {deal.stage}</div>
              <div className="text-muted-foreground text-xs">Deal value: ${deal.value.toLocaleString()}</div>
            </div>

            <Controller
              control={form.control}
              name="actualCloseDate"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lost-close-date">
                    Actual Close Date <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input {...field} id="lost-close-date" type="date" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="lossReason"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Loss Reason <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {lossReasons.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {watchedLossReason === "Other" && (
              <Controller
                control={form.control}
                name="customReason"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lost-custom-reason">
                      Custom Reason <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lost-custom-reason"
                      placeholder="Describe the reason for the loss..."
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}

            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lost-note">Detailed Note (optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="lost-note"
                    placeholder="Add additional details about the loss..."
                    className="min-h-[60px]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" className="gap-1.5">
              <XCircle className="size-3.5" />
              Mark Deal Lost
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Reopen Deal Dialog                                                         */
/* -------------------------------------------------------------------------- */

const reopenSchema = z.object({
  newStage: z.enum(["Discovery", "Qualified", "Proposal Sent", "Negotiation"]),
  probability: z
    .number({ message: "Probability must be a valid number." })
    .int({ message: "Probability must be a whole number." })
    .min(1, { message: "Probability must be between 1 and 99." })
    .max(99, { message: "Probability must be between 1 and 99." }),
  expectedCloseDate: z.string().min(1, { message: "New expected close date is required." }),
  reopenReason: z
    .string()
    .trim()
    .min(1, { message: "Reason for reopening is required." })
    .max(500, { message: "Reason must be 500 characters or fewer." }),
  note: z.string().max(500, { message: "Note must be 500 characters or fewer." }).optional(),
});

type ReopenValues = z.infer<typeof reopenSchema>;

interface ReopenDealDialogProps {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReopenDealDialog({ deal, open, onOpenChange }: ReopenDealDialogProps) {
  const updateDeal = useDealStore((s) => s.updateDeal);

  const previousOutcome = deal.stage === "Closed Won" ? "Won" : "Lost";

  const form = useForm<ReopenValues>({
    resolver: zodResolver(reopenSchema),
    defaultValues: {
      newStage: "Discovery",
      probability: 15,
      expectedCloseDate: "",
      reopenReason: "",
      note: "",
    },
  });

  const watchedNewStage = form.watch("newStage");

  const handleStageChange = useCallback(
    (stage: DealStage) => {
      form.setValue("newStage", stage as "Discovery" | "Qualified" | "Proposal Sent" | "Negotiation", {
        shouldDirty: true,
      });
      form.setValue("probability", stageProbabilityDefaults[stage], { shouldDirty: true });
      form.clearErrors("newStage");
      form.clearErrors("probability");
    },
    [form],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) form.reset();
      onOpenChange(nextOpen);
    },
    [form, onOpenChange],
  );

  function onSubmit(values: ReopenValues) {
    const now = new Date().toISOString();
    const activity = {
      id: generateActivityId(),
      type: "status_change" as const,
      title: `Deal reopened from ${previousOutcome}`,
      description: [values.reopenReason, values.note].filter(Boolean).join(" — ") || undefined,
      date: now,
      createdBy: currentSalesOwnerId,
    };

    updateDeal(deal.id, {
      stage: values.newStage,
      probability: values.probability,
      expectedCloseDate: values.expectedCloseDate,
      actualCloseDate: null,
      lostReason: null,
      updatedAt: now,
      activities: [...deal.activities, activity],
    });

    toast.success("Deal reopened", {
      description: `${deal.name} has been reopened as ${values.newStage}.`,
    });

    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="size-4 text-sky-600 dark:text-sky-400" />
            Reopen Deal
          </DialogTitle>
          <DialogDescription>Return this deal to an active stage in the pipeline.</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 py-2">
            <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3">
              <div className="font-medium text-sm">{deal.name}</div>
              <div className="text-muted-foreground text-xs">
                Current outcome: {previousOutcome} ({deal.stage})
              </div>
            </div>

            <Controller
              control={form.control}
              name="newStage"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    New Open Stage <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={(v) => handleStageChange(v as DealStage)}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {openStages.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                            <span className="ml-1 text-muted-foreground text-xs">({stageProbabilityDefaults[s]}%)</span>
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
              name="probability"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reopen-probability">
                    Probability <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="reopen-probability"
                      type="number"
                      step="1"
                      min="1"
                      max="99"
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
                  <p className="text-muted-foreground text-xs">
                    Suggested for {watchedNewStage}: {stageProbabilityDefaults[watchedNewStage]}%
                  </p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="expectedCloseDate"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reopen-close-date">
                    New Expected Close Date <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input {...field} id="reopen-close-date" type="date" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="reopenReason"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reopen-reason">
                    Reason for Reopening <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="reopen-reason"
                    placeholder="Why is this deal being reopened?"
                    className="min-h-[60px]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reopen-note">Note (optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="reopen-note"
                    placeholder="Add an optional note..."
                    className="min-h-[60px]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="gap-1.5">
              <RotateCcw className="size-3.5" />
              Reopen Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
