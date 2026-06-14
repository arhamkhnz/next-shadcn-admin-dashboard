import { format, parseISO } from "date-fns";
import { CalendarDays, Hash } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { InvoiceFormValues } from "./data";

export function InvoiceDetailsFields() {
  const { control, register } = useFormContext<InvoiceFormValues>();

  return (
    <section className="flex flex-col gap-3">
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="font-normal" htmlFor="reference-number">
            Reference Number
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="reference-number" {...register("referenceNumber")} />
            <InputGroupAddon align="inline-end">
              <Hash />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Controller
            control={control}
            name="issuedDate"
            render={({ field }) => (
              <Field className="gap-1">
                <FieldLabel className="font-normal" htmlFor="issued-date">
                  Issued Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="issued-date"
                      type="button"
                      variant="outline"
                      className="h-8 justify-between font-normal"
                    >
                      {formatDateLabel(field.value)}
                      <CalendarDays data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDateValue(field.value)}
                      onSelect={(date) => {
                        if (date) field.onChange(format(date, "yyyy-MM-dd"));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="paymentDueDate"
            render={({ field }) => (
              <Field className="gap-1">
                <FieldLabel className="font-normal" htmlFor="payment-due-date">
                  Due Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="payment-due-date"
                      type="button"
                      variant="outline"
                      className="h-8 justify-between font-normal"
                    >
                      {formatDateLabel(field.value)}
                      <CalendarDays data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDateValue(field.value)}
                      onSelect={(date) => {
                        if (date) field.onChange(format(date, "yyyy-MM-dd"));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </section>
  );
}

function parseDateValue(value: string) {
  const date = parseISO(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatDateLabel(value: string) {
  const date = parseDateValue(value);

  return date ? format(date, "MMM d, yyyy") : "Select date";
}
