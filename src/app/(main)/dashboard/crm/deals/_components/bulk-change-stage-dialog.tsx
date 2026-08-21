"use client";

import { useState } from "react";

import { ArrowRight } from "lucide-react";

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

import type { DealStage } from "./deals-data/schema";

const openStages: readonly DealStage[] = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"];

const stageProbabilityDefaults: Record<DealStage, number> = {
  Discovery: 15,
  Qualified: 35,
  "Proposal Sent": 60,
  Negotiation: 80,
  "Closed Won": 100,
  "Closed Lost": 0,
};

interface BulkChangeStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: (stage: DealStage, probability: number) => void;
}

export function BulkChangeStageDialog({ open, onOpenChange, count, onConfirm }: BulkChangeStageDialogProps) {
  const [stage, setStage] = useState<DealStage>("Discovery");
  const [probability, setProbability] = useState(15);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setStage("Discovery");
      setProbability(15);
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  function handleStageChange(value: string) {
    const s = value as DealStage;
    setStage(s);
    setProbability(stageProbabilityDefaults[s]);
    setError(null);
  }

  function handleConfirm() {
    if (probability < 1 || probability > 99) {
      setError("Probability must be between 1 and 99 for open stages.");
      return;
    }
    onConfirm(stage, probability);
    handleOpenChange(false);
  }

  const label = count === 1 ? "deal" : "deals";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Change Stage for {count} {label}
          </DialogTitle>
          <DialogDescription>Move the selected {label} to a different stage in the pipeline.</DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>
              New Stage <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={stage} onValueChange={handleStageChange}>
              <SelectTrigger>
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
          </Field>

          <Field className="gap-1.5" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="bulk-stage-probability">
              Probability <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="bulk-stage-probability"
                type="number"
                step="1"
                min="1"
                max="99"
                value={probability}
                className="pr-8 tabular-nums"
                aria-invalid={Boolean(error)}
                onChange={(e) => {
                  const val = e.target.value;
                  setProbability(val === "" ? 0 : Number.parseInt(val, 10));
                  setError(null);
                }}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">
                %
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Suggested for {stage}: {stageProbabilityDefaults[stage]}%
            </p>
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-muted-foreground text-xs">
            <div className="flex items-center gap-2">
              <span>Target: {stage}</span>
              <ArrowRight className="size-3" />
              <span className="font-medium text-foreground">{probability}% probability</span>
            </div>
          </div>
        </FieldGroup>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm}>
            Change Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
