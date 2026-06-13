import { useFormContext } from "react-hook-form";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import type { InvoiceFormValues } from "./data";

export function TaxDiscountFields() {
  const { register } = useFormContext<InvoiceFormValues>();

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <Field>
        <FieldLabel>Tax</FieldLabel>
        <InputGroup className="h-12">
          <InputGroupInput
            type="number"
            step="0.01"
            className="text-center"
            aria-label="Tax rate"
            {...register("taxRate", { valueAsNumber: true })}
          />
          <InputGroupAddon align="inline-end">%</InputGroupAddon>
        </InputGroup>
      </Field>
      <div className="grid grid-cols-[1fr_96px] gap-4">
        <Field>
          <FieldLabel>Discount</FieldLabel>
          <InputGroup className="h-12">
            <InputGroupAddon align="inline-start">$</InputGroupAddon>
            <InputGroupInput
              type="number"
              step="0.01"
              className="text-center"
              aria-label="Discount amount"
              {...register("discount", { valueAsNumber: true })}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel className="opacity-0">Discount Percent</FieldLabel>
          <InputGroup className="h-12">
            <InputGroupInput value="0" readOnly className="text-center" aria-label="Discount percent" tabIndex={-1} />
            <InputGroupAddon align="inline-end">%</InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
    </div>
  );
}
