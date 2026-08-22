"use client";

import * as React from "react";

import {
  AlignLeft,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  CircleDot,
  DollarSign,
  EyeOff,
  Hash,
  Link2,
  ListChecks,
  Mail,
  Pencil,
  Percent,
  Phone,
  Plus,
  RotateCcw,
  Settings2,
  ToggleLeft,
  Type,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TableField } from "@/lib/crm-table-engine/types";
import { CUSTOM_FIELD_TYPE_LABELS, CUSTOM_FIELD_TYPES, type CustomFieldType } from "@/lib/crm-table-engine/types";
import { cn } from "@/lib/utils";

export const FIELD_TYPE_ICONS: Record<CustomFieldType, typeof Type> = {
  text: Type,
  long_text: AlignLeft,
  number: Hash,
  currency: DollarSign,
  percentage: Percent,
  date: CalendarDays,
  date_time: CalendarClock,
  checkbox: ToggleLeft,
  single_select: CircleDot,
  multi_select: ListChecks,
  email: Mail,
  phone: Phone,
  url: Link2,
};

export type ColumnHeaderActions = {
  onSort: (field: TableField, direction: "asc" | "desc") => void;
  onRename: (field: TableField, label: string) => void;
  onMove: (field: TableField, direction: "left" | "right") => void;
  onHide: (field: TableField) => void;
  onEditField: (field: TableField) => void;
  onArchiveField: (field: TableField) => void;
  onRestoreDefaultLabel: (field: TableField) => void;
};

export function ConfigurableColumnHeader({
  field,
  activeDirection,
  canMoveLeft,
  canMoveRight,
  labelOverridden,
  actions,
}: {
  field: TableField;
  activeDirection: "asc" | "desc" | null;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  labelOverridden: boolean;
  actions: ColumnHeaderActions;
}) {
  const [renameOpen, setRenameOpen] = React.useState(false);
  const TypeIcon = field.isCore ? null : FIELD_TYPE_ICONS[field.type];

  return (
    <div className="group/header flex min-w-0 items-center gap-0.5">
      <span className="flex min-w-0 items-center gap-1.5">
        {TypeIcon ? <TypeIcon className="size-3 shrink-0 text-muted-foreground" /> : null}
        <span className="truncate">{field.displayLabel}</span>
        {activeDirection ? <SortIndicator direction={activeDirection} /> : null}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Column options for ${field.displayLabel}`}
            className="size-5 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/header:opacity-100 data-[state=open]:opacity-100"
          >
            <ChevronDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {field.sortable ? (
            <>
              <DropdownMenuItem onClick={() => actions.onSort(field, "asc")}>
                <ArrowUp className="size-3.5" />
                Sort ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onSort(field, "desc")}>
                <ArrowDown className="size-3.5" />
                Sort descending
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            <Pencil className="size-3.5" />
            Rename display label
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canMoveLeft} onClick={() => actions.onMove(field, "left")}>
            <ArrowLeft className="size-3.5" />
            Move left
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canMoveRight} onClick={() => actions.onMove(field, "right")}>
            <ArrowRight className="size-3.5" />
            Move right
          </DropdownMenuItem>
          <DropdownMenuItem disabled={field.isRequiredBySystem} onClick={() => actions.onHide(field)}>
            <EyeOff className="size-3.5" />
            Hide from this view
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!field.isCore ? (
            <>
              <DropdownMenuItem onClick={() => actions.onEditField(field)}>
                <Settings2 className="size-3.5" />
                Edit field…
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => actions.onArchiveField(field)}>
                Archive field
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem disabled={!labelOverridden} onClick={() => actions.onRestoreDefaultLabel(field)}>
              <RotateCcw className="size-3.5" />
              Restore default label
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameColumnDialog
        key={renameOpen ? `open-${field.key}` : "closed"}
        open={renameOpen}
        onOpenChange={setRenameOpen}
        field={field}
        onSubmit={(label) => actions.onRename(field, label)}
      />
    </div>
  );
}

function RenameColumnDialog({
  open,
  onOpenChange,
  field,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: TableField;
  onSubmit: (label: string) => void;
}) {
  const [label, setLabel] = React.useState(field.displayLabel);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setLabel(field.displayLabel);
      setError(null);
    }
  }, [open, field.displayLabel]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename “{field.defaultLabel}”</DialogTitle>
          <DialogDescription>
            Only the visible label changes. The technical key{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{field.key}</code> stays stable.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-2">
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`rename-${field.id}`}>Display Label</FieldLabel>
            <Input
              id={`rename-${field.id}`}
              value={label}
              autoFocus
              onChange={(event) => {
                setLabel(event.target.value);
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (!label.trim()) {
                    setError("Display label is required.");
                    return;
                  }
                  onSubmit(label.trim());
                  onOpenChange(false);
                }
              }}
              aria-invalid={Boolean(error)}
            />
            {error ? <FieldError errors={[{ message: error }]} /> : null}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!label.trim()) {
                setError("Display label is required.");
                return;
              }
              onSubmit(label.trim());
              onOpenChange(false);
            }}
          >
            Save Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SortIndicator({ direction }: { direction: "asc" | "desc" }) {
  if (direction === "asc") {
    return <ArrowUp className="size-3 shrink-0 text-muted-foreground" aria-label="Sorted ascending" />;
  }
  return <ArrowDown className="size-3 shrink-0 text-muted-foreground" aria-label="Sorted descending" />;
}

export function AddFieldHeader({ onCreateField }: { onCreateField: (type: CustomFieldType) => void }) {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Add custom field"
                className="size-6 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <Plus className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Add custom field</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" side="bottom" className="max-h-80 w-48 overflow-y-auto">
          {CUSTOM_FIELD_TYPES.map((type) => {
            const Icon = FIELD_TYPE_ICONS[type];
            return (
              <DropdownMenuItem key={type} onClick={() => onCreateField(type)}>
                <Icon className="size-3.5" />
                {CUSTOM_FIELD_TYPE_LABELS[type]}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ColumnResizeHandle({
  onMouseDown,
  onTouchStart,
  isResizing,
}: {
  onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
  isResizing: boolean;
}) {
  return (
    <button
      type="button"
      aria-label="Resize column"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={cn(
        "absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none",
        "after:absolute after:-inset-x-1 after:inset-y-0",
        isResizing ? "bg-primary/60" : "bg-transparent hover:bg-border focus-visible:bg-primary/40",
      )}
    />
  );
}

export function toastArchivedField(label: string) {
  toast(`${label} archived`, { description: "Saved values are preserved and the field can be restored." });
}

export function toastRestoredField(label: string) {
  toast(`${label} restored`, { description: "The field is available again in the table." });
}
