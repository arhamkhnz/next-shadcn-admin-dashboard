import { Plus } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type InvoiceFormValues, invoiceClients } from "./data";

export function ClientSelector() {
  const { control } = useFormContext<InvoiceFormValues>();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Billed To</h2>
        <Button type="button" variant="ghost" size="sm">
          <Plus data-icon="inline-start" />
          Add New Client
        </Button>
      </div>

      <Controller
        control={control}
        name="to"
        render={({ field }) => (
          <Field className="gap-1">
            <FieldLabel className="font-normal">Client</FieldLabel>
            <Select
              value={field.value.id}
              onValueChange={(clientId) => {
                const selectedClient = invoiceClients.find((item) => item.id === clientId);

                if (selectedClient) {
                  field.onChange(selectedClient);
                }
              }}
            >
              <SelectTrigger className="min-h-16 w-full gap-3 px-3 text-left">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-foreground">
                  <span className="block size-6 -skew-x-12 bg-foreground" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{field.value.name}</span>
                  <span className="block truncate text-muted-foreground">{field.value.email}</span>
                </span>
                <SelectValue className="sr-only" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {invoiceClients.map((clientOption) => (
                    <SelectItem key={clientOption.id} value={clientOption.id}>
                      {clientOption.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </section>
  );
}
