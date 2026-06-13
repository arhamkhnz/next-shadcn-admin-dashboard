import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { formatMoney, getLineAmount, type InvoiceFormValues, type InvoiceLineItem } from "./data";

const ITEM_IDS = ["item1", "item2", "item3"] as const;

type InvoiceItemId = (typeof ITEM_IDS)[number];

function isInvoiceItemId(id: unknown): id is InvoiceItemId {
  return ITEM_IDS.includes(id as InvoiceItemId);
}

export function InvoiceItemsEditor() {
  const { control, getValues, register, setValue } = useFormContext<InvoiceFormValues>();
  const item1 = useWatch({ control, name: "item1" });
  const item2 = useWatch({ control, name: "item2" });
  const item3 = useWatch({ control, name: "item3" });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (!isInvoiceItemId(active.id) || !isInvoiceItemId(over.id)) return;

    const oldIndex = ITEM_IDS.indexOf(active.id);
    const newIndex = ITEM_IDS.indexOf(over.id);
    const items = ITEM_IDS.map((id) => getValues(id));
    const reorderedItems = arrayMove(items, oldIndex, newIndex);

    ITEM_IDS.forEach((id, index) => {
      setValue(id, reorderedItems[index], {
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-semibold text-xl tracking-tight">Invoice Items</h2>

      <div className="hidden items-center gap-2 px-1 font-medium text-muted-foreground text-xs md:grid md:grid-cols-[24px_minmax(0,1fr)_64px_112px_112px_32px]">
        <span />
        <span>Item / Description</span>
        <span className="text-center">Qty</span>
        <span className="text-center">Unit Price</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      <DndContext
        id="invoice-items"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ITEM_IDS} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            <SortableInvoiceItemRow
              id="item1"
              item={item1}
              register={register}
              descriptionLabel="First item description"
              quantityLabel="First item quantity"
              unitPriceLabel="First item unit price"
              removeLabel="Remove first item"
            />
            <SortableInvoiceItemRow
              id="item2"
              item={item2}
              register={register}
              descriptionLabel="Second item description"
              quantityLabel="Second item quantity"
              unitPriceLabel="Second item unit price"
              removeLabel="Remove second item"
            />
            <SortableInvoiceItemRow
              id="item3"
              item={item3}
              register={register}
              descriptionLabel="Third item description"
              quantityLabel="Third item quantity"
              unitPriceLabel="Third item unit price"
              removeLabel="Remove third item"
            />
          </div>
        </SortableContext>
      </DndContext>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
        <Separator />
        <Button type="button" variant="outline" className="text-primary">
          <Plus data-icon="inline-start" />
          Add Item
        </Button>
        <Separator />
      </div>
    </section>
  );
}

function SortableInvoiceItemRow({
  id,
  item,
  register,
  descriptionLabel,
  quantityLabel,
  unitPriceLabel,
  removeLabel,
}: {
  id: InvoiceItemId;
  item?: InvoiceLineItem;
  register: UseFormRegister<InvoiceFormValues>;
  descriptionLabel: string;
  quantityLabel: string;
  unitPriceLabel: string;
  removeLabel: string;
}) {
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn(
        "grid min-w-0 items-center gap-2 rounded-lg md:grid-cols-[24px_minmax(0,1fr)_64px_112px_112px_32px]",
        isDragging && "relative z-10 opacity-50",
      )}
    >
      <Button
        ref={setActivatorNodeRef}
        type="button"
        variant="ghost"
        size="icon-sm"
        className="cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-label={`Reorder ${id}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical />
      </Button>
      <Input className="h-10 min-w-0 text-sm" aria-label={descriptionLabel} {...register(`${id}.description`)} />
      <Input
        type="number"
        step="1"
        className="h-10 text-center text-sm"
        aria-label={quantityLabel}
        {...register(`${id}.quantity`, { valueAsNumber: true })}
      />
      <Input
        type="number"
        step="0.01"
        className="h-10 text-right text-sm"
        aria-label={unitPriceLabel}
        {...register(`${id}.unitPrice`, { valueAsNumber: true })}
      />
      <div className="min-w-0 text-right font-medium text-sm max-md:text-left">{formatMoney(getLineAmount(item))}</div>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={removeLabel}>
        <Trash2 />
      </Button>
    </div>
  );
}
