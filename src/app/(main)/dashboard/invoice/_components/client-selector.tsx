import { ChevronDown, Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

import type { InvoiceFormValues } from "./data";

export function ClientSelector() {
  const { watch } = useFormContext<InvoiceFormValues>();
  const client = watch("to");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-xl tracking-tight">Billed To</h2>
        <Button type="button" variant="ghost" size="sm" className="text-primary hover:text-primary">
          <Plus data-icon="inline-start" />
          Add New Client
        </Button>
      </div>

      <Field>
        <FieldLabel>Client</FieldLabel>
        <button
          type="button"
          className="flex min-h-16 w-full items-center gap-3 rounded-lg border bg-background px-3 text-left text-sm transition-colors hover:bg-muted/60"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-foreground">
            <span className="block size-6 -skew-x-12 bg-foreground" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{client.name}</span>
            <span className="block truncate text-muted-foreground">{client.email}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </Field>
    </section>
  );
}
