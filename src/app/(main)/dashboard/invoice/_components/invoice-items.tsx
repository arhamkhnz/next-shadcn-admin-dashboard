import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

import { getLineAmount, type InvoiceFormValues, type InvoiceLineItem } from "./data";

export function InvoiceItems() {
  const { control, register } = useFormContext<InvoiceFormValues>();
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "fieldKey",
  });
  const items = useWatch({ control, name: "items" }) ?? [];
  function handleDragEnd(event: DragEndEvent) {
    const { source } = event.operation;

    if (event.canceled || !isSortable(source) || source.initialIndex === source.index) {
      return;
    }

    move(source.initialIndex, source.index);
  }

  function handleAddItem() {
    append({ id: `item-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Itens da Fatura</h2>
        <Button type="button" variant="ghost" size="sm" onClick={handleAddItem}>
          <Plus data-icon="inline-start" />
          Adicionar item
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="hidden items-center gap-2 px-1 font-medium text-muted-foreground text-xs md:grid md:grid-cols-[24px_minmax(0,1fr)_64px_112px_112px_32px]">
          <span />
          <span>Descrição</span>
          <span className="px-2">Unidades</span>
          <span className="px-2">Custo unitário</span>
          <span className="text-right">Total do item</span>
          <span />
        </div>

        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <SortableInvoiceItemRow
                key={field.id}
                id={field.id}
                index={index}
                item={items[index]}
                register={register}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </DragDropProvider>
      </div>
    </section>
  );
}

function SortableInvoiceItemRow({
  id,
  index,
  item,
  register,
  onRemove,
}: {
  id: string;
  index: number;
  item?: InvoiceLineItem;
  register: UseFormRegister<InvoiceFormValues>;
  onRemove: () => void;
}) {
  const { handleRef, isDragging, ref } = useSortable({
    id,
    index,
    type: "invoice-item",
    accept: "invoice-item",
    group: "invoice-items",
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-0 grid-cols-[24px_minmax(0,0.8fr)_minmax(0,1fr)_32px] items-center gap-2 rounded-lg md:grid-cols-[24px_minmax(0,1fr)_64px_112px_112px_32px]",
        isDragging && "relative z-10 opacity-50",
      )}
    >
      <Button
        ref={handleRef}
        type="button"
        variant="ghost"
        size="icon-sm"
        className="-ml-2 cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-label={`Reordenar ${id}`}
      >
        <GripVertical />
      </Button>
      <Input
        className="min-w-0 text-sm max-md:col-span-3"
        aria-label={`Descrição do item ${index + 1}`}
        {...register(`items.${index}.description` as const)}
      />
      <Input
        type="number"
        step="1"
        className="text-sm max-md:col-start-2 max-md:row-start-2"
        aria-label={`Quantidade do item ${index + 1}`}
        {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
      />
      <Input
        type="number"
        step="0.01"
        className="text-sm max-md:col-start-3 max-md:row-start-2"
        aria-label={`Preço unitário do item ${index + 1}`}
        {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
      />
      <div className="min-w-0 text-right font-medium text-sm max-md:col-span-3 max-md:col-start-2 max-md:row-start-3 max-md:flex max-md:items-center max-md:justify-between max-md:text-left">
        <span className="hidden text-muted-foreground max-md:inline">Total do item</span>
        <span>{formatInvoiceCurrency(getLineAmount(item))}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="max-md:col-start-4 max-md:row-start-2"
        aria-label={`Remover item ${index + 1}`}
        onClick={onRemove}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

function formatInvoiceCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
