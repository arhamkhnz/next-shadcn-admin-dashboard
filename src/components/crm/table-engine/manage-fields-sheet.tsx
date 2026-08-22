"use client";

import * as React from "react";

import Link from "next/link";

import { ArchiveRestore, ArrowDown, ArrowUp, Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { CrmEntityType, TableField } from "@/lib/crm-table-engine/types";
import { CUSTOM_FIELD_TYPE_LABELS } from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

import { FIELD_TYPE_ICONS } from "./configurable-column-header";

function FieldRow({
  field,
  canMoveUp,
  canMoveDown,
  onMove,
  onRename,
  onRestoreDefaultLabel,
  onVisibilityChange,
  onWidthChange,
  onEdit,
  onArchive,
  onRestore,
}: {
  field: TableField;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (fieldKey: string, direction: "up" | "down") => void;
  onRename: (fieldId: string, label: string) => void;
  onRestoreDefaultLabel: (fieldId: string) => void;
  onVisibilityChange: (fieldId: string, scope: "table" | "form", visible: boolean) => void;
  onWidthChange: (fieldId: string, width: number) => void;
  onEdit?: (field: TableField) => void;
  onArchive?: (field: TableField) => void;
  onRestore?: (field: TableField) => void;
}) {
  const [labelDraft, setLabelDraft] = React.useState(field.displayLabel);
  const [widthDraft, setWidthDraft] = React.useState(String(field.width));

  React.useEffect(() => {
    setLabelDraft(field.displayLabel);
    setWidthDraft(String(field.width));
  }, [field.displayLabel, field.width]);

  const TypeIcon = FIELD_TYPE_ICONS[field.type];
  const labelOverridden = field.displayLabel !== field.defaultLabel;

  return (
    <li className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-5"
            aria-label={`Move ${field.displayLabel} up`}
            disabled={!canMoveUp}
            onClick={() => onMove(field.key, "up")}
          >
            <ArrowUp className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-5"
            aria-label={`Move ${field.displayLabel} down`}
            disabled={!canMoveDown}
            onClick={() => onMove(field.key, "down")}
          >
            <ArrowDown className="size-3" />
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          <Input
            aria-label={`${field.defaultLabel} display label`}
            value={labelDraft}
            onChange={(event) => setLabelDraft(event.target.value)}
            onBlur={() => {
              const trimmed = labelDraft.trim();
              if (!trimmed || trimmed === field.displayLabel) {
                setLabelDraft(field.displayLabel);
                return;
              }
              onRename(field.id, trimmed);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            className="h-8"
          />
          <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{field.key}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {labelOverridden ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7"
              aria-label={`Restore default label for ${field.defaultLabel}`}
              title="Restore default label"
              onClick={() => onRestoreDefaultLabel(field.id)}
            >
              <RotateCcw className="size-3.5" />
            </Button>
          ) : null}
          {!field.isCore && onEdit ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7"
              aria-label={`Edit ${field.displayLabel}`}
              title="Edit field configuration"
              onClick={() => onEdit(field)}
            >
              <Pencil className="size-3.5" />
            </Button>
          ) : null}
          {!field.isCore && field.archivedAt && onRestore ? (
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onRestore(field)}>
              <ArchiveRestore className="size-3.5" />
              Restore
            </Button>
          ) : null}
          {!field.isCore && !field.archivedAt && onArchive ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-destructive text-xs hover:text-destructive"
              onClick={() => onArchive(field)}
            >
              Archive
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <TypeIcon className="size-3" />
          {CUSTOM_FIELD_TYPE_LABELS[field.type]}
        </span>
        <div className="flex items-center gap-1.5">
          Width
          <Input
            type="number"
            min={72}
            max={640}
            aria-label={`${field.displayLabel} column width`}
            value={widthDraft}
            onChange={(event) => setWidthDraft(event.target.value)}
            onBlur={() => {
              const parsed = Number(widthDraft);
              if (Number.isFinite(parsed)) onWidthChange(field.id, parsed);
              else setWidthDraft(String(field.width));
            }}
            className="h-6 w-20 px-1.5 text-xs tabular-nums"
          />
        </div>
        <div className="flex items-center gap-1.5">
          Show in table
          <Switch
            aria-label={`${field.displayLabel} visible in table`}
            checked={field.visibleInTable}
            disabled={field.isRequiredBySystem}
            onCheckedChange={(checked) => onVisibilityChange(field.id, "table", checked)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          Show in forms
          <Switch
            aria-label={`${field.displayLabel} visible in forms`}
            checked={field.visibleInForm}
            onCheckedChange={(checked) => onVisibilityChange(field.id, "form", checked)}
          />
        </div>
        {!field.visibleInTable ? (
          <Badge variant="outline" className="text-[10px]">
            Hidden in table
          </Badge>
        ) : null}
        {field.required ? (
          <Badge variant="outline" className="text-[10px]">
            Required in forms
          </Badge>
        ) : null}
        {field.archivedAt ? (
          <Badge variant="outline" className="text-[10px]">
            Archived · values preserved
          </Badge>
        ) : null}
      </div>
    </li>
  );
}

export function ManageFieldsSheet({
  open,
  onOpenChange,
  entityType,
  onEditField,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: CrmEntityType;
  onEditField: (field: TableField) => void;
}) {
  const entityCoreFields = useCrmConfigStore((s) => s.coreFields[entityType]);
  const allCustomFields = useCrmConfigStore((s) => s.customFields);
  const terminology = useCrmConfigStore((s) => s.terminology[entityType]);
  const store = useCrmConfigStore();

  const coreFields = React.useMemo(() => entityCoreFields ?? [], [entityCoreFields]);
  const customFields = React.useMemo(
    () => allCustomFields.filter((f) => f.entityType === entityType),
    [allCustomFields, entityType],
  );

  const [singular, setSingular] = React.useState(terminology.singularLabel);
  const [plural, setPlural] = React.useState(terminology.pluralLabel);

  React.useEffect(() => {
    if (open) {
      const current = useCrmConfigStore.getState().terminology[entityType];
      setSingular(current.singularLabel);
      setPlural(current.pluralLabel);
    }
  }, [open, entityType]);

  const allActive = [...coreFields, ...customFields]
    .filter((f) => !f.archivedAt)
    .sort((a, b) => a.position - b.position);
  const archivedCustom = customFields.filter((f) => f.archivedAt).sort((a, b) => a.position - b.position);

  function handleMove(fieldKey: string, direction: "up" | "down") {
    const keys = allActive.map((f) => f.key);
    const index = keys.indexOf(fieldKey);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= keys.length) return;
    const next = [...keys];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    store.reorderFields(entityType, next);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Manage {terminology.pluralLabel} Fields</SheetTitle>
          <SheetDescription>
            Rename labels, reorder columns, adjust widths, control visibility, and manage custom fields. Technical field
            keys stay stable.
          </SheetDescription>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/dashboard/crm/templates">Open industry templates</Link>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <FieldGroup className="gap-6 py-4">
            <section>
              <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Entity Labels</h3>
              <FieldGroup className="gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor={`terminology-singular-${entityType}`}>Singular</FieldLabel>
                    <Input
                      id={`terminology-singular-${entityType}`}
                      value={singular}
                      onChange={(e) => setSingular(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`terminology-plural-${entityType}`}>Plural</FieldLabel>
                    <Input
                      id={`terminology-plural-${entityType}`}
                      value={plural}
                      onChange={(e) => setPlural(e.target.value)}
                    />
                  </Field>
                </div>
                <FieldDescription>
                  Organization-wide wording shown across pages, buttons, and messages. Routes and technical names never
                  change.
                </FieldDescription>
                <div>
                  <Button
                    size="sm"
                    onClick={() => {
                      store.setTerminology(entityType, {
                        singularLabel: singular.trim() || terminology.singularLabel,
                        pluralLabel: plural.trim() || terminology.pluralLabel,
                      });
                      toast("Entity labels updated", {
                        description: `${terminology.pluralLabel} now display as “${plural.trim() || terminology.pluralLabel}”.`,
                      });
                    }}
                  >
                    Save Labels
                  </Button>
                </div>
              </FieldGroup>
            </section>

            <Separator />

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Core &amp; Custom Columns
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    store.resetEntityLayout(entityType);
                    toast("Table layout reset", {
                      description: "Default labels, order, visibility, widths, and sorting restored.",
                    });
                  }}
                >
                  <RotateCcw className="size-3.5" />
                  Reset Table Layout
                </Button>
              </div>
              <ul className="flex flex-col gap-2">
                {allActive.map((field, index) => (
                  <FieldRow
                    key={field.id}
                    field={field}
                    canMoveUp={index > 0}
                    canMoveDown={index < allActive.length - 1}
                    onMove={handleMove}
                    onRename={(fieldId, label) => store.renameFieldLabel(fieldId, label)}
                    onRestoreDefaultLabel={(fieldId) => store.restoreFieldDefaultLabel(fieldId)}
                    onVisibilityChange={(fieldId, scope, visible) => store.setFieldVisibility(fieldId, scope, visible)}
                    onWidthChange={(fieldId, width) => store.setFieldWidth(fieldId, width)}
                    onEdit={onEditField}
                    onArchive={(target) => {
                      store.archiveField(target.id);
                      toast(`${target.displayLabel} archived`, {
                        description: "Saved values are preserved and the field can be restored.",
                      });
                    }}
                  />
                ))}
              </ul>
            </section>

            {archivedCustom.length > 0 ? (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Archived Custom Fields
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {archivedCustom.map((field) => (
                      <FieldRow
                        key={field.id}
                        field={field}
                        canMoveUp={false}
                        canMoveDown={false}
                        onMove={() => undefined}
                        onRename={(fieldId, label) => store.renameFieldLabel(fieldId, label)}
                        onRestoreDefaultLabel={(fieldId) => store.restoreFieldDefaultLabel(fieldId)}
                        onVisibilityChange={(fieldId, scope, visible) =>
                          store.setFieldVisibility(fieldId, scope, visible)
                        }
                        onWidthChange={(fieldId, width) => store.setFieldWidth(fieldId, width)}
                        onRestore={(target) => {
                          store.restoreField(target.id);
                          toast(`${target.displayLabel} restored`, {
                            description: "The field is available again with its saved values.",
                          });
                        }}
                      />
                    ))}
                  </ul>
                </section>
              </>
            ) : null}
          </FieldGroup>
        </div>

        <SheetFooter className="border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
