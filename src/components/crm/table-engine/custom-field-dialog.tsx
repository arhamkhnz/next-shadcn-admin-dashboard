"use client";

import * as React from "react";

import { Plus, Trash2 } from "lucide-react";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getCrmEntityConfig } from "@/lib/crm-table-engine/entities";
import type { CrmEntityType } from "@/lib/crm-table-engine/types";
import {
  CUSTOM_FIELD_TYPE_LABELS,
  type CustomFieldType,
  type CustomFieldValue,
  type SelectOption,
  type TableField,
} from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

const SELECT_TYPES: readonly CustomFieldType[] = ["single_select", "multi_select"];

type OptionDraft = { id: string; label: string };

function defaultValueInputType(type: CustomFieldType): string {
  if (type === "date") return "date";
  if (type === "date_time") return "datetime-local";
  if (type === "email") return "email";
  if (type === "phone") return "tel";
  if (type === "url") return "url";
  if (["number", "currency", "percentage"].includes(type)) return "number";
  return "text";
}

function DefaultValueInput({
  type,
  options,
  value,
  onChange,
}: {
  type: CustomFieldType;
  options: SelectOption[];
  value: CustomFieldValue | undefined;
  onChange: (value: CustomFieldValue | undefined) => void;
}) {
  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <Switch checked={value === true} onCheckedChange={(checked) => onChange(checked)} />
        <span className="text-muted-foreground text-sm">Default checked</span>
      </div>
    );
  }
  if (type === "multi_select") {
    return <p className="text-muted-foreground text-sm">Multi-select fields start empty for new records.</p>;
  }
  if (type === "single_select") {
    return (
      <Select
        value={typeof value === "string" && value ? value : "__none__"}
        onValueChange={(next) => onChange(next === "__none__" ? undefined : next)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="No default" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="__none__">No default</SelectItem>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  if (type === "long_text") {
    return (
      <Textarea
        rows={2}
        value={typeof value === "string" ? value : ""}
        placeholder="Default text for new records"
        onChange={(event) => onChange(event.target.value === "" ? undefined : event.target.value)}
      />
    );
  }
  const resolvedInputType = defaultValueInputType(type);
  return (
    <Input
      type={resolvedInputType}
      value={typeof value === "string" || typeof value === "number" ? String(value) : ""}
      placeholder="Default value for new records"
      onChange={(event) => {
        const raw = event.target.value;
        if (raw === "") {
          onChange(undefined);
          return;
        }
        onChange(["number", "currency", "percentage"].includes(type) ? Number(raw) : raw);
      }}
    />
  );
}

export function CustomFieldDialog({
  open,
  onOpenChange,
  entityType,
  field,
  initialType,
  hasValues = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: CrmEntityType;
  field: TableField | null;
  initialType?: CustomFieldType;
  hasValues?: boolean;
}) {
  const addCustomField = useCrmConfigStore((s) => s.addCustomField);
  const updateCustomField = useCrmConfigStore((s) => s.updateCustomField);
  const allowedTypes = getCrmEntityConfig(entityType).allowedCustomFieldTypes;

  const isEditing = Boolean(field);
  const [displayLabel, setDisplayLabel] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<CustomFieldType>("text");
  const [required, setRequired] = React.useState(false);
  const [visibleInTable, setVisibleInTable] = React.useState(true);
  const [visibleInForm, setVisibleInForm] = React.useState(true);
  const [defaultValue, setDefaultValue] = React.useState<CustomFieldValue | undefined>(undefined);
  const [options, setOptions] = React.useState<OptionDraft[]>([]);
  const [width, setWidth] = React.useState("176");
  const [errors, setErrors] = React.useState<{ label?: string; options?: string; width?: string; type?: string }>({});

  React.useEffect(() => {
    if (!open) return;
    setErrors({});
    if (field) {
      setDisplayLabel(field.displayLabel);
      setDescription(field.description ?? "");
      setType(field.type);
      setRequired(field.required);
      setVisibleInTable(field.visibleInTable);
      setVisibleInForm(field.visibleInForm);
      setDefaultValue(field.defaultValue);
      setOptions(structuredClone(field.options ?? []));
      setWidth(String(field.width));
    } else {
      setDisplayLabel("");
      setDescription("");
      setType(initialType ?? "text");
      setRequired(false);
      setVisibleInTable(true);
      setVisibleInForm(true);
      setDefaultValue(undefined);
      setOptions([]);
      setWidth("176");
    }
  }, [open, field, initialType]);

  function addOption() {
    setOptions((prev) => [...prev, { id: `opt-draft-${Date.now().toString(36)}-${prev.length}`, label: "" }]);
  }

  function handleSave() {
    const nextErrors: typeof errors = {};
    if (!displayLabel.trim()) nextErrors.label = "Field label is required.";
    if (!allowedTypes.includes(type)) nextErrors.type = "This field type is not allowed for this entity.";
    if (SELECT_TYPES.includes(type)) {
      const cleaned = options.map((option) => ({ ...option, label: option.label.trim() }));
      if (cleaned.length === 0 || cleaned.some((option) => !option.label)) {
        nextErrors.options = "Add at least one option and give every option a label.";
      }
    }
    const widthNumber = Number(width);
    if (!Number.isFinite(widthNumber) || widthNumber < 72 || widthNumber > 640) {
      nextErrors.width = "Column width must be between 72 and 640.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const cleanedOptions = SELECT_TYPES.includes(type)
      ? options.map((option) => ({ ...option, label: option.label.trim() }))
      : undefined;

    if (isEditing && field) {
      updateCustomField(field.id, {
        displayLabel: displayLabel.trim(),
        description,
        ...(hasValues ? {} : { type }),
        required,
        visibleInTable,
        visibleInForm,
        width: Math.round(widthNumber),
        options: cleanedOptions,
        defaultValue,
      });
      toast(`${displayLabel.trim()} updated`, { description: "Custom field configuration saved." });
    } else {
      addCustomField({
        entityType,
        displayLabel: displayLabel.trim(),
        description,
        type,
        required,
        visibleInTable,
        visibleInForm,
        width: Math.round(widthNumber),
        options: cleanedOptions,
        defaultValue,
      });
      toast(`${displayLabel.trim()} created`, { description: "The new column is available in the table." });
    }
    onOpenChange(false);
  }

  const typeLocked = isEditing && hasValues;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Custom Field" : "New Custom Field"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the presentation and behavior of this custom field."
              : "Choose a field type, then configure how it behaves across the table and forms."}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4">
          <Field data-invalid={Boolean(errors.label)}>
            <FieldLabel htmlFor="custom-field-label">Field Label *</FieldLabel>
            <Input
              id="custom-field-label"
              value={displayLabel}
              placeholder="e.g. Budget"
              aria-invalid={Boolean(errors.label)}
              onChange={(event) => setDisplayLabel(event.target.value)}
            />
            {errors.label ? <FieldError errors={[{ message: errors.label }]} /> : null}
          </Field>

          <Field data-invalid={Boolean(errors.type) || Boolean(errors.options)}>
            <FieldLabel htmlFor="custom-field-type">Field Type *</FieldLabel>
            <Select
              value={type}
              disabled={typeLocked}
              onValueChange={(next) => {
                setType(next as CustomFieldType);
                setDefaultValue(undefined);
              }}
            >
              <SelectTrigger id="custom-field-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allowedTypes.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {CUSTOM_FIELD_TYPE_LABELS[entry]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type ? <FieldError errors={[{ message: errors.type }]} /> : null}
            {errors.options ? <FieldError errors={[{ message: errors.options }]} /> : null}
            {typeLocked ? (
              <FieldDescription>
                This field already has saved values, so its type cannot change. Create a new field to use a different
                type.
              </FieldDescription>
            ) : (
              <FieldDescription>The technical key stays stable once the field is created.</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="custom-field-description">Description</FieldLabel>
            <Input
              id="custom-field-description"
              value={description}
              placeholder="Optional hint shown in forms"
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>

          {SELECT_TYPES.includes(type) ? (
            <Field data-invalid={Boolean(errors.options)}>
              <FieldLabel>Options *</FieldLabel>
              <div className="flex flex-col gap-2">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Input
                      aria-label={`Option ${index + 1}`}
                      value={option.label}
                      placeholder={`Option ${index + 1}`}
                      onChange={(event) =>
                        setOptions((prev) =>
                          prev.map((entry) =>
                            entry.id === option.id ? { ...entry, label: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove option ${index + 1}`}
                      disabled={options.length <= 1}
                      onClick={() => setOptions((prev) => prev.filter((entry) => entry.id !== option.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={addOption}>
                  <Plus className="size-3.5" />
                  Add Option
                </Button>
              </div>
            </Field>
          ) : null}

          <Field>
            <FieldLabel>Default Value</FieldLabel>
            <DefaultValueInput type={type} options={options} value={defaultValue} onChange={setDefaultValue} />
            <FieldDescription>Applied only when creating new records.</FieldDescription>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="custom-field-width">Column Width (px)</FieldLabel>
              <Input
                id="custom-field-width"
                type="number"
                min={72}
                max={640}
                value={width}
                aria-invalid={Boolean(errors.width)}
                onChange={(event) => setWidth(event.target.value)}
              />
              {errors.width ? <FieldError errors={[{ message: errors.width }]} /> : null}
            </Field>
            <div className="flex flex-col justify-center gap-3 pt-5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>Required</span>
                <Switch checked={required} onCheckedChange={setRequired} aria-label="Required" />
              </div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>Show in table</span>
                <Switch checked={visibleInTable} onCheckedChange={setVisibleInTable} aria-label="Show in table" />
              </div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>Show in forms</span>
                <Switch checked={visibleInForm} onCheckedChange={setVisibleInForm} aria-label="Show in forms" />
              </div>
            </div>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEditing ? "Save Changes" : "Create Field"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
